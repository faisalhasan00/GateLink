import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Handles Amenity Bookings, Capacity Quotas, and Approval Workflows.
class AmenityService {
  final FirebaseFirestore _db;
  final String societyId;

  AmenityService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  Stream<QuerySnapshot> amenitiesStream() {
    return _db.collection('societies/$societyId/amenities').snapshots();
  }

  Stream<QuerySnapshot> myBookingsStream(String uid) {
    return _db
        .collection('societies/$societyId/amenity_bookings')
        .where('bookedBy', isEqualTo: uid)
        .snapshots();
  }

  Future<List<String>> getBookedSlotsForDate(
      String amenityId, String date) async {
    final snapshot = await _db
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

  Future<void> bookAmenity({
    required String amenityId,
    required String amenityName,
    required String uid,
    required String userName,
    required String date,
    required String timeSlot,
    int guests = 1,
    String? specialNotes,
    String? flatNumber,
    String? phone,
  }) async {
    // 1. Fetch Amenity Profile for Capacity & Approval Policy
    DocumentSnapshot? amenityDoc;
    try {
      amenityDoc = await _db
          .collection('societies/$societyId/amenities')
          .doc(amenityId)
          .get();
    } catch (_) {}

    final amenityData = amenityDoc?.data() as Map<String, dynamic>? ?? {};
    final approvalPolicy = amenityData['approvalPolicy'] as String? ?? 'auto';
    final maxCapacity = (amenityData['capacity'] as num?)?.toInt() ??
        (amenityData['maxSlots'] as num?)?.toInt() ??
        10;

    // 2. Count Active Bookings for this Date & Time Slot
    final existingSnapshot = await _db
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

    // 3. Determine Initial Status (Auto-Approve vs Manual Admin Approval)
    final initialStatus = (approvalPolicy == 'manual') ? 'pending' : 'approved';
    final remainingSlots = maxCapacity - activeCount - 1;
    final nowStr = DateTime.now().toIso8601String();

    // 4. Add Booking Document
    final docRef =
        await _db.collection('societies/$societyId/amenity_bookings').add({
      'amenityId': amenityId,
      'amenityName': amenityName,
      'bookedBy': uid,
      'residentUid': uid,
      'residentName': userName,
      'flatNumber': flatNumber ?? '',
      'phone': phone ?? '',
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

    // 5. Update live availableSlots on Amenity Document
    try {
      final remainingForDoc = remainingSlots < 0 ? 0 : remainingSlots;
      await _db
          .collection('societies/$societyId/amenities')
          .doc(amenityId)
          .update({
        'availableSlots': remainingForDoc,
        'updatedAt': nowStr,
      });
    } catch (_) {}

    // 6. Alert Society Admin if Manual Approval Required
    if (initialStatus == 'pending') {
      try {
        await _db.collection('societies/$societyId/notifications').add({
          'title': '📅 New Amenity Booking Request',
          'message':
              '$userName requested a booking for $amenityName on $date ($timeSlot).',
          'type': 'amenity',
          'bookingId': docRef.id,
          'read': false,
          'createdAt': nowStr,
        });
      } catch (err) {
        print('Notification error: $err');
      }
    }
  }

  Future<void> cancelAmenityBooking(String bookingId, String userUid) async {
    final docSnap = await _db
        .collection('societies/$societyId/amenity_bookings')
        .doc(bookingId)
        .get();
    final amenityId = docSnap.data()?['amenityId'] as String?;

    await _db
        .collection('societies/$societyId/amenity_bookings')
        .doc(bookingId)
        .update({
      'status': 'cancelled',
      'cancelledBy': userUid,
      'cancelledAt': DateTime.now().toIso8601String(),
    });

    if (amenityId != null) {
      try {
        final amenityDoc = await _db
            .collection('societies/$societyId/amenities')
            .doc(amenityId)
            .get();
        final currentCap =
            (amenityDoc.data()?['capacity'] as num?)?.toInt() ?? 10;
        final currentSlots =
            (amenityDoc.data()?['availableSlots'] as num?)?.toInt() ??
                currentCap;
        await _db
            .collection('societies/$societyId/amenities')
            .doc(amenityId)
            .update({
          'availableSlots':
              (currentSlots + 1) > currentCap ? currentCap : (currentSlots + 1),
        });
      } catch (_) {}
    }
  }
}
