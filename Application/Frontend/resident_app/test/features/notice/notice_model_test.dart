import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/notice/domain/models/notice_model.dart';

void main() {
  group('NoticeModel Unit Tests', () {
    test('NoticeModel parses fromMap correctly', () {
      final map = {
        'id': 'notif-202',
        'title': 'Annual General Body Meeting',
        'description': 'AGM scheduled for Sunday at 10 AM',
        'category': 'General',
        'date': '15 Aug 2026',
        'isNew': true,
        'createdAt': '2026-08-14T00:00:00.000',
        'author': 'Secretary',
        'authorRole': 'Management Committee',
      };

      final notice = NoticeModel.fromMap(map);

      expect(notice.id, 'notif-202');
      expect(notice.title, 'Annual General Body Meeting');
      expect(notice.description, 'AGM scheduled for Sunday at 10 AM');
      expect(notice.category, 'General');
      expect(notice.date, '15 Aug 2026');
      expect(notice.isNew, true);
      expect(notice.author, 'Secretary');
      expect(notice.authorRole, 'Management Committee');
    });

    test('NoticeModel handles default fallbacks', () {
      final notice = NoticeModel.fromMap({});

      expect(notice.id, '');
      expect(notice.title, 'Notice');
      expect(notice.category, 'General');
      expect(notice.isNew, false);
      expect(notice.author, 'Society Management');
      expect(notice.authorRole, 'Admin');
    });

    test('NoticeModel converts toMap correctly', () {
      const notice = NoticeModel(
        id: 'notif-203',
        title: 'Water Supply Disruption',
        description: 'Tank cleaning from 2 PM to 5 PM',
        category: 'Maintenance',
        date: '16 Aug 2026',
        isNew: false,
        createdAt: '2026-08-14T00:00:00.000',
        author: 'Admin',
        authorRole: 'Manager',
      );

      final map = notice.toMap();

      expect(map['id'], 'notif-203');
      expect(map['title'], 'Water Supply Disruption');
      expect(map['category'], 'Maintenance');
    });
  });
}
