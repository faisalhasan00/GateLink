import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const String _kSessionKey = 'gatelink_resident_has_session';
  static const String _kUidKey = 'gatelink_resident_uid';

  // ── Current User ────────────────────────────────────────────────────────────
  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  /// Check whether an active session was previously established
  Future<bool> hasCachedSession() async {
    try {
      final val = await _storage.read(key: _kSessionKey);
      return val == 'true';
    } catch (_) {
      return false;
    }
  }

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
    try {
      final userDoc = await _db.doc('users/$uid').get();
      if (userDoc.exists) {
        final data = userDoc.data() ?? {};
        final status = (data['status'] as String?)?.toLowerCase();
        if (status == 'deleted' || status == 'suspended') {
          await _storage.delete(key: _kSessionKey);
          await _storage.delete(key: _kUidKey);
          await _auth.signOut();
          throw FirebaseAuthException(
            code: 'user-disabled',
            message: 'Your account is suspended. Please contact your society admin.',
          );
        }
      } else {
        // Initialize user mapping document cleanly without mock strings
        final data = {
          'uid': uid,
          'email': cleanEmail,
          'name': cred.user!.displayName ?? 'Resident',
          'role': 'resident',
          'societyId': '',
          'societyName': '',
          'flatNumber': '',
          'status': 'active',
          'createdAt': DateTime.now().toIso8601String(),
        };
        await _db.doc('users/$uid').set(data, SetOptions(merge: true));
      }

      try {
        await _storage.write(key: _kSessionKey, value: 'true');
        await _storage.write(key: _kUidKey, value: uid);
      } catch (_) {}
    } catch (e) {
      if (e is FirebaseAuthException) rethrow;
      // Do not block authentication if Firestore sync is deferred
      try {
        await _storage.write(key: _kSessionKey, value: 'true');
        await _storage.write(key: _kUidKey, value: uid);
      } catch (_) {}
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

    // 2. Validate societyCode against real societies collection
    var societyId = '';
    var societyName = '';

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
      } else {
        final directDoc =
            await _db.collection('societies').doc(cleanCode).get();
        if (directDoc.exists) {
          societyId = directDoc.id;
          societyName = directDoc.data()?['name'] ?? 'Housing Society';
        }
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
      'status': 'pending_approval', // Pending RWA verification
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

    try {
      await _storage.write(key: _kSessionKey, value: 'true');
      await _storage.write(key: _kUidKey, value: credential.user!.uid);
    } catch (_) {}

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
          await _storage.delete(key: _kSessionKey);
          await _storage.delete(key: _kUidKey);
          await _auth.signOut();
          await _googleSignIn.signOut();
          throw FirebaseAuthException(
            code: 'user-disabled',
            message: 'Account not found or account is no longer active.',
          );
        }
      }
      try {
        await _storage.write(key: _kSessionKey, value: 'true');
        await _storage.write(key: _kUidKey, value: userCred.user!.uid);
      } catch (_) {}
    }
    return userCred;
  }

  // ── SIGN OUT ─────────────────────────────────────────────────────────────────

  Future<void> signOut() async {
    try {
      await _storage.delete(key: _kSessionKey);
      await _storage.delete(key: _kUidKey);
    } catch (_) {}
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
