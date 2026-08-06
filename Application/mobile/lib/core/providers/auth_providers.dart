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
/// with fallback to direct society user/staff document read and real society name resolution.
final userProfileProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  Map<String, dynamic>? profileData;
  String? societyId;

  try {
    // 1. Direct O(1) read from global user membership mapping
    final rootDoc = await FirebaseFirestore.instance.doc('users/${user.uid}').get();
    if (rootDoc.exists && rootDoc.data() != null) {
      profileData = Map<String, dynamic>.from(rootDoc.data()!);
      societyId = profileData['societyId'] as String?;

      if (societyId != null && societyId.isNotEmpty) {
        // Try user document first
        final socUserDoc = await FirebaseFirestore.instance
            .doc('societies/$societyId/users/${user.uid}')
            .get();

        if (socUserDoc.exists && socUserDoc.data() != null) {
          profileData = Map<String, dynamic>.from(socUserDoc.data()!);
        } else {
          // Try staff document for Guards/Staff
          final socStaffDoc = await FirebaseFirestore.instance
              .doc('societies/$societyId/staff/${user.uid}')
              .get();
          if (socStaffDoc.exists && socStaffDoc.data() != null) {
            profileData = Map<String, dynamic>.from(socStaffDoc.data()!);
          }
        }
      }
    }
  } catch (_) {}

  // 2. CollectionGroup fallback queries across staff and users
  if (profileData == null) {
    try {
      final staffQuery = await FirebaseFirestore.instance
          .collectionGroup('staff')
          .where('uid', isEqualTo: user.uid)
          .limit(1)
          .get();

      if (staffQuery.docs.isNotEmpty) {
        profileData = Map<String, dynamic>.from(staffQuery.docs.first.data());
      } else {
        final usersQuery = await FirebaseFirestore.instance
            .collectionGroup('users')
            .where('uid', isEqualTo: user.uid)
            .limit(1)
            .get();
        if (usersQuery.docs.isNotEmpty) {
          profileData = Map<String, dynamic>.from(usersQuery.docs.first.data());
        }
      }
    } catch (_) {}
  }

  if (profileData != null) {
    societyId = profileData['societyId'] as String? ?? societyId;

    // 3. Dynamically fetch real Society Name from societies/{societyId} document if missing or generic
    final currentSocName = profileData['societyName'] as String?;
    if (societyId != null && societyId.isNotEmpty &&
        (currentSocName == null || currentSocName.isEmpty || currentSocName == 'Housing Society' || currentSocName == 'SocietySphere Residency' || currentSocName == societyId)) {
      try {
        final socDoc = await FirebaseFirestore.instance.doc('societies/$societyId').get();
        if (socDoc.exists && socDoc.data() != null) {
          final realName = socDoc.data()!['name'] as String?;
          if (realName != null && realName.isNotEmpty) {
            profileData['societyName'] = realName;
          }
        }
      } catch (_) {}
    }
  }

  return profileData;
});

/// Convenience provider for user account status ('active', 'pending_approval', 'suspended', 'rejected')
final userStatusProvider = FutureProvider<String?>((ref) async {
  final profile = await ref.watch(userProfileProvider.future);
  return profile?['status'] as String?;
});
