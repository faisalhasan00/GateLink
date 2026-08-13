import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/user_repository.dart';
import 'profile_state.dart';

class ProfileController extends StateNotifier<ProfileState> {
  final UserRepository _repository;
  final FirebaseAuth? _customFirebaseAuth;

  ProfileController(this._repository, [this._customFirebaseAuth])
      : super(ProfileState.initial());

  FirebaseAuth get _auth => _customFirebaseAuth ?? FirebaseAuth.instance;

  void resetState() {
    state = ProfileState.initial();
  }

  Future<bool> updateProfile({
    required String uid,
    required String societyId,
    required String name,
    required String email,
    required String gender,
    required String dob,
  }) async {
    if (state.isLoading) return false;

    if (name.trim().isEmpty) {
      state = state.copyWith(
        status: ProfileActionStatus.error,
        errorMessage: 'Full name is required.',
      );
      return false;
    }

    if (email.trim().isEmpty || !email.contains('@')) {
      state = state.copyWith(
        status: ProfileActionStatus.error,
        errorMessage: 'Valid email address is required.',
      );
      return false;
    }

    state = state.copyWith(status: ProfileActionStatus.loading);

    try {
      await _repository.updateUserProfile(
        uid: uid,
        societyId: societyId,
        name: name.trim(),
        email: email.trim(),
        gender: gender,
        dob: dob.trim(),
      );

      await _repository.logUserActivity(
        societyId: societyId,
        uid: uid,
        action: 'Profile Updated',
        description: 'Updated name, email, gender, and date of birth details.',
      );

      state = state.copyWith(
        status: ProfileActionStatus.success,
        successMessage: 'Profile updated successfully!',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: ProfileActionStatus.error,
        errorMessage:
            'Error updating profile: ${e.toString().replaceAll('Exception: ', '')}',
      );
      return false;
    }
  }

  Future<bool> updateNotificationPreferences({
    required String societyId,
    required String uid,
    required Map<String, bool> preferences,
  }) async {
    if (state.isLoading) return false;

    if (uid.isEmpty) {
      state = state.copyWith(
        status: ProfileActionStatus.error,
        errorMessage: 'User session expired. Please log in again.',
      );
      return false;
    }

    state = state.copyWith(status: ProfileActionStatus.loading);

    try {
      await _repository.updateNotificationPreferences(
        societyId: societyId,
        uid: uid,
        preferences: preferences,
      );

      state = state.copyWith(
        status: ProfileActionStatus.success,
        successMessage: 'Notification preferences saved!',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: ProfileActionStatus.error,
        errorMessage: 'Failed to save notification preferences.',
      );
      return false;
    }
  }

  Future<bool> changePassword({
    required String currentPassword,
    required String newPassword,
    required String societyId,
  }) async {
    if (state.isLoading) return false;

    final user = _auth.currentUser;
    if (user == null || user.email == null) {
      state = state.copyWith(
        status: ProfileActionStatus.error,
        errorMessage: 'No authenticated user session found.',
      );
      return false;
    }

    state = state.copyWith(status: ProfileActionStatus.loading);

    try {
      // 1. Re-authenticate user with current password
      final cred = EmailAuthProvider.credential(
        email: user.email!,
        password: currentPassword,
      );
      await user.reauthenticateWithCredential(cred);

      // 2. Update to new password
      await user.updatePassword(newPassword);

      // 3. Log security activity via UserRepository
      await _repository.logUserActivity(
        societyId: societyId,
        uid: user.uid,
        action: 'Password Changed',
        description: 'Account security password updated successfully.',
      );

      state = state.copyWith(
        status: ProfileActionStatus.success,
        successMessage: 'Password changed successfully!',
      );
      return true;
    } on FirebaseAuthException catch (e) {
      String msg = 'Failed to change password.';
      if (e.code == 'wrong-password' || e.code == 'invalid-credential') {
        msg = 'Current password is incorrect.';
      } else if (e.code == 'weak-password') {
        msg = 'The new password is too weak.';
      }
      state = state.copyWith(
        status: ProfileActionStatus.error,
        errorMessage: msg,
      );
      return false;
    } catch (e) {
      state = state.copyWith(
        status: ProfileActionStatus.error,
        errorMessage:
            'Error changing password: ${e.toString().replaceAll('Exception: ', '')}',
      );
      return false;
    }
  }
}
