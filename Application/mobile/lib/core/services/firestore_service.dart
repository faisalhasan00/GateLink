import 'package:cloud_firestore/cloud_firestore.dart';

// The society ID this app is currently managing.
// In a real app, this would be set during login based on the guard's profile.
const String kCurrentSocietyId = 'SOC-001';

class FlatValidationResult {
  final bool isValid;
  final String? residentName;
  final String? residentUid;
  final String? error;

  FlatValidationResult({
    required this.isValid,
    this.residentName,
    this.residentUid,
    this.error,
  });
}

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final String societyId;

  FirestoreService({required this.societyId});

  // ── VISITORS ──────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> visitorsStream() {
    return _db
        .collection('societies/$societyId/visitors')
        .orderBy('entryTime', descending: true)
        .snapshots();
  }

  // ── FLAT VALIDATION ───────────────────────────────────────────────────────

  /// Validates that a target flat exists in the society and has an assigned resident.
  Future<FlatValidationResult> validateFlat(String hostFlat) async {
    final trimmedFlat = hostFlat.trim();
    if (trimmedFlat.isEmpty) {
      return FlatValidationResult(isValid: false, error: 'Flat Number is required');
    }

    try {
      final querySnapshot = await _db
          .collection('societies/$societyId/users')
          .where('flatNumber', isEqualTo: trimmedFlat)
          .where('role', isEqualTo: 'resident')
          .get();

      if (querySnapshot.docs.isEmpty) {
        // Check if flat exists at all or has no resident
        final anyUserWithFlat = await _db
            .collection('societies/$societyId/users')
            .where('flatNumber', isEqualTo: trimmedFlat)
            .get();

        if (anyUserWithFlat.docs.isEmpty) {
          return FlatValidationResult(isValid: false, error: 'Flat Number Not Found');
        }
        return FlatValidationResult(isValid: false, error: 'No Resident Assigned to this Flat');
      }

      final residentData = querySnapshot.docs.first.data();
      final residentName = residentData['name'] ?? 'Resident';
      return FlatValidationResult(
        isValid: true, 
        residentName: residentName,
        residentUid: querySnapshot.docs.first.id,
      );
    } catch (e) {
      return FlatValidationResult(isValid: false, error: 'Flat validation error: $e');
    }
  }

  Future<String> logVisitorEntry({
    required String name,
    required String type,
    required String hostFlat,
    String? phone,
    String? vehicleNumber,
    String? company,
    String? guardUid,
  }) async {
    // 1. Strict Flat Validation
    final validation = await validateFlat(hostFlat);
    if (!validation.isValid) {
      throw Exception(validation.error);
    }

    // 2. Write Document
    final nowStr = DateTime.now().toIso8601String();
    final docRef = await _db
        .collection('societies/$societyId/visitors')
        .add({
      'name': name,
      'type': type,
      'hostFlat': hostFlat,
      'phone': phone ?? '',
      'vehicleNumber': vehicleNumber ?? '',
      'company': company ?? '',
      'entryTime': null,
      'exitTime': null,
      'status': 'pending',
      'societyId': societyId,
      'createdDate': nowStr,
      'guardUid': guardUid ?? 'guard_gate_1',
      'hostResidentName': validation.residentName,
      'hostResidentUid': validation.residentUid,
    });
    return docRef.id;
  }

  Future<void> markVisitorExit(String visitorId) async {
    await _db
        .collection('societies/$societyId/visitors')
        .doc(visitorId)
        .update({
      'exitTime': DateTime.now().toIso8601String(),
      'status': 'checked_out',
    });
  }

  Future<void> updateVisitorStatus(String visitorId, String status) async {
    await _db
        .collection('societies/$societyId/visitors')
        .doc(visitorId)
        .update({
      'status': status,
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updateVisitorApproval({
    required String visitorId,
    required String status, // 'approved' or 'rejected'
    required String residentUid,
    String? rejectionReason,
  }) async {
    final nowStr = DateTime.now().toIso8601String();
    final updateData = <String, dynamic>{
      'status': status,
      'updatedAt': nowStr,
    };

    if (status == 'approved') {
      updateData['approvedAt'] = nowStr;
      updateData['approvedBy'] = residentUid;
    } else if (status == 'rejected' || status == 'denied') {
      updateData['rejectedAt'] = nowStr;
      updateData['rejectedBy'] = residentUid;
      if (rejectionReason != null) {
        updateData['rejectionReason'] = rejectionReason;
      }
    }

    await _db
        .collection('societies/$societyId/visitors')
        .doc(visitorId)
        .update(updateData);
  }

  /// Stream of pending visitors for a specific flat (for resident notifications).
  Stream<QuerySnapshot> pendingVisitorsForFlatStream(String flatNumber) {
    return _db
        .collection('societies/$societyId/visitors')
        .where('status', isEqualTo: 'pending')
        .where('hostFlat', isEqualTo: flatNumber)
        .snapshots();
  }

  // ── RESIDENTS ─────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> residentsStream() {
    return _db
        .collection('societies/$societyId/users')
        .where('role', isEqualTo: 'resident')
        .snapshots();
  }

  // ── AD CAMPAIGNS ──────────────────────────────────────────────────────────

  Stream<QuerySnapshot> adCampaignsStream() {
    return _db
        .collection('ad_campaigns')
        .where('status', isEqualTo: 'Active')
        .snapshots();
  }

  // ── COMPLAINTS ────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> complaintsStream(String uid) {
    return _db
        .collection('societies/$societyId/complaints')
        .where('raisedBy', isEqualTo: uid)
        .snapshots();
  }

  Future<String> raiseComplaint({
    required String title,
    required String description,
    required String category,
    required String uid,
    String? block,
    String? floor,
    String? priority,
    String? photoUrl,
  }) async {
    final docRef = await _db.collection('societies/$societyId/complaints').add({
      'title': title,
      'description': description,
      'category': category,
      'status': 'Open',
      'raisedBy': uid,
      'block': block,
      'floor': floor,
      'priority': priority ?? 'medium',
      'photoUrl': photoUrl,
      'createdAt': DateTime.now().toIso8601String(),
    });
    return docRef.id;
  }

  // ── NOTICES ───────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> noticesStream() {
    return _db
        .collection('societies/$societyId/notices')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  // ── MAINTENANCE BILLS & PAYMENTS ─────────────────────────────────────────

  Stream<QuerySnapshot> maintenanceBillsStream(String uid) {
    return _db
        .collection('societies/$societyId/maintenance_bills')
        .where('residentUid', isEqualTo: uid)
        .snapshots();
  }

  Stream<QuerySnapshot> paymentReceiptsStream(String uid) {
    return _db
        .collection('societies/$societyId/payment_receipts')
        .where('residentUid', isEqualTo: uid)
        .snapshots();
  }

  Future<void> payMaintenanceBill({
    required String billId,
    required String residentUid,
    required double amount,
    required String paymentMethod,
    required String invoiceNumber,
    required String billingPeriod,
  }) async {
    final nowStr = DateTime.now().toIso8601String();
    final txnId = 'TXN${DateTime.now().millisecondsSinceEpoch}';

    // 1. Update Bill Document
    await _db
        .collection('societies/$societyId/maintenance_bills')
        .doc(billId)
        .update({
      'status': 'paid',
      'paidAt': nowStr,
      'paymentMethod': paymentMethod,
      'transactionId': txnId,
    });

    // 2. Create Normalized Payment Receipt Document
    await _db.collection('societies/$societyId/payment_receipts').add({
      'billId': billId,
      'residentUid': residentUid,
      'amount': amount,
      'paymentMethod': paymentMethod,
      'transactionId': txnId,
      'invoiceNumber': invoiceNumber,
      'billingPeriod': billingPeriod,
      'status': 'success',
      'paidAt': nowStr,
      'createdAt': nowStr,
      'societyId': societyId,
    });
  }

  // ── AMENITIES ────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> amenitiesStream() {
    return _db
        .collection('societies/$societyId/amenities')
        .snapshots();
  }

  // ── AMENITY BOOKINGS ─────────────────────────────────────────────────────

  Stream<QuerySnapshot> myBookingsStream(String uid) {
    return _db
        .collection('societies/$societyId/amenity_bookings')
        .where('bookedBy', isEqualTo: uid)
        .snapshots();
  }

  Future<List<String>> getBookedSlotsForDate(String amenityId, String date) async {
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
  }) async {
    // 1. Race Condition / Duplicate Check
    final existingSnapshot = await _db
        .collection('societies/$societyId/amenity_bookings')
        .where('amenityId', isEqualTo: amenityId)
        .where('date', isEqualTo: date)
        .where('timeSlot', isEqualTo: timeSlot)
        .where('status', isEqualTo: 'confirmed')
        .get();

    if (existingSnapshot.docs.isNotEmpty) {
      throw Exception('This time slot ($timeSlot) on $date is no longer available.');
    }

    // 2. Add Booking
    await _db.collection('societies/$societyId/amenity_bookings').add({
      'amenityId': amenityId,
      'amenityName': amenityName,
      'bookedBy': uid,
      'userName': userName,
      'uid': uid,
      'date': date,
      'timeSlot': timeSlot,
      'guests': guests,
      'specialNotes': specialNotes ?? '',
      'status': 'confirmed',
      'societyId': societyId,
      'createdAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> cancelAmenityBooking(String bookingId, String userUid) async {
    await _db
        .collection('societies/$societyId/amenity_bookings')
        .doc(bookingId)
        .update({
      'status': 'cancelled',
      'cancelledBy': userUid,
      'cancelledAt': DateTime.now().toIso8601String(),
    });
  }

  // ── PARKING ──────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> parkingStream(String uid) {
    return _db
        .collection('societies/$societyId/parking')
        .where('residentUid', isEqualTo: uid)
        .snapshots();
  }

  // ── DOCUMENTS ────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> documentsStream() {
    return _db
        .collection('societies/$societyId/documents')
        .snapshots();
  }

  // ── VISITOR INVITES ──────────────────────────────────────────────────────

  Future<String> inviteVisitor({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
  }) async {
    final docRef = await _db
        .collection('societies/$societyId/visitors')
        .add({
      'name': name,
      'phone': phone,
      'type': purpose,
      'hostFlat': hostFlat,
      'invitedBy': invitedBy,
      'expectedDate': expectedDate,
      'expectedTime': expectedTime,
      'entryTime': null,
      'exitTime': null,
      'status': 'expected',
      'createdAt': DateTime.now().toIso8601String(),
    });
    return docRef.id;
  }


  // ── NOTIFICATIONS ────────────────────────────────────────────────────────
  
  Stream<QuerySnapshot> notificationsStream(String uid) {
    return _db
        .collection('societies/$societyId/users/$uid/notifications')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }
}
