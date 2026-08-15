import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/auth_service.dart';
import '../models/user_profile_model.dart';
import '../../features/profile/providers/user_providers.dart';
export '../../features/profile/providers/user_providers.dart';

// ── SERVICE PROVIDER ──────────────────────────────────────────────────────────

final authServiceProvider = Provider<AuthService>((ref) => AuthService());

// ── AUTH STATE PROVIDER ───────────────────────────────────────────────────────

/// Listens to auth state changes. Null = not logged in. User = logged in.
final authStateProvider = StreamProvider<User?>((ref) {
  return ref.watch(authServiceProvider).authStateChanges;
});

/// Convenience provider: currently logged-in user (or null)
final currentUserProvider = Provider<User?>((ref) {
  return ref.watch(authStateProvider).value;
});

/// Directly fetches the user profile using UserRepository with authoritative deletion auto-signout
final userProfileProvider = FutureProvider<UserProfileModel?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;
  final repository = ref.watch(userRepositoryProvider);
  var profile = await repository.getUserProfile(user.uid);

  // If user was explicitly suspended or deleted in database, sign out
  if (profile != null && (profile.status == 'deleted' || profile.status == 'suspended')) {
    await ref.read(authServiceProvider).signOut();
    return null;
  }

  // If profile document hasn't synced yet, provide fallback from Firebase Auth session
  profile ??= UserProfileModel(
    uid: user.uid,
    name: user.displayName ?? (user.email?.split('@').first ?? 'Resident'),
    displayName: user.displayName ?? (user.email?.split('@').first ?? 'Resident'),
    email: user.email ?? '',
    phone: user.phoneNumber ?? '',
    role: 'resident',
    flatNumber: '',
    tower: '',
    gateName: '',
    societyId: '',
    societyName: '',
    status: 'active',
  );

  return profile;
});

/// Convenience provider for user account status ('active', 'pending_approval', 'suspended', 'rejected')
final userStatusProvider = FutureProvider<String?>((ref) async {
  final profile = await ref.watch(userProfileProvider.future);
  return profile?.status;
});
