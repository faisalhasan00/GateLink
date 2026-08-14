import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/repositories/notice_repository.dart';

class NoticeRepositoryImpl implements NoticeRepository {
  final FirebaseFirestore _firestore;

  NoticeRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Future<Map<String, dynamic>?> getNoticeDetail(String societyId, String noticeId) async {
    if (societyId.isNotEmpty) {
      final doc = await _firestore.doc('societies/$societyId/notices/$noticeId').get();
      return doc.data();
    } else {
      final snap = await _firestore.collectionGroup('notices').where(FieldPath.documentId, isEqualTo: noticeId).get();
      return snap.docs.firstOrNull?.data();
    }
  }
}
