import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/helper/domain/models/helper_log_model.dart';
import 'package:societysphere/features/helper/domain/models/helper_model.dart';

void main() {
  group('HelperModel & HelperLogModel Unit Tests', () {
    test('HelperModel parses fromMap correctly', () {
      final map = {
        'id': 'hlp-101',
        'name': 'Sunita Sharma',
        'phone': '9876543210',
        'type': 'Maid',
        'govtIdType': 'Aadhaar Card',
        'govtIdNumber': '1234-5678-9012',
        'workingDays': 'Mon - Sat',
        'emergencyContact': '9123456789',
        'residentUid': 'user-101',
        'residentName': 'Jane Doe',
        'flatNumber': '101',
        'status': 'Active',
        'createdAt': '2026-08-14T00:00:00.000',
      };

      final model = HelperModel.fromMap(map);

      expect(model.id, 'hlp-101');
      expect(model.name, 'Sunita Sharma');
      expect(model.phone, '9876543210');
      expect(model.type, 'Maid');
      expect(model.govtIdType, 'Aadhaar Card');
      expect(model.govtIdNumber, '1234-5678-9012');
      expect(model.workingDays, 'Mon - Sat');
      expect(model.emergencyContact, '9123456789');
      expect(model.residentUid, 'user-101');
      expect(model.residentName, 'Jane Doe');
      expect(model.flatNumber, '101');
      expect(model.status, 'Active');
      expect(model.isActive, true);
    });

    test('HelperModel handles default fallback values', () {
      final model = HelperModel.fromMap({});

      expect(model.id, '');
      expect(model.name, 'Helper');
      expect(model.type, 'Maid');
      expect(model.govtIdType, 'Aadhaar Card');
      expect(model.workingDays, 'Mon - Sat');
      expect(model.status, 'Active');
      expect(model.isActive, true);
    });

    test('HelperLogModel parses fromMap and computes formattedTime correctly',
        () {
      final map = {
        'id': 'log-101',
        'helperId': 'hlp-101',
        'name': 'Sunita Sharma',
        'action': 'ENTRY',
        'gateName': 'Gate 1',
        'timestamp': '2026-08-14T08:30:00.000Z',
        'flatNumber': '101',
      };

      final log = HelperLogModel.fromMap(map);

      expect(log.id, 'log-101');
      expect(log.helperId, 'hlp-101');
      expect(log.name, 'Sunita Sharma');
      expect(log.action, 'ENTRY');
      expect(log.isEntry, true);
      expect(log.gateName, 'Gate 1');
      expect(log.formattedTime, isNotNull);
    });
  });
}
