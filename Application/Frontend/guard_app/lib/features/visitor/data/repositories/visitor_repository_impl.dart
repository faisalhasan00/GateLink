import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/visitor_model.dart';
import '../../domain/repositories/visitor_repository.dart';
import '../../../../core/services/firestore_service.dart';
import '../../../../core/services/fcm_push_service.dart';

class VisitorRepositoryImpl implements VisitorRepository {
  final FirebaseFirestore _firestore;

  VisitorRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<VisitorModel>> watchTodayVisitors(String societyId) {
    if (societyId.isEmpty) {
      return Stream.value([]);
    }
    return _firestore
        .collection('societies/$societyId/visitors')
        .snapshots()
        .map((snapshot) {
      final list = snapshot.docs
          .map((doc) => VisitorModel.fromMap(doc.data(), doc.id))
          .toList();
      list.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return list;
    });
  }

  @override
  Future<Map<String, dynamic>> validateAndProcessQrScan(String societyId, String qrCode) async {
    if (societyId.isEmpty) {
      throw ArgumentError('Society ID cannot be empty');
    }
    final service = FirestoreService(societyId: societyId);
    return await service.validateAndProcessQrScan(qrCode);
  }

  @override
  Future<void> updateVisitorStatus(String societyId, String visitorId, String status) async {
    if (societyId.isEmpty || visitorId.isEmpty) {
      throw ArgumentError('Society ID and Visitor ID are required');
    }
    final updateData = <String, dynamic>{
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    };
    if (status == 'inside') {
      updateData['entryTime'] = DateTime.now().toIso8601String();
    } else if (status == 'left') {
      updateData['exitTime'] = DateTime.now().toIso8601String();
    }
    await _firestore
        .doc('societies/$societyId/visitors/$visitorId')
        .update(updateData);
  }

  @override
  Future<void> markVisitorExit(String societyId, String visitorId) async {
    await updateVisitorStatus(societyId, visitorId, 'left');
  }

  @override
  Future<void> approveVisitorEntry(String societyId, String visitorId) async {
    await updateVisitorStatus(societyId, visitorId, 'inside');
  }

  @override
  Future<void> logVisitorEntry(String societyId, VisitorModel visitor) async {
    if (societyId.isEmpty) {
      throw ArgumentError('Society ID is required');
    }
    final docData = visitor.toMap();
    final nowStr = DateTime.now().toIso8601String();
    docData['createdAt'] = nowStr;
    final docRef = await _firestore.collection('societies/$societyId/visitors').add(docData);

    // Send Realtime Notification to the Host Resident
    final resUid = visitor.hostResidentUid;
    if (resUid != null && resUid.isNotEmpty) {
      final notifData = {
        'title': '🚪 Visitor at Gate — Flat ${visitor.hostFlat}',
        'body': '${visitor.name} (${visitor.type}) is waiting for your entry approval at ${visitor.gateName ?? "Main Gate"}.',
        'type': 'visitor_pending',
        'visitorId': docRef.id,
        'visitorName': visitor.name,
        'visitorType': visitor.type,
        'hostFlat': visitor.hostFlat,
        'read': false,
        'createdAt': nowStr,
      };

      try {
        await _firestore
            .collection('societies/$societyId/users/$resUid/notifications')
            .add(notifData);
      } catch (_) {}

      try {
        await _firestore
            .collection('users/$resUid/notifications')
            .add(notifData);
      } catch (_) {}

      // Fetch FCM Token and dispatch background wake-up
      try {
        String? fcmToken;
        final rootUser = await _firestore.collection('users').doc(resUid).get();
        if (rootUser.exists) {
          fcmToken = rootUser.data()?['fcmToken'] as String?;
        }
        if (fcmToken == null || fcmToken.isEmpty) {
          final subUser = await _firestore
              .collection('societies/$societyId/users')
              .doc(resUid)
              .get();
          if (subUser.exists) {
            fcmToken = subUser.data()?['fcmToken'] as String?;
          }
        }

        // Fallback: search by flat number in users collection
        if (fcmToken == null || fcmToken.isEmpty) {
          final q = await _firestore
              .collection('users')
              .where('societyId', isEqualTo: societyId)
              .where('flatNumber', isEqualTo: visitor.hostFlat)
              .limit(1)
              .get();
          if (q.docs.isNotEmpty) {
            fcmToken = q.docs.first.data()['fcmToken'] as String?;
          }
        }

        debugPrint('FCM Dispatch: target resident $resUid, flat ${visitor.hostFlat}, token found: ${fcmToken != null && fcmToken.isNotEmpty}');

        if (fcmToken != null && fcmToken.isNotEmpty) {
          final success = await FcmPushService.sendVisitorNotification(
            fcmToken: fcmToken,
            visitorName: visitor.name,
            visitorType: visitor.type,
            hostFlat: visitor.hostFlat,
            visitorId: docRef.id,
            societyId: societyId,
          );
          debugPrint('FCM Dispatch result: $success');
        }
      } catch (e) {
        debugPrint('FCM Token resolution error: $e');
      }
    }
  }
}
