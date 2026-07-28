import 'package:cloud_firestore/cloud_firestore.dart';

// The society ID this app is currently managing.
// In a real app, this would be set during login based on the guard's profile.
const String kCurrentSocietyId = 'SOC-001';

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

  Future<String> logVisitorEntry({
    required String name,
    required String type,
    required String hostFlat,
    String? phone,
    String? vehicleNumber,
    String? company,
  }) async {
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
    });
    return docRef.id;
  }

  Future<void> markVisitorExit(String visitorId) async {
    await _db
        .collection('societies/$societyId/visitors')
        .doc(visitorId)
        .update({
      'exitTime': DateTime.now().toIso8601String(),
      'status': 'left',
    });
  }

  Future<void> updateVisitorStatus(String visitorId, String status) async {
    await _db
        .collection('societies/$societyId/visitors')
        .doc(visitorId)
        .update({
      'status': status,
    });
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

  // ── MAINTENANCE BILLS ────────────────────────────────────────────────────

  Stream<QuerySnapshot> maintenanceBillsStream(String uid) {
    return _db
        .collection('societies/$societyId/maintenance_bills')
        .where('residentUid', isEqualTo: uid)
        .snapshots();
  }

  Future<void> payMaintenanceBill(String billId) async {
    await _db
        .collection('societies/$societyId/maintenance_bills')
        .doc(billId)
        .update({
      'status': 'paid',
      'paidAt': DateTime.now().toIso8601String(),
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
  }) async {
    await _db.collection('societies/$societyId/amenity_bookings').add({
      'amenityId': amenityId,
      'amenityName': amenityName,
      'bookedBy': uid,
      'userName': userName,
      'date': date,
      'timeSlot': timeSlot,
      'status': 'confirmed',
      'createdAt': DateTime.now().toIso8601String(),
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
