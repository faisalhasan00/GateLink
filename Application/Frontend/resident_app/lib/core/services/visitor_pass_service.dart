import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';

/// Micro-Service: Dedicated Pass Code Generation & QR Security Verification Engine.
class VisitorPassService {
  final FirebaseFirestore _db;
  final String societyId;

  VisitorPassService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  /// Generates a cryptographically secure 6-digit numeric pass code with expiration.
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
    final passType = data['passType'] as String? ?? 'one_time';
    final entryCount = (data['entryCount'] as num?)?.toInt() ?? 0;
    final maxEntries = (data['maxEntries'] as num?)?.toInt() ?? (passType == 'multi_day' ? -1 : 1);
    final expiresAtStr =
        (data['passCodeExpiresAt'] ?? data['expiresAt']) as String?;

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
            'error': 'Pass Expired',
          };
        }
      } catch (_) {}
    }

    // 3. Multi-day date window check
    if (passType == 'multi_day') {
      final validFromStr = data['validFrom'] as String?;
      final validUntilStr = data['validUntil'] as String?;
      final now = DateTime.now();
      if (validFromStr != null && validFromStr.isNotEmpty) {
        try {
          final from = DateTime.parse(validFromStr);
          if (now.isBefore(DateTime(from.year, from.month, from.day))) {
            return {
              'valid': false,
              'reason': 'not_yet_valid',
              'docId': targetDoc.id,
              'data': data,
              'error': 'Pass not valid until $validFromStr',
            };
          }
        } catch (_) {}
      }
      if (validUntilStr != null && validUntilStr.isNotEmpty) {
        try {
          final until = DateTime.parse(validUntilStr);
          if (now.isAfter(DateTime(until.year, until.month, until.day, 23, 59, 59))) {
            return {
              'valid': false,
              'reason': 'expired',
              'docId': targetDoc.id,
              'data': data,
              'error': 'Multi-day pass expired on $validUntilStr',
            };
          }
        } catch (_) {}
      }
    }

    // 4. One-Time Pass duplicate usage prevention
    if (passType == 'one_time') {
      if (status == 'inside' || entryCount >= 1) {
        return {
          'valid': false,
          'reason': 'already_used',
          'docId': targetDoc.id,
          'data': data,
          'error': 'One-Time Pass Already Used',
        };
      }
    }

    if (status == 'denied' || status == 'rejected') {
      return {
        'valid': false,
        'reason': 'denied',
        'docId': targetDoc.id,
        'data': data,
        'error': 'Visitor Denied Entry',
      };
    }

    if (passType == 'one_time' && (status == 'checked_out' || status == 'left')) {
      return {
        'valid': false,
        'reason': 'checked_out',
        'docId': targetDoc.id,
        'data': data,
        'error': 'One-Time Pass Already Checked Out',
      };
    }

    return {
      'valid': true,
      'reason': 'verified',
      'docId': targetDoc.id,
      'data': data,
    };
  }

  /// Creates a pre-approved visitor invite pass (One-Time or Multi-Day).
  Future<Map<String, String>> createInvitePass({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
    String passType = 'one_time',
    String? validFrom,
    String? validUntil,
  }) async {
    final passCode = generatePassCode();
    
    // Compute expiration
    DateTime expirationTime;
    if (passType == 'multi_day' && validUntil != null && validUntil.isNotEmpty) {
      try {
        final parsedUntil = DateTime.parse(validUntil);
        expirationTime = DateTime(parsedUntil.year, parsedUntil.month, parsedUntil.day, 23, 59, 59);
      } catch (_) {
        expirationTime = DateTime.now().add(const Duration(days: 7));
      }
    } else {
      expirationTime = DateTime.now().add(const Duration(hours: 24));
    }
    final expiresAt = expirationTime.toIso8601String();

    final docRef = await _db.collection('societies/$societyId/visitors').add({
      'name': name.trim(),
      'phone': phone.trim(),
      'type': purpose,
      'hostFlat': hostFlat,
      'invitedBy': invitedBy,
      'expectedDate': expectedDate,
      'expectedTime': expectedTime,
      'passType': passType,
      'validFrom': validFrom ?? expectedDate,
      'validUntil': validUntil ?? expectedDate,
      'entryCount': 0,
      'maxEntries': passType == 'multi_day' ? -1 : 1,
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
      'passType': passType,
      'validFrom': validFrom ?? expectedDate,
      'validUntil': validUntil ?? expectedDate,
    };
  }
}
