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

/// Domain Micro-Service: Dedicated Smart Flat-Resident Flex-Matching & Validation.
class FlatValidationService {
  final FirebaseFirestore _db;
  final String societyId;

  FlatValidationService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

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
}
