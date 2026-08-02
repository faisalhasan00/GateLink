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

  /// Sign in with email and password (with pre-provisioned account checks)
  Future<UserCredential> signInWithEmail(String email, String password) async {
    final cleanEmail = email.trim();
    final cleanPass = password.trim();

    try {
      return await _auth.signInWithEmailAndPassword(
        email: cleanEmail,
        password: cleanPass,
      );
    } catch (e) {
      // If user not in Firebase Auth, check if RWA Admin pre-added them in Firestore
      try {
        final societiesSnap = await _db.collection('societies').get();
        for (final socDoc in societiesSnap.docs) {
          final query = await _db
              .collection('societies/${socDoc.id}/users')
              .where('email', isEqualTo: cleanEmail)
              .get();

          if (query.docs.isNotEmpty) {
            final docData = query.docs.first.data();
            final oldDocId = query.docs.first.id;

            // Enforce temp password if set by admin
            if (docData.containsKey('password') && docData['password'].toString().isNotEmpty) {
              if (docData['password'] != cleanPass) {
                throw Exception('Invalid password. Please use the initial passcode assigned by your RWA Admin.');
              }
            }

            // Auto-create Auth account for pre-added resident/staff
            final cred = await _auth.createUserWithEmailAndPassword(
              email: cleanEmail,
              password: cleanPass,
            );

            if (cred.user != null) {
              final updatedData = Map<String, dynamic>.from(docData);
              updatedData['uid'] = cred.user!.uid;
              
              await _db.doc('societies/${socDoc.id}/users/${cred.user!.uid}').set(updatedData);
              if (oldDocId != cred.user!.uid) {
                await _db.doc('societies/${socDoc.id}/users/$oldDocId').delete();
              }
              return cred;
            }
          }
        }
      } catch (_) {}
      rethrow;
    }
  }

  /// Register resident with email & password after verifying Society Code
  Future<UserCredential> registerWithEmail({
    required String email,
    required String password,
    required String name,
    required String flatNumber,
    required String societyCode,
    required String role, // 'resident' or 'guard'
    String ownershipType = 'Owner', // 'Owner' or 'Tenant'
    String? documentProofUrl,
    String? documentType,
  }) async {
    final cleanCode = societyCode.trim().toUpperCase();

    // 1. Guards cannot self-register without RWA Pre-Provisioning
    if (role.toLowerCase() == 'guard') {
      throw Exception('Security Guards cannot self-register. Please ask your RWA Committee to provision your Gate Access Passcode.');
    }

    // 2. Validate societyCode against real societies collection
    final societyQuery = await _db
        .collection('societies')
        .where('code', isEqualTo: cleanCode)
        .limit(1)
        .get();

    if (societyQuery.docs.isEmpty) {
      throw Exception('Invalid Society Code ($cleanCode). Please ask your RWA Committee for the official Society Code.');
    }

    final societyDoc = societyQuery.docs.first;
    final societyId = societyDoc.id;
    final societyName = societyDoc.data()['name'] ?? 'Housing Society';

    // 3. Create Firebase Auth user
    final credential = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password.trim(),
    );

    await credential.user?.updateDisplayName(name);

    // 4. Save profile to Firestore with pending_approval status
    await _db.collection('societies/$societyId/users').doc(credential.user!.uid).set({
      'uid': credential.user!.uid,
      'name': name,
      'email': email.trim(),
      'flatNumber': flatNumber,
      'role': role,
      'ownershipType': ownershipType,
      'societyId': societyId,
      'societyName': societyName,
      'status': 'pending_approval', // Requires RWA Admin approval
      'documentProofUrl': documentProofUrl ?? '',
      'documentType': documentType ?? 'Rent Agreement / Electricity Bill',
      'createdAt': DateTime.now().toIso8601String(),
    });

    return credential;
  }

  // ── GOOGLE SIGN-IN ──────────────────────────────────────────────────────────

  Future<UserCredential?> signInWithGoogle() async {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) return null;

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
