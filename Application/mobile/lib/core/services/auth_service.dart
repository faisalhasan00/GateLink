import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  // ── Current User ────────────────────────────────────────────────────────────
  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // ── EMAIL + PASSWORD ─────────────────────────────────────────────────────────

  /// Sign in with email and password (with auto-registration for Admin pre-created accounts)
  Future<UserCredential> signInWithEmail(String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password.trim(),
      );
    } catch (e) {
      // If user not in Firebase Auth, check if Admin pre-added them in Firestore
      try {
        final query = await _db
            .collection('societies/SOC-001/users')
            .where('email', isEqualTo: email.trim())
            .get();

        if (query.docs.isNotEmpty) {
          final docData = query.docs.first.data();
          final oldDocId = query.docs.first.id;

          // If Admin set a specific temp password, enforce it
          if (docData.containsKey('password') && docData['password'].toString().isNotEmpty) {
            if (docData['password'] != password.trim()) {
              throw Exception('Invalid password. Please use the initial password assigned by your Admin.');
            }
          }

          // Auto-create Auth account for pre-added resident
          final cred = await _auth.createUserWithEmailAndPassword(
            email: email.trim(),
            password: password.trim(),
          );

          if (cred.user != null) {
            // Re-key document with new Auth UID
            final updatedData = Map<String, dynamic>.from(docData);
            updatedData['uid'] = cred.user!.uid;
            
            await _db.doc('societies/SOC-001/users/${cred.user!.uid}').set(updatedData);
            if (oldDocId != cred.user!.uid) {
              await _db.doc('societies/SOC-001/users/$oldDocId').delete();
            }
            return cred;
          }
        }
      } catch (_) {}
      rethrow;
    }
  }

  /// Register with email and password, then save profile to Firestore
  Future<UserCredential> registerWithEmail({
    required String email,
    required String password,
    required String name,
    required String flatNumber,
    required String societyCode,
    required String role, // 'resident' or 'guard'
  }) async {
    // 1. Create Firebase Auth user
    final credential = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password.trim(),
    );

    // 2. Update display name
    await credential.user?.updateDisplayName(name);

    // 3. Find societyId from societyCode
    final societyQuery = await _db
        .collection('societies')
        .where('code', isEqualTo: societyCode.toUpperCase())
        .limit(1)
        .get();

    String societyId;
    if (societyQuery.docs.isEmpty) {
      // Fallback for testing: auto-create/link to SOC-001
      societyId = 'SOC-001';
      await _db.collection('societies').doc(societyId).set({
        'code': societyCode.toUpperCase(),
        'name': 'Greenwood Estate',
      }, SetOptions(merge: true));
    } else {
      societyId = societyQuery.docs.first.id;
    }

    // 4. Save user profile to Firestore
    await _db.collection('societies/$societyId/users').doc(credential.user!.uid).set({
      'uid': credential.user!.uid,
      'name': name,
      'email': email.trim(),
      'flatNumber': flatNumber,
      'role': role,
      'societyId': societyId,
      'status': 'pending', // Needs admin approval
      'createdAt': DateTime.now().toIso8601String(),
    });

    return credential;
  }

  // ── GOOGLE SIGN-IN ──────────────────────────────────────────────────────────

  /// Sign in with Google (for Residents)
  Future<UserCredential?> signInWithGoogle() async {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) return null; // User cancelled

    final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );

    return await _auth.signInWithCredential(credential);
  }

  // ── SIGN OUT ─────────────────────────────────────────────────────────────────

  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
