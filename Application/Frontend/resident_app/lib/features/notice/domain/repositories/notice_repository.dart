import '../models/notice_model.dart';

abstract class NoticeRepository {
  Stream<List<NoticeModel>> watchNotices(String societyId);
}
