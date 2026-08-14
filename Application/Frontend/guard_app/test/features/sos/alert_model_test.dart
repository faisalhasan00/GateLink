import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/sos/domain/models/guard_alert_model.dart';

void main() {
  group('GuardAlertModel Unit Tests', () {
    test('GuardAlertModel parses correctly from map', () {
      final map = {
        'residentName': 'Anil Kumar',
        'flatNumber': 'C-304',
        'type': 'Medical',
        'status': 'Triggered',
        'message': '🚨 EMERGENCY SOS TRIGGERED: Medical',
        'createdAt': '2026-08-14T02:00:00.000Z',
      };

      final alert = GuardAlertModel.fromMap(map, 'alert_789');

      expect(alert.id, equals('alert_789'));
      expect(alert.residentName, equals('Anil Kumar'));
      expect(alert.type, equals('Medical'));
      expect(alert.status, equals('Triggered'));
    });
  });
}
