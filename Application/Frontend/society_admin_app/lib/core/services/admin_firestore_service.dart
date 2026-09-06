import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import '../models/society_model.dart';
import '../models/resident_model.dart';
import '../models/visitor_model.dart';
import '../models/complaint_model.dart';
import '../models/maintenance_model.dart';
import '../models/notice_model.dart';
import '../models/sos_model.dart';
import '../models/facility_models.dart';

class AdminFirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // ── 1. SOCIETIES & ADMIN ACCESS ───────────────────────────────────────────
  Future<List<SocietyModel>> getAdminSocieties({
    required String uid,
    String? email,
  }) async {
    try {
      final List<SocietyModel> societies = [];

      // A. Query societies where admin UIDs match
      final queryByAdmin = await _db
          .collection('societies')
          .where('admin_uids', arrayContains: uid)
          .get();

      for (var doc in queryByAdmin.docs) {
        societies.add(SocietyModel.fromFirestore(doc.data(), doc.id));
      }

      // B. Fallback / supplementary query by admin email or created_by
      if (email != null && email.isNotEmpty) {
        final queryByEmail = await _db
            .collection('societies')
            .where('admin_email', isEqualTo: email.toLowerCase())
            .get();

        for (var doc in queryByEmail.docs) {
          if (!societies.any((s) => s.id == doc.id)) {
            societies.add(SocietyModel.fromFirestore(doc.data(), doc.id));
          }
        }
      }

      // C. If still empty, check user document roles
      if (societies.isEmpty) {
        final userDoc = await _db.collection('users').doc(uid).get();
        if (userDoc.exists) {
          final data = userDoc.data()!;
          final societyId = data['society_id'] ?? data['societyId'];
          if (societyId != null && societyId.toString().isNotEmpty) {
            final socDoc = await _db.collection('societies').doc(societyId.toString()).get();
            if (socDoc.exists) {
              societies.add(SocietyModel.fromFirestore(socDoc.data()!, socDoc.id));
            }
          }
        }
      }

      // D. Fallback sample societies for testing / staging if none found
      if (societies.isEmpty) {
        final allSocieties = await _db.collection('societies').limit(5).get();
        for (var doc in allSocieties.docs) {
          societies.add(SocietyModel.fromFirestore(doc.data(), doc.id));
        }
      }

      return societies;
    } catch (e) {
      return [];
    }
  }

  Future<SocietyModel?> getSocietyDetails(String societyId) async {
    try {
      final doc = await _db.collection('societies').doc(societyId).get();
      if (doc.exists) {
        return SocietyModel.fromFirestore(doc.data()!, doc.id);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // ── 2. RESIDENTS ─────────────────────────────────────────────────────────
  Stream<List<ResidentModel>> streamResidents(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('users')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => ResidentModel.fromFirestore(doc.data(), doc.id))
          .where((r) => r.isResident)
          .toList();
    });
  }

  Future<String> addResident(
    String societyId,
    Map<String, dynamic> residentData,
  ) async {
    final email = (residentData['email'] ?? '').toString().trim().toLowerCase();
    final password = (residentData['password'] ?? '').toString().trim();
    final name = (residentData['name'] ?? residentData['fullName'] ?? 'Resident').toString().trim();
    final flat = (residentData['flatNumber'] ?? residentData['flatNo'] ?? '').toString().trim().toUpperCase();
    final wing = (residentData['wing'] ?? '').toString().trim().toUpperCase();
    final phone = (residentData['phone'] ?? residentData['mobileNumber'] ?? '').toString().trim();
    final userType = (residentData['userType'] ?? residentData['ownershipType'] ?? 'owner').toString().toLowerCase();

    // 1. Try calling Cloud Function to provision both Firebase Auth + Firestore
    try {
      final callable = FirebaseFunctions.instance.httpsCallable('createResidentUser');
      final result = await callable.call({
        'societyId': societyId,
        'email': email,
        'password': password,
        'name': name,
        'flatNumber': flat,
        'wing': wing,
        'phone': phone,
        'userType': userType,
        'ownershipType': userType == 'owner' ? 'Owner' : 'Tenant',
      });

      final data = result.data;
      if (data is Map && data['success'] == true && data['uid'] != null) {
        return data['uid'].toString();
      }
    } catch (e) {
      // Fallback to direct Firestore creation if offline or function is pending
    }

    // 2. Direct Firestore fallback
    final docRef = _db.collection('societies').doc(societyId).collection('users').doc();
    final timestamp = DateTime.now().toIso8601String();

    final payload = {
      ...residentData,
      'id': docRef.id,
      'uid': docRef.id,
      'societyId': societyId,
      'society_id': societyId,
      'flatNumber': flat,
      'flatNo': flat,
      'wing': wing,
      'role': residentData['role'] ?? 'resident',
      'status': 'active',
      'createdAt': timestamp,
      'updatedAt': timestamp,
    };

    await docRef.set(payload);

    try {
      await _db.collection('users').doc(docRef.id).set(payload, SetOptions(merge: true));
    } catch (_) {}

    return docRef.id;
  }

  Future<void> updateResidentStatus(
    String societyId,
    String residentId,
    String status,
  ) async {
    final updateData = {
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    };

    // Update in society subcollection
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('users')
        .doc(residentId)
        .set(updateData, SetOptions(merge: true));

    // Also update in root users collection if document exists
    try {
      final rootDoc = await _db.collection('users').doc(residentId).get();
      if (rootDoc.exists) {
        await _db.collection('users').doc(residentId).update(updateData);
      }
    } catch (_) {}
  }

  Future<void> deleteResident(String societyId, String residentId) async {
    try {
      await _db
          .collection('societies')
          .doc(societyId)
          .collection('users')
          .doc(residentId)
          .delete();
    } catch (_) {}

    try {
      await _db.collection('users').doc(residentId).delete();
    } catch (_) {}
  }

  // ── 3. VISITORS & GATE SECURITY ──────────────────────────────────────────
  Stream<List<VisitorModel>> streamVisitors(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('visitors')
        .limit(50)
        .snapshots()
        .map((snapshot) {
      final list = snapshot.docs
          .map((doc) => VisitorModel.fromFirestore(doc.data(), doc.id))
          .toList();
      list.sort((a, b) {
        final timeA = a.inTime ?? DateTime.fromMillisecondsSinceEpoch(0);
        final timeB = b.inTime ?? DateTime.fromMillisecondsSinceEpoch(0);
        return timeB.compareTo(timeA);
      });
      return list;
    });
  }

  // ── 4. COMPLAINTS & HELPDESK ─────────────────────────────────────────────
  Stream<List<ComplaintModel>> streamComplaints(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('complaints')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => ComplaintModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> updateComplaintStatus(
    String societyId,
    String complaintId,
    String status, {
    String? assignedStaffName,
  }) async {
    final updateData = <String, dynamic>{
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    };
    if (status == 'resolved') {
      updateData['resolvedAt'] = FieldValue.serverTimestamp();
    }
    if (assignedStaffName != null) {
      updateData['assigned_staff'] = assignedStaffName;
      updateData['assignedStaffName'] = assignedStaffName;
    }

    await _db
        .collection('societies')
        .doc(societyId)
        .collection('complaints')
        .doc(complaintId)
        .update(updateData);
  }

  // ── 5. MAINTENANCE & INVOICES ────────────────────────────────────────────
  Stream<List<MaintenanceBillModel>> streamMaintenanceBills(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('maintenance_bills')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => MaintenanceBillModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<String> createMaintenanceBill(
    String societyId,
    Map<String, dynamic> billData,
  ) async {
    final docRef = _db
        .collection('societies')
        .doc(societyId)
        .collection('maintenance_bills')
        .doc();

    final payload = {
      ...billData,
      'id': docRef.id,
      'societyId': societyId,
      'status': 'pending',
      'createdAt': DateTime.now().toIso8601String(),
      'updatedAt': DateTime.now().toIso8601String(),
    };

    await docRef.set(payload);
    return docRef.id;
  }

  Future<void> deleteMaintenanceBill(String societyId, String billId) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('maintenance_bills')
        .doc(billId)
        .delete();
  }

  Future<void> markBillPaid(
    String societyId,
    String billId,
    String paymentMode,
  ) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('maintenance_bills')
        .doc(billId)
        .update({
      'status': 'paid',
      'paymentMode': paymentMode,
      'paidDate': FieldValue.serverTimestamp(),
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── 6. NOTICES & BROADCASTS ──────────────────────────────────────────────
  Stream<List<NoticeModel>> streamNotices(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('notices')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => NoticeModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> createNotice(String societyId, NoticeModel notice) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('notices')
        .add(notice.toMap());
  }

  Future<void> deleteNotice(String societyId, String noticeId) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('notices')
        .doc(noticeId)
        .delete();
  }

  // ── 7. EMERGENCY SOS ─────────────────────────────────────────────────────
  Stream<List<SosAlertModel>> streamActiveSosAlerts(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('sos_alerts')
        .where('status', isEqualTo: 'active')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => SosAlertModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> resolveSosAlert(
    String societyId,
    String alertId,
    String adminName,
  ) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('sos_alerts')
        .doc(alertId)
        .update({
      'status': 'resolved',
      'resolvedAt': FieldValue.serverTimestamp(),
      'resolvedBy': adminName,
    });
  }

  // ── 8. AMENITIES & BOOKINGS ──────────────────────────────────────────────
  Stream<List<AmenityModel>> streamAmenities(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('amenities')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => AmenityModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> createAmenity(String societyId, AmenityModel amenity) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('amenities')
        .add(amenity.toMap());
  }

  Stream<List<AmenityBookingModel>> streamAmenityBookings(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('amenity_bookings')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => AmenityBookingModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> updateAmenityBookingStatus(
    String societyId,
    String bookingId,
    String status,
  ) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('amenity_bookings')
        .doc(bookingId)
        .update({
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── 9. STAFF & GUARDS ────────────────────────────────────────────────────
  Stream<List<StaffModel>> streamStaff(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('guards')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => StaffModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> addStaff(String societyId, StaffModel staff) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('guards')
        .add(staff.toMap());
  }

  Future<void> updateStaffStatus(
    String societyId,
    String staffId,
    String status,
  ) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('guards')
        .doc(staffId)
        .update({
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── 10. DAILY HELPERS & DELIVERIES ───────────────────────────────────────
  Stream<List<HelperModel>> streamHelpers(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('helpers')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => HelperModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> addHelper(String societyId, HelperModel helper) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('helpers')
        .add(helper.toMap());
  }

  // ── 11. COMMUNITY POLLS ──────────────────────────────────────────────────
  Stream<List<PollModel>> streamPolls(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('polls')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => PollModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> createPoll(String societyId, PollModel poll) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('polls')
        .add(poll.toMap());
  }

  Future<void> closePoll(String societyId, String pollId) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('polls')
        .doc(pollId)
        .update({
      'isClosed': true,
      'status': 'closed',
      'closedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── 12. PARKING MANAGEMENT ───────────────────────────────────────────────
  Stream<List<ParkingSlotModel>> streamParkingSlots(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('parking')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => ParkingSlotModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> assignParkingSlot(
    String societyId,
    String slotId,
    String flatNo,
    String residentName,
    String vehicleNo,
  ) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('parking')
        .doc(slotId)
        .update({
      'assignedFlat': flatNo,
      'residentName': residentName,
      'vehicleNumber': vehicleNo,
      'isOccupied': flatNo.isNotEmpty,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── 13. DOCUMENTS & BYLAWS ───────────────────────────────────────────────
  Stream<List<DocumentRecordModel>> streamDocuments(String societyId) {
    return _db
        .collection('societies')
        .doc(societyId)
        .collection('documents')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => DocumentRecordModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> uploadDocumentRecord(
    String societyId,
    DocumentRecordModel document,
  ) async {
    await _db
        .collection('societies')
        .doc(societyId)
        .collection('documents')
        .add(document.toMap());
  }
}
