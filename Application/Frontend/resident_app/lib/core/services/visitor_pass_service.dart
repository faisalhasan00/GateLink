import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Dedicated Pass Code Generation & QR Security Verification Engine.
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
