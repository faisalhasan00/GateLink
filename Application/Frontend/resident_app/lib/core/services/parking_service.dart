import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Handles Resident Parking Bays and Allocations.
class ParkingService {
  final FirebaseFirestore _db;
  final String societyId;

  ParkingService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  Stream<QuerySnapshot> parkingStream(String uid) {
    if (societyId.isEmpty || uid.isEmpty) return const Stream.empty();
    return _db
        .collection('societies/$societyId/parking')
        .where('residentUid', isEqualTo: uid)
        .snapshots();
  }
}
