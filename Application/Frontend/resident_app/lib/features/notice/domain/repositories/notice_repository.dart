import '../models/notice_model.dart';

abstract class NoticeRepository {
  Stream<List<NoticeModel>> watchNotices(String societyId);
  Stream<NoticeModel?> watchNoticeDetail(String societyId, String noticeId);
}
