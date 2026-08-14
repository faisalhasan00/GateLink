import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/profile/domain/models/session_model.dart';

void main() {
  group('SessionModel Unit Tests', () {
    test('fromMap creates valid SessionModel instance', () {
      final map = {
        'deviceName': 'Pixel 8 Pro',
        'osVersion': 'Android 14',
        'lastLogin': 'Today 09:30 AM',
        'isCurrentSession': true,
      };

      final session = SessionModel.fromMap(map, 'sess-001');

      expect(session.id, 'sess-001');
      expect(session.deviceName, 'Pixel 8 Pro');
      expect(session.osVersion, 'Android 14');
      expect(session.isCurrentSession, true);
    });

    test('toMap converts SessionModel to map correctly', () {
      const session = SessionModel(
        id: 'sess-002',
        deviceName: 'iPhone 15 Pro',
        osVersion: 'iOS 17.4',
        lastLogin: 'Yesterday',
        isCurrentSession: false,
      );

      final map = session.toMap();

      expect(map['deviceName'], 'iPhone 15 Pro');
      expect(map['osVersion'], 'iOS 17.4');
      expect(map['isCurrentSession'], false);
    });
  });
}
