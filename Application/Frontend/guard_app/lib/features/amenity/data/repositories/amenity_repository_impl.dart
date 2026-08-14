import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/repositories/amenity_repository.dart';

class AmenityRepositoryImpl implements AmenityRepository {
  final FirebaseFirestore _firestore;

  AmenityRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<Map<String, dynamic>>> watchAmenities(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);
    return _firestore
        .collection('societies/$societyId/amenities')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return data;
      }).toList();
    });
  }

  @override
  Stream<List<Map<String, dynamic>>> watchAmenityBookings(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);
    return _firestore
        .collection('societies/$societyId/amenity_bookings')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return data;
      }).toList();
    });
  }

  @override
  Future<void> bookAmenity(String societyId, Map<String, dynamic> bookingData) async {
    if (societyId.isEmpty) throw ArgumentError('Society ID is required');
    await _firestore.collection('societies/$societyId/amenity_bookings').add(bookingData);
  }
}
