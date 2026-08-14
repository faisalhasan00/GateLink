import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/sos/domain/models/alert_model.dart';

void main() {
  group('AlertModel Unit Tests', () {
    test('creates valid AlertModel object with constructor', () {
      const alert = AlertModel(
        id: 'alert-1',
        type: 'FIRE',
        guardEmail: 'guard@society.com',
        message: 'Fire in Block B',
        createdAt: '2026-08-14 10:00:00',
        status: 'active',
      );

      expect(alert.id, 'alert-1');
      expect(alert.type, 'FIRE');
      expect(alert.guardEmail, 'guard@society.com');
      expect(alert.message, 'Fire in Block B');
      expect(alert.createdAt, '2026-08-14 10:00:00');
      expect(alert.status, 'active');
    });
  });
}
