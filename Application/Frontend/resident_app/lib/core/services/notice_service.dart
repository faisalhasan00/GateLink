import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Handles Society Notices, Broadcasts, and Announcements.
class NoticeService {
  final FirebaseFirestore _db;
  final String societyId;

  NoticeService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  Stream<QuerySnapshot> noticesStream() {
    if (societyId.isEmpty) return const Stream.empty();
    return _db
        .collection('societies/$societyId/notices')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }
}
