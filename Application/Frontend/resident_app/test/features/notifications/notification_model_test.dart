import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/notifications/domain/models/notification_model.dart';

void main() {
  group('NotificationModel Unit Tests', () {
    test('NotificationModel parses fromMap correctly', () {
      final map = {
        'title': 'Visitor Entry Approved',
        'body': 'John Doe has arrived at Gate 1.',
        'type': 'visitor',
        'read': false,
        'createdAt': '2026-08-14T10:00:00Z',
        'societyId': 'SOC-001',
      };

      final model = NotificationModel.fromMap(map, 'notif-101');

      expect(model.id, 'notif-101');
      expect(model.title, 'Visitor Entry Approved');
      expect(model.body, 'John Doe has arrived at Gate 1.');
      expect(model.type, 'visitor');
      expect(model.read, false);
      expect(model.createdAt, '2026-08-14T10:00:00Z');
      expect(model.societyId, 'SOC-001');
    });

    test('NotificationModel handles default fallback values', () {
      final map = <String, dynamic>{};

      final model = NotificationModel.fromMap(map, 'notif-102');

      expect(model.id, 'notif-102');
      expect(model.title, 'Notification');
      expect(model.body, '');
      expect(model.type, 'info');
      expect(model.read, false);
      expect(model.createdAt, '');
    });

    test('NotificationModel converts toMap correctly', () {
      const model = NotificationModel(
        id: 'notif-101',
        title: 'Maintenance Bill Due',
        body: 'August bill is due.',
        type: 'bill',
        read: true,
        createdAt: '2026-08-14T10:00:00Z',
      );

      final map = model.toMap();

      expect(map['title'], 'Maintenance Bill Due');
      expect(map['body'], 'August bill is due.');
      expect(map['type'], 'bill');
      expect(map['read'], true);
    });
  });
}
