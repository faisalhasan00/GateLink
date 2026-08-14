import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/visitor_model.dart';
import '../../domain/repositories/visitor_repository.dart';
import '../../../../core/services/firestore_service.dart';

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
    docData['createdAt'] = DateTime.now().toIso8601String();
    await _firestore.collection('societies/$societyId/visitors').add(docData);
  }
}
