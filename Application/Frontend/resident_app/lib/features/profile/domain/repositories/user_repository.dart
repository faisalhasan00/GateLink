import '../../../../core/models/user_profile_model.dart';

abstract class UserRepository {
  Future<UserProfileModel?> getUserProfile(String uid);
  Stream<UserProfileModel?> watchUserProfile(String uid);
  Future<void> updateUserProfile({
    required String uid,
    required String societyId,
    required String name,
    required String email,
    required String gender,
    required String dob,
  });
  Future<void> updateNotificationPreferences({
    required String societyId,
    required String uid,
    required Map<String, bool> preferences,
  });
  Future<void> logUserActivity({
    required String societyId,
    required String uid,
    required String action,
    required String description,
  });
}
