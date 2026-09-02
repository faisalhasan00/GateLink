import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/amenity_model.dart';
import '../../domain/models/amenity_booking_model.dart';
import '../../domain/repositories/amenity_repository.dart';

class AmenityRepositoryImpl implements AmenityRepository {
  final FirebaseFirestore _firestore;

  AmenityRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<AmenityModel>> watchAmenities(String societyId) {
    return _firestore
        .collection('societies/$societyId/amenities')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => AmenityModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  @override
  Stream<List<AmenityBookingModel>> watchMyBookings(
      String societyId, String uid) {
    return _firestore
        .collection('societies/$societyId/amenity_bookings')
        .where('bookedBy', isEqualTo: uid)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => AmenityBookingModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  @override
  Stream<List<AmenityBookingModel>> watchAllBookings(String societyId) {
    return _firestore
        .collection('societies/$societyId/amenity_bookings')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => AmenityBookingModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  @override
  Future<AmenityModel?> fetchAmenityById(
      String societyId, String amenityId) async {
    final docSnap = await _firestore
        .collection('societies/$societyId/amenities')
        .doc(amenityId)
        .get();

    if (!docSnap.exists || docSnap.data() == null) return null;
    return AmenityModel.fromMap(docSnap.data()!, docSnap.id);
  }

  @override
  Future<List<String>> getBookedSlotsForDate(
      String societyId, String amenityId, String date) async {
    final snapshot = await _firestore
        .collection('societies/$societyId/amenity_bookings')
        .where('amenityId', isEqualTo: amenityId)
        .where('date', isEqualTo: date)
        .where('status', isEqualTo: 'confirmed')
        .get();

    return snapshot.docs
        .map((doc) => doc.data()['timeSlot'] as String?)
        .whereType<String>()
        .toList();
  }

  @override
  Future<void> bookAmenity({
    required String societyId,
    required String amenityId,
    required String amenityName,
    required String uid,
    required String userName,
    required String flatNumber,
    required String phone,
    required String date,
    required String timeSlot,
    int guests = 1,
    String? specialNotes,
  }) async {
    // Fetch amenity for quota verification
    final amenityDoc = await _firestore
        .collection('societies/$societyId/amenities')
        .doc(amenityId)
        .get();

    final amenityData = amenityDoc.data() ?? {};
    final approvalPolicy = amenityData['approvalPolicy'] as String? ?? 'auto';
    final maxCapacity = (amenityData['capacity'] as num?)?.toInt() ??
        (amenityData['maxSlots'] as num?)?.toInt() ??
        10;

    // Count existing active bookings for date & timeSlot
    final existingSnapshot = await _firestore
        .collection('societies/$societyId/amenity_bookings')
        .where('amenityId', isEqualTo: amenityId)
        .where('date', isEqualTo: date)
        .where('timeSlot', isEqualTo: timeSlot)
        .get();

    final activeCount = existingSnapshot.docs.where((doc) {
      final st = (doc.data()['status'] as String? ?? '').toLowerCase();
      return st == 'approved' || st == 'confirmed' || st == 'pending';
    }).length;

    if (activeCount >= maxCapacity) {
      throw Exception(
          'Slot Sold Out! All $maxCapacity available slots for $timeSlot on $date are already booked.');
    }

    final initialStatus = (approvalPolicy == 'manual') ? 'pending' : 'approved';
    final remainingSlots = maxCapacity - activeCount - 1;
    final nowStr = DateTime.now().toIso8601String();

    await _firestore.collection('societies/$societyId/amenity_bookings').add({
      'amenityId': amenityId,
      'amenityName': amenityName,
      'bookedBy': uid,
      'residentUid': uid,
      'residentName': userName,
      'flatNumber': flatNumber,
      'phone': phone,
      'userName': userName,
      'uid': uid,
      'date': date,
      'bookingDate': date,
      'timeSlot': timeSlot,
      'guests': guests,
      'specialNotes': specialNotes ?? '',
      'status': initialStatus,
      'approvalPolicy': approvalPolicy,
      'slotsRemaining': remainingSlots < 0 ? 0 : remainingSlots,
      'capacityQuota': maxCapacity,
      'societyId': societyId,
      'createdAt': nowStr,
    });
  }

  @override
  Future<void> cancelAmenityBooking(
      String societyId, String bookingId, String uid) async {
    final docRef = _firestore
        .collection('societies/$societyId/amenity_bookings')
        .doc(bookingId);

    final docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw Exception('Booking document not found.');
    }

    final data = docSnap.data() ?? {};
    final bookedBy =
        data['bookedBy'] as String? ?? data['uid'] as String? ?? '';
    if (bookedBy.isNotEmpty && bookedBy != uid) {
      throw Exception('Unauthorized to cancel this booking.');
    }

    await docRef.update({
      'status': 'cancelled',
      'cancelledAt': DateTime.now().toIso8601String(),
    });
  }

  @override
  Future<void> seedDefaultAmenities(String societyId) async {
    final batch = _firestore.batch();
    final items = [
      {
        'name': 'Swimming Pool',
        'iconKey': 'pool',
        'timing': '6:00 AM - 9:00 PM',
        'available': true,
        'capacity': 15,
        'availableSlots': 15,
        'fee': 'Free',
        'approvalPolicy': 'auto',
        'location': 'Clubhouse Level 1'
      },
      {
        'name': 'Fitness Center',
        'iconKey': 'gym',
        'timing': '5:00 AM - 11:00 PM',
        'available': true,
        'capacity': 30,
        'availableSlots': 30,
        'fee': 'Free',
        'approvalPolicy': 'auto',
        'location': 'Block A Ground'
      },
      {
        'name': 'Clubhouse Main Hall',
        'iconKey': 'clubhouse',
        'timing': '8:00 AM - 10:00 PM',
        'available': true,
        'capacity': 5,
        'availableSlots': 5,
        'fee': '₹1,500/slot',
        'approvalPolicy': 'manual',
        'location': 'Main Clubhouse'
      },
      {
        'name': 'Tennis Court',
        'iconKey': 'tennis',
        'timing': '6:00 AM - 8:00 PM',
        'available': true,
        'capacity': 8,
        'availableSlots': 8,
        'fee': 'Free',
        'approvalPolicy': 'auto',
        'location': 'Sports Complex'
      },
      {
        'name': 'Badminton Court',
        'iconKey': 'badminton',
        'timing': '6:00 AM - 10:00 PM',
        'available': true,
        'capacity': 10,
        'availableSlots': 10,
        'fee': 'Free',
        'approvalPolicy': 'auto',
        'location': 'Indoor Arena'
      },
      {
        'name': 'Kids Play Zone',
        'iconKey': 'kids',
        'timing': '7:00 AM - 8:00 PM',
        'available': true,
        'capacity': 20,
        'availableSlots': 20,
        'fee': 'Free',
        'approvalPolicy': 'auto',
        'location': 'Central Park'
      },
      {
        'name': 'Community Garden',
        'iconKey': 'garden',
        'timing': '6:00 AM - 7:00 PM',
        'available': true,
        'capacity': 50,
        'availableSlots': 50,
        'fee': 'Free',
        'approvalPolicy': 'auto',
        'location': 'East Lawn'
      },
    ];

    for (final item in items) {
      final docRef =
          _firestore.collection('societies/$societyId/amenities').doc();
      batch.set(docRef, item);
    }

    await batch.commit();
  }
}
