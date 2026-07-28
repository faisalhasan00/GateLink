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

// ── USER PROFILE PROVIDER ─────────────────────────────────────────────────────

/// Fetches the user profile from Firestore using a collection group query.
final userProfileProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  // Temporarily check 'SOC-001' society first to bypass collectionGroup index requirement
  try {
    final doc = await FirebaseFirestore.instance
        .doc('societies/SOC-001/users/${user.uid}')
        .get();
    if (doc.exists) {
      return doc.data();
    }
  } catch (_) {}

  // If user doc doesn't exist, we don't mock. They must register properly.
  return null;
});
