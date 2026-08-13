import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/complaint_model.dart';
import '../../domain/repositories/complaint_repository.dart';

class ComplaintRepositoryImpl implements ComplaintRepository {
  final FirebaseFirestore _firestore;

  ComplaintRepositoryImpl(this._firestore);

  @override
  Stream<List<ComplaintModel>> watchComplaints(String societyId) {
    return _firestore
        .collection('societies/$societyId/complaints')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => ComplaintModel.fromFirestore(doc)).toList();
    });
  }
}
