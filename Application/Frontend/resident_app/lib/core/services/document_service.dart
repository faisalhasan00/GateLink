import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Handles Society Documents, By-Laws, and Compliance Files.
class DocumentService {
  final FirebaseFirestore _db;
  final String societyId;

  DocumentService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  Stream<QuerySnapshot> documentsStream() {
    if (societyId.isEmpty) return const Stream.empty();
    return _db.collection('societies/$societyId/documents').snapshots();
  }

  Future<void> seedDocumentsIfEmpty() async {
    final snap =
        await _db.collection('societies/$societyId/documents').limit(1).get();
    if (snap.docs.isEmpty) {
      final batch = _db.batch();
      final docs = [
        {
          'title': 'Society By-Laws 2026',
          'category': 'Rules',
          'size': '2.4 MB',
          'url':
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          'uploadedAt': DateTime.now().toIso8601String(),
        },
        {
          'title': 'Financial Audit Report FY25-26',
          'category': 'Financial',
          'size': '4.1 MB',
          'url':
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          'uploadedAt': DateTime.now().toIso8601String(),
        },
        {
          'title': 'AGM Minutes - July 2026',
          'category': 'Compliance',
          'size': '1.8 MB',
          'url':
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          'uploadedAt': DateTime.now().toIso8601String(),
        },
        {
          'title': 'Fire Safety & Evacuation Plan',
          'category': 'Rules',
          'size': '3.2 MB',
          'url':
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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
}
