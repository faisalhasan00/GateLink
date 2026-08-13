import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/notice_model.dart';
import '../../domain/repositories/notice_repository.dart';

class NoticeRepositoryImpl implements NoticeRepository {
  final FirebaseFirestore _firestore;

  NoticeRepositoryImpl(this._firestore);

  @override
  Stream<List<NoticeModel>> watchNotices(String societyId) {
    return _firestore
        .collection('societies/$societyId/notices')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => NoticeModel.fromFirestore(doc)).toList();
    });
  }
}
