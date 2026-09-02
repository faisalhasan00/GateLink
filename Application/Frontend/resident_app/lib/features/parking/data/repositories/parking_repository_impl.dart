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

  @override
  Future<void> addVehicle({
    required String societyId,
    required String uid,
    required String slot,
    required String level,
    required String number,
    required String type,
    required String model,
    required String color,
  }) async {
    if (societyId.isEmpty) return;

    await _firestore.collection('societies/$societyId/parking').add({
      'slot': slot,
      'level': level,
      'number': number,
      'type': type,
      'model': model,
      'color': color,
      'status': 'Active',
      'assignedTo': uid,
      'societyId': societyId,
      'createdAt': DateTime.now().toIso8601String(),
    });
  }

  @override
  Future<void> seedDemoVehicles(String societyId, String uid) async {
    if (societyId.isEmpty) return;

    final batch = _firestore.batch();
    final demoVehicles = [
      {
        'slot': 'B1-P402',
        'level': 'Basement 1',
        'number': 'MH 12 QX 4020',
        'type': 'Car',
        'model': 'Hyundai Creta (White)',
        'color': 'Polar White',
        'status': 'Active',
        'assignedTo': uid,
        'societyId': societyId,
        'rfidTag': 'TAG-99402-A',
      },
      {
        'slot': 'B1-P403',
        'level': 'Basement 1',
        'number': 'MH 12 AB 9988',
        'type': 'Two Wheeler',
        'model': 'Ather 450X (Grey)',
        'color': 'Space Grey',
        'status': 'Active',
        'assignedTo': uid,
        'societyId': societyId,
        'rfidTag': 'TAG-99402-B',
      },
    ];

    for (final v in demoVehicles) {
      final docRef =
          _firestore.collection('societies/$societyId/parking').doc();
      batch.set(docRef, v);
    }

    await batch.commit();
  }
}
