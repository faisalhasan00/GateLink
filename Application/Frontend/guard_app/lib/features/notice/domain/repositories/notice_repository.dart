abstract class NoticeRepository {
  Future<Map<String, dynamic>?> getNoticeDetail(String societyId, String noticeId);
}
