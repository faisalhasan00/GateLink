import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'fcm_push_service.dart';

/// Domain Micro-Service: Dedicated Pass Code Generation & QR Security Verification Engine for Guard App.
class VisitorPassService {
  final FirebaseFirestore _db;
  final String societyId;

  VisitorPassService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  /// Generates a cryptographically secure 6-digit numeric pass code with 24-hour expiration.
  String generatePassCode() {
    return (100000 + Random.secure().nextInt(900000)).toString();
  }

  /// Processes QR code or 6-digit numeric Pass Code scan with duplicate prevention, expiration check, and validation.
  Future<Map<String, dynamic>> validateAndProcessQrScan(String code) async {
    final cleanCode = code.trim();

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Permanent Domestic Staff / Helper QR Pass Check (GATELINK:HELPER:...)
    // ─────────────────────────────────────────────────────────────────────────
    if (cleanCode.startsWith('GATELINK:HELPER:') || cleanCode.startsWith('HLP_')) {
      String helperId = cleanCode;
      if (cleanCode.startsWith('GATELINK:HELPER:')) {
        final parts = cleanCode.split(':');
        if (parts.length >= 4) {
          helperId = parts[3];
        } else if (parts.length >= 3) {
          helperId = parts[2];
        }
      }

      DocumentSnapshot? helperDoc;
      final docCheck = await _db.doc('societies/$societyId/helpers/$helperId').get();
      if (docCheck.exists) {
        helperDoc = docCheck;
      } else {
        // Query by qrCodeData
        final q = await _db
            .collection('societies/$societyId/helpers')
            .where('qrCodeData', isEqualTo: cleanCode)
            .limit(1)
            .get();
        if (q.docs.isNotEmpty) {
          helperDoc = q.docs.first;
        }
      }

      if (helperDoc != null && helperDoc.exists) {
        final data = helperDoc.data() as Map<String, dynamic>;
        final status = (data['status'] as String? ?? 'Active').toLowerCase();
        final flatNo = data['flatNumber'] as String? ?? '';
        final name = data['name'] as String? ?? 'Domestic Staff';
        final type = data['type'] as String? ?? 'Maid';

        if (status == 'revoked' || status == 'inactive' || status == 'suspended') {
          return {
            'valid': false,
            'reason': 'helper_revoked',
            'type': 'helper',
            'docId': helperDoc.id,
            'data': data,
            'error': '⛔ ACCESS REVOKED: Pass for $name ($type) was cancelled by Flat $flatNo. Gate entry is blocked.',
          };
        }

        return {
          'valid': true,
          'reason': 'helper_verified',
          'type': 'helper',
          'docId': helperDoc.id,
          'data': data,
        };
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Regular Visitor QR Pass Search
    // ─────────────────────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Fallback: Search in helpers collection if not found in visitors
    // ─────────────────────────────────────────────────────────────────────────
    if (targetDoc == null || !targetDoc.exists) {
      final helperQuery = await _db
          .collection('societies/$societyId/helpers')
          .where('phone', isEqualTo: cleanCode)
          .limit(1)
          .get();

      if (helperQuery.docs.isNotEmpty) {
        final helperDoc = helperQuery.docs.first;
        final data = helperDoc.data();
        final status = (data['status'] as String? ?? 'Active').toLowerCase();
        if (status == 'revoked' || status == 'inactive') {
          return {
            'valid': false,
            'reason': 'helper_revoked',
            'type': 'helper',
            'docId': helperDoc.id,
            'data': data,
            'error': '⛔ ACCESS REVOKED: Pass was cancelled by Flat ${data['flatNumber']}.',
          };
        }
        return {
          'valid': true,
          'reason': 'helper_verified',
          'type': 'helper',
          'docId': helperDoc.id,
          'data': data,
        };
      }

      return {'valid': false, 'reason': 'invalid', 'error': 'Invalid QR Code or Passcode'};
    }

    final data = targetDoc.data() as Map<String, dynamic>;
    final status = data['status'] as String? ?? 'pending';
    final expiresAtStr = (data['passCodeExpiresAt'] ?? data['expiresAt']) as String?;

    // 4. Expiration Check
    if (expiresAtStr != null && expiresAtStr.isNotEmpty) {
      try {
        final exp = DateTime.parse(expiresAtStr);
        if (DateTime.now().isAfter(exp)) {
          return {'valid': false, 'reason': 'expired', 'docId': targetDoc.id, 'data': data, 'error': 'QR Code Expired'};
        }
      } catch (_) {}
    }

    // 5. Duplicate Prevention Check
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
      'type': 'visitor',
      'docId': targetDoc.id,
      'data': data,
    };
  }

  /// Processes domestic staff check-in or check-out, updates live state, and notifies resident.
  Future<bool> checkInOutHelper({
    required String helperId,
    required String helperName,
    required String helperType,
    required String flatNumber,
    required String residentUid,
    required bool checkIn,
    String gateName = 'Main Gate',
    String guardName = 'On-Duty Guard',
  }) async {
    final now = DateTime.now();
    final nowIso = now.toIso8601String();

    try {
      // 1. Update Helper Document Live State
      await _db.doc('societies/$societyId/helpers/$helperId').update({
        'isInside': checkIn,
        if (checkIn) 'lastCheckIn': nowIso,
        if (!checkIn) 'lastCheckOut': nowIso,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      // 2. Append Log Entry
      await _db.collection('societies/$societyId/helper_logs').add({
        'helperId': helperId,
        'helperName': helperName,
        'helperType': helperType,
        'flatNumber': flatNumber,
        'residentUid': residentUid,
        'societyId': societyId,
        'gateName': gateName,
        'guardName': guardName,
        'type': checkIn ? 'ENTRY' : 'EXIT',
        'timestamp': nowIso,
        'createdAt': FieldValue.serverTimestamp(),
      });

      // 3. Notify Resident in Realtime
      final notifTitle = checkIn
          ? '🟢 Staff Entered Gate — Flat $flatNumber'
          : '⚪ Staff Left Gate — Flat $flatNumber';
      final notifBody = checkIn
          ? '$helperName ($helperType) checked in at $gateName.'
          : '$helperName ($helperType) checked out at $gateName.';

      final notifData = {
        'title': notifTitle,
        'body': notifBody,
        'type': 'helper_gate_activity',
        'helperId': helperId,
        'helperName': helperName,
        'helperType': helperType,
        'flatNumber': flatNumber,
        'isEntry': checkIn,
        'read': false,
        'createdAt': nowIso,
      };

      if (residentUid.isNotEmpty) {
        try {
          await _db
              .collection('societies/$societyId/users/$residentUid/notifications')
              .add(notifData);
        } catch (_) {}

        try {
          await _db.collection('users/$residentUid/notifications').add(notifData);
        } catch (_) {}

        // Dispatch FCM Push Notification
        try {
          String? fcmToken;
          final uDoc = await _db.collection('users').doc(residentUid).get();
          if (uDoc.exists) fcmToken = uDoc.data()?['fcmToken'] as String?;
          if (fcmToken != null && fcmToken.isNotEmpty) {
            await FcmPushService.sendVisitorNotification(
              fcmToken: fcmToken,
              visitorName: helperName,
              visitorType: helperType,
              hostFlat: flatNumber,
              visitorId: helperId,
              societyId: societyId,
            );
          }
        } catch (e) {
          debugPrint('Helper FCM Notification error: $e');
        }
      }

      return true;
    } catch (e) {
      debugPrint('Error processing helper check-in/out: $e');
      return false;
    }
  }

  /// Creates a pre-approved visitor invite pass with a 6-digit PIN.
  Future<Map<String, String>> createInvitePass({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
  }) async {
    final passCode = generatePassCode();
    final expiresAt = DateTime.now().add(const Duration(hours: 24)).toIso8601String();

    final docRef = await _db.collection('societies/$societyId/visitors').add({
      'name': name.trim(),
      'phone': phone.trim(),
      'type': purpose,
      'hostFlat': hostFlat,
      'invitedBy': invitedBy,
      'expectedDate': expectedDate,
      'expectedTime': expectedTime,
      'status': 'invited',
      'passCode': passCode,
      'passCodeExpiresAt': expiresAt,
      'createdAt': DateTime.now().toIso8601String(),
    });

    return {
      'visitorId': docRef.id,
      'passCode': passCode,
      'expiresAt': expiresAt,
    };
  }
}
