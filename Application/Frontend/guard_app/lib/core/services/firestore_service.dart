import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';

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

  /// Validates that a target flat exists in the society and has an assigned resident with smart flex-matching.
  Future<FlatValidationResult> validateFlat(String hostFlat) async {
    final rawInput = hostFlat.trim();
    if (rawInput.isEmpty) {
      return FlatValidationResult(isValid: false, error: 'Flat Number is required');
    }

    try {
      final usersSnap = await _db.collection('societies/$societyId/users').get();
      if (usersSnap.docs.isEmpty) {
        return FlatValidationResult(isValid: false, error: 'No registered residents found in society');
      }

      final cleanInput = rawInput.toLowerCase().replaceAll(' ', '').replaceAll('tower', '').replaceAll('block', '');

      DocumentSnapshot? matchedDoc;
      for (final doc in usersSnap.docs) {
        final data = doc.data();
        final flatNum = (data['flatNumber'] as String? ?? '').trim();
        final unitNum = (data['unitNumber'] as String? ?? '').trim();

        final cleanFlat = flatNum.toLowerCase().replaceAll(' ', '').replaceAll('tower', '').replaceAll('block', '');
        final cleanUnit = unitNum.toLowerCase().replaceAll(' ', '').replaceAll('tower', '').replaceAll('block', '');

        if (flatNum.toLowerCase() == rawInput.toLowerCase() ||
            unitNum.toLowerCase() == rawInput.toLowerCase() ||
            cleanFlat == cleanInput ||
            cleanUnit == cleanInput ||
            (cleanInput.length >= 2 && cleanFlat.endsWith(cleanInput)) ||
            (cleanFlat.length >= 2 && cleanInput.endsWith(cleanFlat))) {
          matchedDoc = doc;
          break;
        }
      }

      if (matchedDoc != null) {
        final data = matchedDoc.data() as Map<String, dynamic>;
        final residentName = data['name'] as String? ?? 'Resident';
        return FlatValidationResult(
          isValid: true,
          residentName: residentName,
          residentUid: matchedDoc.id,
        );
      }

      return FlatValidationResult(
        isValid: false,
        error: 'Flat "$rawInput" not assigned to any resident',
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
    String? vehicleType,
    String? company,
    String? gender,
    String? photoUrl,
    String? notes,
    String? guardUid,
    String? gateName,
  }) async {
    // 1. Strict Flat Validation
    final validation = await validateFlat(hostFlat);
    if (!validation.isValid) {
      throw Exception(validation.error);
    }

    final cleanPhone = (phone ?? '').trim();

    // 2. Duplicate Request Prevention
    if (cleanPhone.isNotEmpty) {
      final dupSnapshot = await _db
          .collection('societies/$societyId/visitors')
          .where('hostFlat', isEqualTo: hostFlat)
          .where('phone', isEqualTo: cleanPhone)
          .where('status', isEqualTo: 'pending')
          .get();

      if (dupSnapshot.docs.isNotEmpty) {
        throw Exception('A pending visitor request already exists for this mobile number ($cleanPhone).');
      }
    }

    // 3. Write Visitor Record
    final nowStr = DateTime.now().toIso8601String();
    final docRef = await _db
        .collection('societies/$societyId/visitors')
        .add({
      'name': name,
      'type': type,
      'hostFlat': hostFlat,
      'phone': cleanPhone,
      'vehicleNumber': vehicleNumber ?? '',
      'vehicleType': vehicleType ?? '4-Wheeler',
      'company': company ?? '',
      'gender': gender ?? 'Not Specified',
      'photoUrl': photoUrl,
      'notes': notes ?? '',
      'entryTime': null,
      'exitTime': null,
      'status': 'pending',
      'societyId': societyId,
      'createdDate': nowStr,
      'createdAt': nowStr,
      'guardUid': guardUid ?? 'guard_gate_1',
      'gateName': gateName ?? 'Gate 1 — Main Entry',
      'hostResidentName': validation.residentName,
      'hostResidentUid': validation.residentUid,
    });

    // 4. Send Instant In-App Notification to Resident
    if (validation.residentUid != null && validation.residentUid!.isNotEmpty) {
      try {
        await _db
            .collection('societies/$societyId/users/${validation.residentUid}/notifications')
            .add({
          'title': '🔔 New Visitor Request',
          'body': '$name ($type) is waiting at ${gateName ?? "Gate 1"} for Flat $hostFlat.',
          'type': 'visitor_pending',
          'visitorId': docRef.id,
          'read': false,
          'createdAt': nowStr,
        });
      } catch (_) {}
    }

    return docRef.id;
  }

  Future<void> markVisitorExit(String visitorId) async {
    final docRef = _db.collection('societies/$societyId/visitors').doc(visitorId);
    final doc = await docRef.get();
    final exitNow = DateTime.now();
    final exitStr = exitNow.toIso8601String();

    int durationMinutes = 0;
    String durationString = 'Just left';

    if (doc.exists) {
      final data = doc.data();
      final entryStr = data?['entryTime'] as String?;
      if (entryStr != null && entryStr.isNotEmpty) {
        try {
          final entryTime = DateTime.parse(entryStr);
          final diff = exitNow.difference(entryTime);
          durationMinutes = diff.inMinutes;
          final hours = durationMinutes ~/ 60;
          final mins = durationMinutes % 60;
          if (hours > 0) {
            durationString = '$hours Hr${hours > 1 ? "s" : ""} $mins Min${mins != 1 ? "s" : ""}';
          } else {
            durationString = '$mins Min${mins != 1 ? "s" : ""}';
          }
        } catch (_) {}
      }
    }

    await docRef.update({
      'exitTime': exitStr,
      'status': 'checked_out',
      'durationMinutes': durationMinutes,
      'durationString': durationString,
      'updatedAt': exitStr,
    });
  }

  /// Processes QR code or 6-digit numeric Pass Code scan with duplicate prevention, expiration check, and validation
  Future<Map<String, dynamic>> validateAndProcessQrScan(String code) async {
    final cleanCode = code.trim();
    
    // 1. Look up visitor by qrCode, passCode, or docId
    QuerySnapshot query = await _db
        .collection('societies/$societyId/visitors')
        .where('qrCode', isEqualTo: cleanCode)
        .limit(1)
        .get();

    DocumentSnapshot? targetDoc;
    if (query.docs.isNotEmpty) {
      targetDoc = query.docs.first;
    } else {
      // Search by 6-digit numeric passCode
      final passQuery = await _db
          .collection('societies/$societyId/visitors')
          .where('passCode', isEqualTo: cleanCode)
          .limit(1)
          .get();

      if (passQuery.docs.isNotEmpty) {
        targetDoc = passQuery.docs.first;
      } else {
        // Fallback to document ID search
        final doc = await _db.doc('societies/$societyId/visitors/$cleanCode').get();
        if (doc.exists) targetDoc = doc;
      }
    }

    if (targetDoc == null || !targetDoc.exists) {
      return {'valid': false, 'reason': 'invalid', 'error': 'Invalid QR Code'};
    }

    final data = targetDoc.data() as Map<String, dynamic>;
    final status = data['status'] as String? ?? 'pending';
    final expiresAtStr = data['expiresAt'] as String?;

    // 2. Expiration Check
    if (expiresAtStr != null && expiresAtStr.isNotEmpty) {
      try {
        final exp = DateTime.parse(expiresAtStr);
        if (DateTime.now().isAfter(exp)) {
          return {'valid': false, 'reason': 'expired', 'docId': targetDoc.id, 'data': data, 'error': 'QR Code Expired'};
        }
      } catch (_) {}
    }

    // 3. Duplicate Prevention Check
    if (status == 'inside') {
      return {'valid': false, 'reason': 'already_used', 'docId': targetDoc.id, 'data': data, 'error': 'Pass Already Used'};
    }

    if (status == 'denied' || status == 'rejected') {
      return {'valid': false, 'reason': 'denied', 'docId': targetDoc.id, 'data': data, 'error': 'Visitor Denied Entry'};
    }

    if (status == 'checked_out' || status == 'left') {
      return {'valid': false, 'reason': 'checked_out', 'docId': targetDoc.id, 'data': data, 'error': 'Visitor Already Checked Out'};
    }

    return {
      'valid': true,
      'reason': 'verified',
      'docId': targetDoc.id,
      'data': data,
    };
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

  Stream<DocumentSnapshot> complaintDetailStream(String complaintId) {
    return _db
        .collection('societies/$societyId/complaints')
        .doc(complaintId)
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
    String? residentName,
    String? flatNumber,
  }) async {
    final ticketNum = 'CMP-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
    final nowStr = DateTime.now().toIso8601String();

    final docRef = await _db.collection('societies/$societyId/complaints').add({
      'ticketNumber': ticketNum,
      'title': title,
      'description': description,
      'category': category,
      'status': 'Open',
      'raisedBy': uid,
      'residentUid': uid,
      'residentName': residentName ?? 'Resident',
      'flatNumber': flatNumber ?? '',
      'block': block ?? '',
      'floor': floor ?? '',
      'priority': priority ?? 'medium',
      'photoUrl': photoUrl,
      'createdAt': nowStr,
      'updatedAt': nowStr,
    });

    // Write Live Notification to Society Admin & Super Admin
    try {
      final senderName = residentName != null && residentName.isNotEmpty ? residentName : 'Resident';
      final senderFlat = flatNumber != null && flatNumber.isNotEmpty ? ' (Flat $flatNumber)' : '';

      await _db.collection('societies/$societyId/notifications').add({
        'title': '🚨 New Complaint: $ticketNum',
        'message': '$senderName$senderFlat raised a $category complaint: "$title"',
        'category': category,
        'type': 'complaint',
        'ticketNumber': ticketNum,
        'complaintId': docRef.id,
        'read': false,
        'createdAt': nowStr,
      });

      await _db.collection('notifications').add({
        'title': '🚨 New Complaint: $ticketNum',
        'message': '$category complaint raised by $senderName$senderFlat ($title)',
        'societyId': societyId,
        'type': 'complaint',
        'read': false,
        'createdAt': nowStr,
      });
    } catch (notifErr) {
      print('Error pushing complaint notification to admin: $notifErr');
    }

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
    String? flatNumber,
    String? phone,
  }) async {
    // 1. Fetch Amenity Profile for Capacity & Approval Policy
    DocumentSnapshot? amenityDoc;
    try {
      amenityDoc = await _db.collection('societies/$societyId/amenities').doc(amenityId).get();
    } catch (_) {}

    final amenityData = amenityDoc?.data() as Map<String, dynamic>? ?? {};
    final approvalPolicy = amenityData['approvalPolicy'] as String? ?? 'auto';
    final maxCapacity = (amenityData['capacity'] as num?)?.toInt() ?? (amenityData['maxSlots'] as num?)?.toInt() ?? 10;

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
      throw Exception('Slot Sold Out! All $maxCapacity available slots for $timeSlot on $date are already booked.');
    }

    // 3. Determine Initial Status (Auto-Approve vs Manual Admin Approval)
    final initialStatus = (approvalPolicy == 'manual') ? 'pending' : 'approved';
    final remainingSlots = maxCapacity - activeCount - 1;
    final nowStr = DateTime.now().toIso8601String();

    // 4. Add Booking Document
    final docRef = await _db.collection('societies/$societyId/amenity_bookings').add({
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
      await _db.collection('societies/$societyId/amenities').doc(amenityId).update({
        'availableSlots': remainingForDoc,
        'updatedAt': nowStr,
      });
    } catch (_) {}

    // 6. Alert Society Admin if Manual Approval Required
    if (initialStatus == 'pending') {
      try {
        await _db.collection('societies/$societyId/notifications').add({
          'title': '📅 New Amenity Booking Request',
          'message': '$userName requested a booking for $amenityName on $date ($timeSlot).',
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
    final docSnap = await _db.collection('societies/$societyId/amenity_bookings').doc(bookingId).get();
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
        final amenityDoc = await _db.collection('societies/$societyId/amenities').doc(amenityId).get();
        final currentCap = (amenityDoc.data()?['capacity'] as num?)?.toInt() ?? 10;
        final currentSlots = (amenityDoc.data()?['availableSlots'] as num?)?.toInt() ?? currentCap;
        await _db.collection('societies/$societyId/amenities').doc(amenityId).update({
          'availableSlots': (currentSlots + 1) > currentCap ? currentCap : (currentSlots + 1),
        });
      } catch (_) {}
    }
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

  Future<void> seedDocumentsIfEmpty() async {
    final snap = await _db.collection('societies/$societyId/documents').limit(1).get();
    if (snap.docs.isEmpty) {
      final batch = _db.batch();
      final docs = [
        {
          'title': 'Society By-Laws 2026',
          'category': 'Rules',
          'size': '2.4 MB',
          'url': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          'uploadedAt': DateTime.now().toIso8601String(),
        },
        {
          'title': 'Financial Audit Report FY25-26',
          'category': 'Financial',
          'size': '4.1 MB',
          'url': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          'uploadedAt': DateTime.now().toIso8601String(),
        },
        {
          'title': 'AGM Minutes - July 2026',
          'category': 'Compliance',
          'size': '1.8 MB',
          'url': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          'uploadedAt': DateTime.now().toIso8601String(),
        },
        {
          'title': 'Fire Safety & Evacuation Plan',
          'category': 'Rules',
          'size': '3.2 MB',
          'url': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          'uploadedAt': DateTime.now().toIso8601String(),
        },
      ];

      for (final d in docs) {
        final ref = _db.collection('societies/$societyId/documents').doc();
        batch.set(ref, d);
      }
      await batch.commit();
    }
  }

  // ── VISITOR INVITES ──────────────────────────────────────────────────────

  Future<Map<String, String>> inviteVisitor({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
  }) async {
    // Generate cryptographically secure 6-digit numeric Pass Code with 24-hour expiration
    final passCode = (100000 + Random.secure().nextInt(900000)).toString();
    final expiresAt = DateTime.now().add(const Duration(hours: 24)).toIso8601String();

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
      'passCode': passCode,
      'qrCode': passCode,
      'passCodeExpiresAt': expiresAt,
      'entryTime': null,
      'exitTime': null,
      'status': 'expected',
      'createdAt': DateTime.now().toIso8601String(),
    });

    return {
      'visitorId': docRef.id,
      'passCode': passCode,
    };
  }


  // ── NOTIFICATIONS ────────────────────────────────────────────────────────
  
  Stream<QuerySnapshot> notificationsStream(String uid) {
    return _db
        .collection('societies/$societyId/users/$uid/notifications')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  Stream<int> unreadNotificationsCountStream(String uid) {
    return _db
        .collection('societies/$societyId/users/$uid/notifications')
        .where('read', isEqualTo: false)
        .snapshots()
        .map((snap) => snap.docs.length);
  }

  Future<void> markNotificationAsRead(String notifId, String uid) async {
    await _db
        .collection('societies/$societyId/users/$uid/notifications')
        .doc(notifId)
        .update({'read': true});
  }

  Future<void> markAllNotificationsAsRead(String uid) async {
    final unreadSnap = await _db
        .collection('societies/$societyId/users/$uid/notifications')
        .where('read', isEqualTo: false)
        .get();

    final batch = _db.batch();
    for (final doc in unreadSnap.docs) {
      batch.update(doc.reference, {'read': true});
    }
    await batch.commit();
  }

  Future<void> updateNotificationPreferences(String uid, Map<String, bool> prefs) async {
    await _db
        .collection('societies/$societyId/users')
        .doc(uid)
        .set({'notificationPreferences': prefs}, SetOptions(merge: true));
  }

  Future<void> deleteNotification(String notifId, String uid) async {
    await _db
        .collection('societies/$societyId/users/$uid/notifications')
        .doc(notifId)
        .delete();
  }

  Future<void> clearAllNotifications(String uid) async {
    final snap = await _db
        .collection('societies/$societyId/users/$uid/notifications')
        .get();

    final batch = _db.batch();
    for (final doc in snap.docs) {
      batch.delete(doc.reference);
    }
    await batch.commit();
  }
}
