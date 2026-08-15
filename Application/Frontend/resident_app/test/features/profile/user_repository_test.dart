import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/core/models/user_profile_model.dart';
import 'package:societysphere/features/profile/domain/repositories/user_repository.dart';

class FakeUserRepository implements UserRepository {
  bool shouldFail = false;
  int updateProfileCalls = 0;
  int updateNotifPrefsCalls = 0;
  int logActivityCalls = 0;

  @override
  Future<UserProfileModel?> getUserProfile(String uid) async {
    if (uid.isEmpty) return null;
    return UserProfileModel(
      uid: uid,
      name: 'Jane Doe',
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '9876543210',
      societyId: 'SOC-001',
      societyName: 'Green Residency',
      tower: 'Block A',
      flatNumber: '101',
      gateName: 'Gate 1',
      role: 'resident',
      status: 'active',
    );
  }

  @override
  Stream<UserProfileModel?> watchUserProfile(String uid) {
    return Stream.value(null);
  }

  @override
  Future<void> updateUserProfile({
    required String uid,
    required String societyId,
    required String name,
    required String email,
    required String gender,
    required String dob,
  }) async {
    updateProfileCalls++;
    if (shouldFail) throw Exception('Failed to update profile');
  }

  @override
  Future<void> updateProfilePhoto({
    required String uid,
    required String societyId,
    required String photoUrl,
  }) async {
    if (shouldFail) throw Exception('Failed to update photo');
  }

  @override
  Future<void> updateNotificationPreferences({
    required String societyId,
    required String uid,
    required Map<String, bool> preferences,
  }) async {
    updateNotifPrefsCalls++;
    if (shouldFail) throw Exception('Failed to update preferences');
  }

  @override
  Future<void> logUserActivity({
    required String societyId,
    required String uid,
    required String action,
    required String description,
  }) async {
    logActivityCalls++;
  }
}

void main() {
  group('UserRepository Contract Tests', () {
    late FakeUserRepository repository;

    setUp(() {
      repository = FakeUserRepository();
    });

    test('getUserProfile returns typed UserProfileModel', () async {
      final profile = await repository.getUserProfile('user-101');

      expect(profile, isNotNull);
      expect(profile!.uid, 'user-101');
      expect(profile.name, 'Jane Doe');
      expect(profile.role, 'resident');
    });

    test('getUserProfile returns null when uid is empty', () async {
      final profile = await repository.getUserProfile('');

      expect(profile, isNull);
    });

    test('updateUserProfile calls repository correctly', () async {
      await repository.updateUserProfile(
        uid: 'user-101',
        societyId: 'SOC-001',
        name: 'Jane Doe',
        email: 'jane@example.com',
        gender: 'Female',
        dob: '15/05/1995',
      );

      expect(repository.updateProfileCalls, 1);
    });

    test('updateNotificationPreferences calls repository correctly', () async {
      await repository.updateNotificationPreferences(
        societyId: 'SOC-001',
        uid: 'user-101',
        preferences: {'visitors': true, 'bills': false},
      );

      expect(repository.updateNotifPrefsCalls, 1);
    });
  });
}
