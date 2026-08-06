import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/auth_service.dart';

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

// ── USER PROFILE PROVIDER (BUG-02 OPTIMIZED DIRECT LOOKUP) ───────────────────────

/// Directly fetches the user profile using the global /users/{uid} index mapping,
/// with fallback to direct society document read if known.
final userProfileProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  try {
    // 1. Direct O(1) read from global user membership mapping
    final rootDoc = await FirebaseFirestore.instance.doc('users/${user.uid}').get();
    if (rootDoc.exists && rootDoc.data() != null) {
      final data = rootDoc.data()!;
      final societyId = data['societyId'] as String?;
      if (societyId != null && societyId.isNotEmpty) {
        // Fetch full society profile
        final socUserDoc = await FirebaseFirestore.instance
            .doc('societies/$societyId/users/${user.uid}')
            .get();
        if (socUserDoc.exists) {
          return socUserDoc.data();
        }
      }
      return data;
    }
  } catch (_) {}

  // 2. CollectionGroup fallback query across all societies
  try {
    final querySnap = await FirebaseFirestore.instance
        .collectionGroup('users')
        .where('uid', isEqualTo: user.uid)
        .limit(1)
        .get();
    if (querySnap.docs.isNotEmpty) {
      return querySnap.docs.first.data();
    }
  } catch (_) {}

  return null;
});

/// Convenience provider for user account status ('active', 'pending_approval', 'suspended', 'rejected')
final userStatusProvider = FutureProvider<String?>((ref) async {
  final profile = await ref.watch(userProfileProvider.future);
  return profile?['status'] as String?;
});
