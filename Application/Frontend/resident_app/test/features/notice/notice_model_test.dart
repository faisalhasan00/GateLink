import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/notice/domain/models/notice_model.dart';

void main() {
  group('NoticeModel Unit Tests', () {
    test('NoticeModel instantiates correctly', () {
      const notice = NoticeModel(
        id: 'notif-202',
        title: 'Annual General Body Meeting',
        description: 'AGM will be held on Sunday at 10 AM',
        category: 'General',
        date: '2026-08-18',
        createdAt: '2026-08-14T00:00:00Z',
      );

      expect(notice.id, 'notif-202');
      expect(notice.title, 'Annual General Body Meeting');
      expect(notice.category, 'General');
    });
  });
}
