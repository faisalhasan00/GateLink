import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/core/models/user_profile_model.dart';
import 'package:societysphere/features/profile/domain/repositories/user_repository.dart';
import 'package:societysphere/features/profile/presentation/controllers/profile_controller.dart';
import 'package:societysphere/features/profile/presentation/controllers/profile_state.dart';

class MockUserRepository implements UserRepository {
  bool shouldFail = false;
  int updateProfileCalls = 0;
  int updateNotifPrefsCalls = 0;
  int logActivityCalls = 0;

  @override
  Future<UserProfileModel?> getUserProfile(String uid) async {
    return UserProfileModel(
      uid: uid,
      name: 'John Resident',
      displayName: 'John Resident',
      email: 'john@example.com',
      societyId: 'SOC-001',
      societyName: 'Green Valley',
      tower: 'Block B',
      flatNumber: '202',
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
  Future<void> updateNotificationPreferences({
    required String societyId,
    required String uid,
    required Map<String, bool> preferences,
  }) async {
    updateNotifPrefsCalls++;
    if (shouldFail)
      throw Exception('Failed to update notification preferences');
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
  late MockUserRepository mockRepository;
  late ProfileController controller;

  setUp(() {
    mockRepository = MockUserRepository();
    controller = ProfileController(mockRepository);
  });

  group('ProfileController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, ProfileActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
      expect(controller.state.successMessage, isNull);
    });

    test('updateProfile fails validation if name is empty', () async {
      final success = await controller.updateProfile(
        uid: 'user-101',
        societyId: 'SOC-001',
        name: '',
        email: 'john@example.com',
        gender: 'Male',
        dob: '12/10/1992',
      );

      expect(success, false);
      expect(controller.state.status, ProfileActionStatus.error);
      expect(controller.state.errorMessage, contains('name is required'));
      expect(mockRepository.updateProfileCalls, 0);
    });

    test('updateProfile fails validation if email is invalid', () async {
      final success = await controller.updateProfile(
        uid: 'user-101',
        societyId: 'SOC-001',
        name: 'John Doe',
        email: 'invalid-email',
        gender: 'Male',
        dob: '12/10/1992',
      );

      expect(success, false);
      expect(controller.state.status, ProfileActionStatus.error);
      expect(controller.state.errorMessage, contains('Valid email address'));
      expect(mockRepository.updateProfileCalls, 0);
    });

    test('updateProfile succeeds with valid inputs', () async {
      final success = await controller.updateProfile(
        uid: 'user-101',
        societyId: 'SOC-001',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        dob: '12/10/1992',
      );

      expect(success, true);
      expect(controller.state.status, ProfileActionStatus.success);
      expect(mockRepository.updateProfileCalls, 1);
      expect(mockRepository.logActivityCalls, 1);
    });

    test('updateProfile sets error state on repository failure', () async {
      mockRepository.shouldFail = true;

      final success = await controller.updateProfile(
        uid: 'user-101',
        societyId: 'SOC-001',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        dob: '12/10/1992',
      );

      expect(success, false);
      expect(controller.state.status, ProfileActionStatus.error);
      expect(mockRepository.updateProfileCalls, 1);
    });

    test('updateNotificationPreferences succeeds', () async {
      final success = await controller.updateNotificationPreferences(
        societyId: 'SOC-001',
        uid: 'user-101',
        preferences: {'visitors': true, 'bills': true},
      );

      expect(success, true);
      expect(controller.state.status, ProfileActionStatus.success);
      expect(mockRepository.updateNotifPrefsCalls, 1);
    });

    test('updateNotificationPreferences fails when uid is empty', () async {
      final success = await controller.updateNotificationPreferences(
        societyId: 'SOC-001',
        uid: '',
        preferences: {'visitors': true},
      );

      expect(success, false);
      expect(controller.state.status, ProfileActionStatus.error);
      expect(mockRepository.updateNotifPrefsCalls, 0);
    });
  });
}
