import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/helper_log_model.dart';
import '../../domain/models/helper_model.dart';
import '../../domain/repositories/helper_repository.dart';

class HelperRepositoryImpl implements HelperRepository {
  final FirebaseFirestore _firestore;

  HelperRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<HelperModel>> watchMyHelpers(
      String societyId, String residentUid) {
    if (societyId.isEmpty || residentUid.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/helpers')
        .where('residentUid', isEqualTo: residentUid)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['societyId'] = societyId;
        return HelperModel.fromMap(data, defaultId: doc.id);
      }).toList();
    });
  }

  @override
  Stream<List<HelperLogModel>> watchTodayHelperLogs(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/helper_logs')
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        return HelperLogModel.fromMap(doc.data(), defaultId: doc.id);
      }).toList();
    });
  }

  @override
  Future<void> registerHelper({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String name,
    required String phone,
    required String type,
    required String govtIdType,
    required String govtIdNumber,
    required String workingDays,
    required String emergencyContact,
  }) async {
    final docRef = _firestore.collection('societies/$societyId/helpers').doc();
    final helperId = docRef.id;
    final qrString = 'GATELINK:HELPER:$societyId:$helperId';

    final docData = {
      'id': helperId,
      'societyId': societyId,
      'name': name.trim(),
      'phone': phone.trim(),
      'type': type,
      'govtIdType': govtIdType,
      'govtIdNumber': govtIdNumber.trim(),
      'workingDays': workingDays.trim(),
      'emergencyContact': emergencyContact.trim(),
      'residentUid': residentUid,
      'residentName': residentName,
      'flatNumber': flatNumber,
      'status': 'Active',
      'isInside': false,
      'qrCodeData': qrString,
      'createdAt': DateTime.now().toIso8601String(),
    };

    await docRef.set(docData);
  }

  @override
  Future<void> updateHelperStatus({
    required String societyId,
    required String helperId,
    required String status,
  }) async {
    await _firestore.doc('societies/$societyId/helpers/$helperId').update({
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  @override
  Future<void> deleteHelper({
    required String societyId,
    required String helperId,
  }) async {
    await _firestore.doc('societies/$societyId/helpers/$helperId').delete();
  }
}
