import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/core/models/user_profile_model.dart';

void main() {
  group('UserProfileModel Unit Tests', () {
    test('fromMap parses map correctly into typed model', () {
      final map = {
        'uid': 'user-123',
        'name': 'Jane Doe',
        'displayName': 'Jane D',
        'email': 'jane@example.com',
        'societyId': 'SOC-777',
        'societyName': 'Green Acres Residency',
        'tower': 'Block B',
        'flatNumber': 'B-304',
        'gateName': 'Gate 2',
        'role': 'resident',
        'status': 'active',
      };

      final profile = UserProfileModel.fromMap(map);

      expect(profile.uid, 'user-123');
      expect(profile.name, 'Jane Doe');
      expect(profile.displayName, 'Jane D');
      expect(profile.email, 'jane@example.com');
      expect(profile.societyId, 'SOC-777');
      expect(profile.societyName, 'Green Acres Residency');
      expect(profile.tower, 'Block B');
      expect(profile.flatNumber, 'B-304');
      expect(profile.gateName, 'Gate 2');
      expect(profile.role, 'resident');
      expect(profile.status, 'active');
      expect(profile['societyId'], 'SOC-777');
    });

    test('fromMap uses defaults when fields are missing', () {
      final profile = UserProfileModel.fromMap({});

      expect(profile.name, 'Resident');
      expect(profile.societyId, 'SOC-001');
      expect(profile.societyName, 'SocietySphere Residency');
      expect(profile.tower, 'Tower A');
      expect(profile.flatNumber, 'Unknown');
    });
  });
}
