import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/repositories/maintenance_repository.dart';

class MaintenanceRepositoryImpl implements MaintenanceRepository {
  final FirebaseFirestore _firestore;

  MaintenanceRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<Map<String, dynamic>>> watchMaintenanceBills(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);
    return _firestore
        .collection('societies/$societyId/maintenance_bills')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return data;
      }).toList();
    });
  }
}
