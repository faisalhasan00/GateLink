import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/auth_service.dart';
import '../models/user_profile_model.dart';

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

// Export UserRepository providers
export '../../features/profile/providers/user_providers.dart';

/// Directly fetches the user profile using UserRepository
final userProfileProvider = FutureProvider<UserProfileModel?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;
  final repository = ref.watch(userRepositoryProvider);
  return repository.getUserProfile(user.uid);
});

/// Convenience provider for user account status ('active', 'pending_approval', 'suspended', 'rejected')
final userStatusProvider = FutureProvider<String?>((ref) async {
  final profile = await ref.watch(userProfileProvider.future);
  return profile?.status;
});
