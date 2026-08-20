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

/// Domain Micro-Service: Handles Visitor Management, Gate Security Logs, QR passes, and Invitations.
class VisitorService {
  final FirebaseFirestore _db;
  final String societyId;

  VisitorService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  // ── STREAMS ───────────────────────────────────────────────────────────────

  Stream<QuerySnapshot> visitorsStream() {
    return _db.collection('societies/$societyId/visitors').snapshots();
  }

  Stream<QuerySnapshot> pendingVisitorsStream() {
    return _db
        .collection('societies/$societyId/visitors')
        .where('status', isEqualTo: 'pending')
        .snapshots();
  }

  Stream<QuerySnapshot> pendingVisitorsForFlatStream(String flatNumber) {
    return _db
        .collection('societies/$societyId/visitors')
        .where('status', isEqualTo: 'pending')
        .snapshots();
  }

  Stream<QuerySnapshot> residentsStream() {
    return _db
        .collection('societies/$societyId/users')
        .where('role', isEqualTo: 'resident')
        .snapshots();
  }

  // ── FLAT VALIDATION ───────────────────────────────────────────────────────

  /// Validates that a target flat exists in the society and has an assigned resident with smart flex-matching.
  Future<FlatValidationResult> validateFlat(String hostFlat) async {
    final rawInput = hostFlat.trim();
    if (rawInput.isEmpty) {
      return FlatValidationResult(
          isValid: false, error: 'Flat Number is required');
    }

    try {
      final List<Map<String, dynamic>> userDocs = [];

      // 1. Check subcollection societies/$societyId/users
      try {
        final subSnap = await _db.collection('societies/$societyId/users').get();
        for (final doc in subSnap.docs) {
          final data = Map<String, dynamic>.from(doc.data());
          data['_id'] = doc.id;
          userDocs.add(data);
        }
      } catch (_) {}

      // 2. Check root /users collection with societyId match
      try {
        final rootSnap = await _db
            .collection('users')
            .where('societyId', isEqualTo: societyId)
            .get();
        for (final doc in rootSnap.docs) {
          if (!userDocs.any((u) => u['_id'] == doc.id)) {
            final data = Map<String, dynamic>.from(doc.data());
            data['_id'] = doc.id;
            userDocs.add(data);
          }
        }
      } catch (_) {}

      if (userDocs.isEmpty) {
        return FlatValidationResult(
          isValid: false,
          error: 'No registered residents found in society',
        );
      }

      String normalize(String s) {
        return s
            .toLowerCase()
            .replaceAll('block', '')
            .replaceAll('tower', '')
            .replaceAll('flat', '')
            .replaceAll('unit', '')
            .replaceAll('apt', '')
            .replaceAll('apartment', '')
            .replaceAll(RegExp(r'[^a-z0-9]'), '');
      }

      final cleanInput = normalize(rawInput);
      Map<String, dynamic>? matchedUser;

      for (final data in userDocs) {
        final flatNum = (data['flatNumber'] as String? ?? '').trim();
        final unitNum = (data['unitNumber'] as String? ?? '').trim();
        final block = (data['block'] as String? ?? data['tower'] as String? ?? '').trim();

        final rawCandidates = [
          flatNum,
          unitNum,
          if (block.isNotEmpty && flatNum.isNotEmpty) '$block-$flatNum',
          if (block.isNotEmpty && flatNum.isNotEmpty) '$block $flatNum',
          if (block.isNotEmpty && flatNum.isNotEmpty) '$block$flatNum',
          if (block.isNotEmpty && unitNum.isNotEmpty) '$block-$unitNum',
        ];

        // 1. Exact or case-insensitive string match
        if (rawCandidates.any((c) => c.trim().toLowerCase() == rawInput.toLowerCase())) {
          matchedUser = data;
          break;
        }

        // 2. Normalized alphanumeric match
        final cleanCandidates = rawCandidates.map(normalize).where((c) => c.isNotEmpty).toList();
        if (cleanCandidates.any((c) => c == cleanInput)) {
          matchedUser = data;
          break;
        }

        // 3. Suffix or substring match (e.g. "101" matching "A-101" or "A101")
        if (cleanInput.length >= 2) {
          final isMatch = cleanCandidates.any((c) =>
              c.endsWith(cleanInput) ||
              cleanInput.endsWith(c) ||
              (c.length >= 3 && cleanInput.contains(c)) ||
              (cleanInput.length >= 3 && c.contains(cleanInput)));
          if (isMatch) {
            matchedUser = data;
            break;
          }
        }
      }

      if (matchedUser != null) {
        final residentName = (matchedUser['name'] as String?)?.isNotEmpty == true
            ? matchedUser['name'] as String
            : ((matchedUser['fullName'] as String?)?.isNotEmpty == true
                ? matchedUser['fullName'] as String
                : ((matchedUser['displayName'] as String?)?.isNotEmpty == true
                    ? matchedUser['displayName'] as String
                    : 'Resident'));
        final residentUid = matchedUser['_id'] as String? ?? '';
        return FlatValidationResult(
          isValid: true,
          residentName: residentName,
          residentUid: residentUid,
        );
      }

      return FlatValidationResult(
        isValid: false,
        error: 'Flat "$rawInput" not assigned to any resident',
      );
    } catch (e) {
      return FlatValidationResult(
          isValid: false, error: 'Flat validation error: $e');
    }
  }

  // ── VISITOR OPERATIONS ─────────────────────────────────────────────────────

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
        throw Exception(
            'A pending visitor request already exists for this mobile number ($cleanPhone).');
      }
    }

    // 3. Write Visitor Record
    final nowStr = DateTime.now().toIso8601String();
    final docRef = await _db.collection('societies/$societyId/visitors').add({
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
            .collection(
                'societies/$societyId/users/${validation.residentUid}/notifications')
            .add({
          'title': '🔔 New Visitor Request',
          'body':
              '$name ($type) is waiting at ${gateName ?? "Gate 1"} for Flat $hostFlat.',
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
    final docRef =
        _db.collection('societies/$societyId/visitors').doc(visitorId);
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
            durationString =
                '$hours Hr${hours > 1 ? "s" : ""} $mins Min${mins != 1 ? "s" : ""}';
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
        final doc =
            await _db.doc('societies/$societyId/visitors/$cleanCode').get();
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
          return {
            'valid': false,
            'reason': 'expired',
            'docId': targetDoc.id,
            'data': data,
            'error': 'QR Code Expired'
          };
        }
      } catch (_) {}
    }

    // 3. Duplicate Prevention Check
    if (status == 'inside') {
      return {
        'valid': false,
        'reason': 'already_used',
        'docId': targetDoc.id,
        'data': data,
        'error': 'Pass Already Used'
      };
    }

    if (status == 'denied' || status == 'rejected') {
      return {
        'valid': false,
        'reason': 'denied',
        'docId': targetDoc.id,
        'data': data,
        'error': 'Visitor Denied Entry'
      };
    }

    if (status == 'checked_out' || status == 'left') {
      return {
        'valid': false,
        'reason': 'checked_out',
        'docId': targetDoc.id,
        'data': data,
        'error': 'Visitor Already Checked Out'
      };
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
    final expiresAt =
        DateTime.now().add(const Duration(hours: 24)).toIso8601String();

    final docRef = await _db.collection('societies/$societyId/visitors').add({
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
}
