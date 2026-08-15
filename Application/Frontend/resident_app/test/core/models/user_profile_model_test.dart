import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/core/models/user_profile_model.dart';

void main() {
  group('UserProfileModel Unit Tests', () {
    test('fromMap parses map correctly into typed model and computes dynamic getters', () {
      final map = {
        'uid': 'user-123',
        'name': 'Jane Doe',
        'displayName': 'Jane D',
        'email': 'jane@example.com',
        'societyId': 'SOC-777',
        'societyName': 'Green Acres Residency',
        'societyCode': 'SOC-GA',
        'buildingBlock': 'Tower B',
        'unitNumber': '304',
        'flat': 'B-304',
        'gateName': 'Gate 2',
        'role': 'resident',
        'ownershipType': 'Owner',
        'status': 'active',
      };

      final profile = UserProfileModel.fromMap(map);

      expect(profile.uid, 'user-123');
      expect(profile.name, 'Jane Doe');
      expect(profile.displayName, 'Jane D');
      expect(profile.email, 'jane@example.com');
      expect(profile.societyId, 'SOC-777');
      expect(profile.societyName, 'Green Acres Residency');
      expect(profile.societyCode, 'SOC-GA');
      expect(profile.tower, 'Tower B');
      expect(profile.flatNumber, 'B-304');
      expect(profile.gateName, 'Gate 2');
      expect(profile.role, 'resident');
      expect(profile.status, 'active');
      expect(profile['societyId'], 'SOC-777');

      // Helper Getters
      expect(profile.initials, 'JD');
      expect(profile.displaySocietyName, 'Green Acres Residency');
      expect(profile.displayFlatNumber, 'B-304');
      expect(profile.displayRoleTitle, 'Owner');
    });

    test('fromMap handles empty map cleanly without crashing or dummy fallback data', () {
      final profile = UserProfileModel.fromMap({});

      expect(profile.name, 'Resident');
      expect(profile.societyId, '');
      expect(profile.societyName, '');
      expect(profile.tower, '');
      expect(profile.flatNumber, '');
      expect(profile.initials, 'R');
      expect(profile.displaySocietyName, 'Housing Society');
      expect(profile.displayFlatNumber, 'Not Assigned');
      expect(profile.displayRoleTitle, 'Resident');
    });
  });
}
