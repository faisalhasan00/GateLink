import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/parking_slot_model.dart';
import '../../domain/repositories/parking_repository.dart';

class ParkingRepositoryImpl implements ParkingRepository {
  final FirebaseFirestore _firestore;

  ParkingRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<ParkingSlotModel>> watchParkingSlots(
      String societyId, String uid) {
    if (societyId.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/parking')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        return ParkingSlotModel.fromMap(doc.data(), defaultId: doc.id);
      }).toList();
    });
  }

  @override
  Future<List<ParkingSlotModel>> getParkingSlots(
      String societyId, String uid) async {
    if (societyId.isEmpty) return [];

    final snapshot =
        await _firestore.collection('societies/$societyId/parking').get();

    return snapshot.docs.map((doc) {
      return ParkingSlotModel.fromMap(doc.data(), defaultId: doc.id);
    }).toList();
  }
}
