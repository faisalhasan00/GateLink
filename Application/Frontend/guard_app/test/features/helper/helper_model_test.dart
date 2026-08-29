import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/helper/domain/models/helper_log_model.dart';
import 'package:societysphere/features/helper/domain/models/helper_model.dart';

void main() {
  group('HelperModel & HelperLogModel Unit Tests', () {
    test('HelperModel parses correctly from map', () {
      final map = {
        'name': 'Sunita Devi',
        'phone': '9876543210',
        'type': 'Maid',
        'govtIdType': 'Aadhaar Card',
        'govtIdNumber': '1234-5678-9012',
        'workingDays': 'Mon - Sat',
        'status': 'Active',
        'createdAt': '2026-08-14T02:00:00.000Z',
      };

      final helper = HelperModel.fromMap(map, 'help_123');

      expect(helper.id, equals('help_123'));
      expect(helper.name, equals('Sunita Devi'));
      expect(helper.type, equals('Maid'));
      expect(helper.status, equals('Active'));
    });

    test('HelperLogModel parses correctly from map', () {
      final map = {
        'helperId': 'help_123',
        'helperName': 'Sunita Devi',
        'type': 'ENTRY',
        'gateName': 'Gate 1',
        'timestamp': '2026-08-14T08:30:00.000Z',
      };

      final log = HelperLogModel.fromMap(map, defaultId: 'log_456');

      expect(log.id, equals('log_456'));
      expect(log.type, equals('ENTRY'));
      expect(log.gateName, equals('Gate 1'));
    });
  });
}
