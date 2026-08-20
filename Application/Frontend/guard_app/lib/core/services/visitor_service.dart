import 'package:cloud_firestore/cloud_firestore.dart';
import 'flat_validation_service.dart';
import 'visitor_pass_service.dart';

// Re-export for seamless backward compatibility
export 'flat_validation_service.dart';
export 'visitor_pass_service.dart';

/// Domain Micro-Service: Dedicated Visitor Management, Streams, Gate Security Logs, and Approvals for Guard App.
class VisitorService {
  final FirebaseFirestore _db;
  final String societyId;
  final FlatValidationService flatValidationService;
  final VisitorPassService passService;

  VisitorService({
    required this.societyId,
    FirebaseFirestore? db,
    FlatValidationService? flatValidator,
    VisitorPassService? visitorPasses,
  })  : _db = db ?? FirebaseFirestore.instance,
        flatValidationService = flatValidator ??
            FlatValidationService(societyId: societyId, db: db),
        passService = visitorPasses ??
            VisitorPassService(societyId: societyId, db: db);

  // ── STREAMS ───────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> visitorsStream() {
    return _db.collection('societies/$societyId/visitors').snapshots();
  }

  Stream<QuerySnapshot> pendingVisitorsStream() {
    return _db
        .collection('societies/$societyId/visitors')
        .where('status', isEqualTo: 'pending')
        .snapshots();
  }

  Stream<QuerySnapshot> pendingVisitorsForFlatStream(String flatNumber) {
    return _db
        .collection('societies/$societyId/visitors')
        .where('status', isEqualTo: 'pending')
        .where('hostFlat', isEqualTo: flatNumber)
        .snapshots();
  }

  Stream<QuerySnapshot> residentsStream() {
    return _db
        .collection('societies/$societyId/users')
        .where('role', isEqualTo: 'resident')
        .snapshots();
  }

  // ── FLAT VALIDATION DELEGATE ───────────────────────────────────────────────

  Future<FlatValidationResult> validateFlat(String hostFlat) =>
      flatValidationService.validateFlat(hostFlat);

  // ── QR / PASSCODE DELEGATES ────────────────────────────────────────────────

  Future<Map<String, dynamic>> validateAndProcessQrScan(String code) =>
      passService.validateAndProcessQrScan(code);

  Future<Map<String, String>> inviteVisitor({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
  }) =>
      passService.createInvitePass(
        name: name,
        phone: phone,
        purpose: purpose,
        hostFlat: hostFlat,
        invitedBy: invitedBy,
        expectedDate: expectedDate,
        expectedTime: expectedTime,
      );

  // ── VISITOR LOGGING & OPERATIONS ──────────────────────────────────────────

  Future<String> logVisitorEntry({
    required String name,
    required String type,
    required String hostFlat,
    String? phone,
    String? vehicleNumber,
    String? vehicleType,
    String? company,
    String? gender,
    String? photoUrl,
    String? notes,
    String? guardUid,
    String? gateName,
  }) async {
    final validation = await validateFlat(hostFlat);
    if (!validation.isValid) {
      throw Exception(validation.error);
    }

    final cleanPhone = (phone ?? '').trim();

    if (cleanPhone.isNotEmpty) {
      final dupSnapshot = await _db
          .collection('societies/$societyId/visitors')
          .where('hostFlat', isEqualTo: hostFlat)
          .where('phone', isEqualTo: cleanPhone)
          .where('status', isEqualTo: 'pending')
          .get();

      if (dupSnapshot.docs.isNotEmpty) {
        throw Exception('A pending visitor request already exists for this mobile number ($cleanPhone).');
      }
    }

    final nowStr = DateTime.now().toIso8601String();
    final docRef = await _db
        .collection('societies/$societyId/visitors')
        .add({
      'name': name,
      'type': type,
      'hostFlat': hostFlat,
      'phone': cleanPhone,
      'vehicleNumber': vehicleNumber ?? '',
      'vehicleType': vehicleType ?? '4-Wheeler',
      'company': company ?? '',
      'gender': gender ?? 'Not Specified',
      'photoUrl': photoUrl,
      'notes': notes ?? '',
      'entryTime': null,
      'exitTime': null,
      'status': 'pending',
      'societyId': societyId,
      'createdDate': nowStr,
      'createdAt': nowStr,
      'guardUid': guardUid ?? 'guard_gate_1',
      'gateName': gateName ?? 'Gate 1 — Main Entry',
      'hostResidentName': validation.residentName,
      'hostResidentUid': validation.residentUid,
    });

    if (validation.residentUid != null && validation.residentUid!.isNotEmpty) {
      try {
        await _db
            .collection('societies/$societyId/users/${validation.residentUid}/notifications')
            .add({
          'title': '🔔 New Visitor Request',
          'body': '$name ($type) is waiting at ${gateName ?? "Gate 1"} for Flat $hostFlat.',
          'type': 'visitor_pending',
          'visitorId': docRef.id,
          'read': false,
          'createdAt': nowStr,
        });
      } catch (_) {}
    }

    return docRef.id;
  }

  Future<void> markVisitorExit(String visitorId) async {
    final docRef = _db.collection('societies/$societyId/visitors').doc(visitorId);
    final doc = await docRef.get();
    final exitNow = DateTime.now();
    final exitStr = exitNow.toIso8601String();

    int durationMinutes = 0;
    String durationString = 'Just left';

    if (doc.exists) {
      final data = doc.data();
      final entryStr = data?['entryTime'] as String?;
      if (entryStr != null && entryStr.isNotEmpty) {
        try {
          final entryTime = DateTime.parse(entryStr);
          final diff = exitNow.difference(entryTime);
          durationMinutes = diff.inMinutes;
          final hours = durationMinutes ~/ 60;
          final mins = durationMinutes % 60;
          if (hours > 0) {
            durationString = '$hours Hr${hours > 1 ? "s" : ""} $mins Min${mins != 1 ? "s" : ""}';
          } else {
            durationString = '$mins Min${mins != 1 ? "s" : ""}';
          }
        } catch (_) {}
      }
    }

    await docRef.update({
      'exitTime': exitStr,
      'status': 'checked_out',
      'durationMinutes': durationMinutes,
      'durationString': durationString,
      'updatedAt': exitStr,
    });
  }

  Future<void> updateVisitorStatus(String visitorId, String status) async {
    await _db
        .collection('societies/$societyId/visitors')
        .doc(visitorId)
        .update({
      'status': status,
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updateVisitorApproval({
    required String visitorId,
    required String status,
    required String residentUid,
    String? rejectionReason,
  }) async {
    final nowStr = DateTime.now().toIso8601String();
    final updateData = <String, dynamic>{
      'status': status,
      'updatedAt': nowStr,
    };

    if (status == 'approved') {
      updateData['approvedAt'] = nowStr;
      updateData['approvedBy'] = residentUid;
    } else if (status == 'rejected' || status == 'denied') {
      updateData['rejectedAt'] = nowStr;
      updateData['rejectedBy'] = residentUid;
      if (rejectionReason != null) {
        updateData['rejectionReason'] = rejectionReason;
      }
    }

    await _db
        .collection('societies/$societyId/visitors')
        .doc(visitorId)
        .update(updateData);
  }
}
