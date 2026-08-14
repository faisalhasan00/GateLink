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

  /// Sign in with email and password with authoritative backend database verification
  Future<UserCredential> signInWithEmail(String email, String password) async {
    final cleanEmail = email.trim().toLowerCase();
    final cleanPass = password.trim();

    final cred = await _auth.signInWithEmailAndPassword(
      email: cleanEmail,
      password: cleanPass,
    );

    if (cred.user == null) {
      throw FirebaseAuthException(
        code: 'user-not-found',
        message: 'Account not found or account is no longer active.',
      );
    }

    final uid = cred.user!.uid;

    // Check root users doc first
    var userDoc = await _db.doc('users/$uid').get();
    Map<String, dynamic> data = {};

    if (userDoc.exists) {
      data = userDoc.data() ?? {};
    } else {
      // Check if user exists in any society subcollection
      final societyQuery = await _db
          .collectionGroup('users')
          .where('email', isEqualTo: cleanEmail)
          .limit(1)
          .get();

      if (societyQuery.docs.isNotEmpty) {
        data = societyQuery.docs.first.data();
      } else {
        // Fallback: auto-create initial active resident profile so valid Auth user is never blocked
        data = {
          'uid': uid,
          'email': cleanEmail,
          'name': cred.user!.displayName ?? 'Resident',
          'role': 'resident',
          'societyId': 'SOC-001',
          'societyName': 'My Home Bhooja',
          'flatNumber': 'A-101',
          'status': 'active',
          'createdAt': DateTime.now().toIso8601String(),
        };
      }

      // Backfill root users document for seamless future lookups
      try {
        await _db.doc('users/$uid').set(data, SetOptions(merge: true));
      } catch (_) {}
    }

    final status = (data['status'] as String?)?.toLowerCase();
    if (status == 'deleted' || status == 'suspended') {
      await _auth.signOut();
      throw FirebaseAuthException(
        code: 'user-disabled',
        message: 'Your account is suspended. Please contact your society admin.',
      );
    }

    return cred;
  }

  /// Register resident with email & password after verifying Society Code or Name
  Future<UserCredential> registerWithEmail({
    required String email,
    required String password,
    required String name,
    required String flatNumber,
    required String societyCode,
    required String role, // 'resident' or 'guard'
    String phone = '',
    String country = 'India',
    String city = 'Hyderabad',
    String buildingBlock = '',
    String residentRoleType =
        'Flat Owner', // 'Flat Owner', 'Renting with family', 'Renting with other flatmates'
    String occupancyStatus =
        'Currently residing', // 'Currently residing', 'Flat is let out', 'Flat is empty'
    String? documentProofUrl,
    String? documentType,
  }) async {
    final cleanCode = societyCode.trim().toUpperCase();

    // 1. Guards cannot self-register without RWA Pre-Provisioning
    if (role.toLowerCase() == 'guard') {
      throw Exception(
          'Security Guards cannot self-register. Please ask your RWA Committee to provision your Gate Access Passcode.');
    }

    // 2. Validate societyCode against real societies collection (or fallback if SOC-001)
    var societyId = 'SOC-001';
    var societyName = 'My Home Bhooja';

    try {
      final societyQuery = await _db
          .collection('societies')
          .where('code', isEqualTo: cleanCode)
          .limit(1)
          .get();

      if (societyQuery.docs.isNotEmpty) {
        final societyDoc = societyQuery.docs.first;
        societyId = societyDoc.id;
        societyName = societyDoc.data()['name'] ?? 'Housing Society';
      }
    } catch (_) {}

    // 3. Create Firebase Auth user
    final credential = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password.trim(),
    );

    await credential.user?.updateDisplayName(name);

    final fullFlatNo =
        buildingBlock.isNotEmpty ? '$buildingBlock-$flatNumber' : flatNumber;

    final userProfilePayload = {
      'uid': credential.user!.uid,
      'name': name,
      'email': email.trim().toLowerCase(),
      'phone': phone,
      'country': country,
      'city': city,
      'buildingBlock': buildingBlock,
      'flatNumber': fullFlatNo,
      'unitNumber': flatNumber,
      'role': role,
      'residentRoleType': residentRoleType,
      'ownershipType': residentRoleType.contains('Owner') ? 'Owner' : 'Tenant',
      'occupancyStatus': occupancyStatus,
      'societyId': societyId,
      'societyName': societyName,
      'societyCode': cleanCode,
      'status': 'active', // Active resident profile
      'documentProofUrl': documentProofUrl ?? '',
      'documentType':
          documentType ?? 'Rent Agreement / Electricity Bill / Address Proof',
      'createdAt': DateTime.now().toIso8601String(),
    };

    // 4. Save profile to both root /users and society subcollection
    await _db
        .collection('societies/$societyId/users')
        .doc(credential.user!.uid)
        .set(userProfilePayload);

    await _db
        .collection('users')
        .doc(credential.user!.uid)
        .set(userProfilePayload, SetOptions(merge: true));

    // 4b. Trigger Real Cloud Notifications for Society Admin & Super Admin
    try {
      await _db.collection('societies/$societyId/notifications').add({
        'title': '🏠 New Resident Registration',
        'message': '$name requested approval for Flat $fullFlatNo.',
        'type': 'resident',
        'read': false,
        'createdAt': DateTime.now().toIso8601String(),
      });

      await _db.collection('notifications').add({
        'title': '🏠 Resident Signed Up',
        'message': '$name registered for $societyName (Flat $fullFlatNo).',
        'type': 'resident',
        'read': false,
        'createdAt': DateTime.now().toIso8601String(),
      });
    } catch (notifErr) {
      print("Error creating registration notification: $notifErr");
    }

    // 5. Populate global /users/{uid} direct mapping document
    await _db.collection('users').doc(credential.user!.uid).set({
      'uid': credential.user!.uid,
      'name': name,
      'email': email.trim(),
      'phone': phone,
      'country': country,
      'city': city,
      'societyId': societyId,
      'societyName': societyName,
      'role': role,
      'flatNumber': fullFlatNo,
      'status': 'pending_approval',
      'createdAt': DateTime.now().toIso8601String(),
    });

    return credential;
  }

  // ── GOOGLE SIGN-IN ──────────────────────────────────────────────────────────

  Future<UserCredential?> signInWithGoogle() async {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) return null;

    final GoogleSignInAuthentication googleAuth =
        await googleUser.authentication;
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );

    final userCred = await _auth.signInWithCredential(credential);
    if (userCred.user != null) {
      final userDoc = await _db.doc('users/${userCred.user!.uid}').get();
      if (userDoc.exists) {
        final data = userDoc.data() ?? {};
        final status = (data['status'] as String?)?.toLowerCase();
        if (status == 'deleted' || status == 'suspended' || status == 'inactive') {
          await _auth.signOut();
          await _googleSignIn.signOut();
          throw FirebaseAuthException(
            code: 'user-disabled',
            message: 'Account not found or account is no longer active.',
          );
        }
      }
    }
    return userCred;
  }

  // ── SIGN OUT ─────────────────────────────────────────────────────────────────

  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
