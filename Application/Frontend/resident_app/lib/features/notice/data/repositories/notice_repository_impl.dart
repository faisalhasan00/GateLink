import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/notice_model.dart';
import '../../domain/repositories/notice_repository.dart';

class NoticeRepositoryImpl implements NoticeRepository {
  final FirebaseFirestore _firestore;

  NoticeRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<NoticeModel>> watchNotices(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/notices')
        .orderBy('createdAt', descending: true)
        .limit(50)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => NoticeModel.fromMap(doc.data(), defaultId: doc.id))
          .toList();
    });
  }

  @override
  Stream<NoticeModel?> watchNoticeDetail(String societyId, String noticeId) {
    if (societyId.isEmpty || noticeId.isEmpty) return Stream.value(null);

    return _firestore
        .collection('societies/$societyId/notices')
        .doc(noticeId)
        .snapshots()
        .map((doc) {
      if (!doc.exists || doc.data() == null) return null;
      return NoticeModel.fromMap(doc.data()!, defaultId: doc.id);
    });
  }
}
