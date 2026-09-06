import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const String _kSessionKey = 'gatelink_guard_has_session';
  static const String _kUidKey = 'gatelink_guard_uid';
  
  static bool _isSessionActiveCache = false;

  // ── Current User ────────────────────────────────────────────────────────────
  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  /// Synchronous check for active session (memory cache or currentUser)
  bool hasCachedSessionSync() {
    if (_auth.currentUser != null) {
      _isSessionActiveCache = true;
      return true;
    }
    return _isSessionActiveCache;
  }

  /// Check whether an active session was previously established across storage mechanisms
  Future<bool> hasCachedSession() async {
    if (_auth.currentUser != null) {
      _isSessionActiveCache = true;
      return true;
    }

    if (_isSessionActiveCache) return true;

    try {
      final prefs = await SharedPreferences.getInstance();
      final hasPref = prefs.getBool(_kSessionKey) ?? false;
      final cachedUid = prefs.getString(_kUidKey);
      if (hasPref || (cachedUid != null && cachedUid.isNotEmpty)) {
        _isSessionActiveCache = true;
        return true;
      }
    } catch (_) {}

    try {
      final val = await _storage.read(key: _kSessionKey);
      final uid = await _storage.read(key: _kUidKey);
      if (val == 'true' || (uid != null && uid.isNotEmpty)) {
        _isSessionActiveCache = true;
        return true;
      }
    } catch (_) {}

    return false;
  }

  Future<void> _persistSession(String uid) async {
    _isSessionActiveCache = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_kSessionKey, true);
      await prefs.setString(_kUidKey, uid);
    } catch (_) {}

    try {
      await _storage.write(key: _kSessionKey, value: 'true');
      await _storage.write(key: _kUidKey, value: uid);
    } catch (_) {}
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
          data = {
            'uid': uid,
            'email': cleanEmail,
            'name': cred.user!.displayName ?? 'Guard',
            'role': 'guard',
            'societyId': '',
            'societyName': '',
            'status': 'active',
            'createdAt': DateTime.now().toIso8601String(),
          };
        }

        try {
          await _db.doc('users/$uid').set(data, SetOptions(merge: true));
        } catch (_) {}
      }

      final status = (data['status'] as String?)?.toLowerCase();
      if (status == 'deleted' || status == 'suspended') {
        await signOut();
        throw FirebaseAuthException(
          code: 'user-disabled',
          message: 'Your account is suspended. Please contact your society admin.',
        );
      }
    } catch (e) {
      if (e is FirebaseAuthException) rethrow;
      // Do not block login if firestore read has transient error
    }

    await _persistSession(uid);

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
    String residentRoleType = 'Flat Owner',
    String occupancyStatus = 'Currently residing',
    String? documentProofUrl,
    String? documentType,
  }) async {
    final cleanCode = societyCode.trim().toUpperCase();

    // 1. Guards cannot self-register without RWA Pre-Provisioning
    if (role.toLowerCase() == 'guard') {
      throw Exception('Security Guards cannot self-register. Please ask your RWA Committee to provision your Gate Access Passcode.');
    }

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
      }
    } catch (_) {}

    final credential = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password.trim(),
    );

    await credential.user?.updateDisplayName(name);

    final fullFlatNo = buildingBlock.isNotEmpty ? '$buildingBlock-$flatNumber' : flatNumber;

    await _db.collection('societies/$societyId/users').doc(credential.user!.uid).set({
      'uid': credential.user!.uid,
      'name': name,
      'email': email.trim(),
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
      'status': 'pending_approval',
      'documentProofUrl': documentProofUrl ?? '',
      'documentType': documentType ?? 'Rent Agreement / Electricity Bill / Address Proof',
      'createdAt': DateTime.now().toIso8601String(),
    });

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

    await _persistSession(credential.user!.uid);

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

    final userCred = await _auth.signInWithCredential(credential);
    if (userCred.user != null) {
      final uid = userCred.user!.uid;
      try {
        final userDoc = await _db.doc('users/$uid').get();
        if (userDoc.exists) {
          final data = userDoc.data() ?? {};
          final status = (data['status'] as String?)?.toLowerCase();
          if (status == 'deleted' || status == 'suspended') {
            await signOut();
            throw FirebaseAuthException(
              code: 'user-disabled',
              message: 'Account suspended. Please contact your society admin.',
            );
          }
        }
      } catch (e) {
        if (e is FirebaseAuthException) rethrow;
      }
      await _persistSession(uid);
    }
    return userCred;
  }

  // ── SIGN OUT (EXPLICIT ONLY) ─────────────────────────────────────────────────

  /// Terminates guard session only when physically clicked by the user
  Future<void> signOut() async {
    _isSessionActiveCache = false;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_kSessionKey, false);
      await prefs.remove(_kSessionKey);
      await prefs.remove(_kUidKey);
    } catch (_) {}

    try {
      await _storage.delete(key: _kSessionKey);
      await _storage.delete(key: _kUidKey);
    } catch (_) {}

    try {
      await _googleSignIn.signOut();
    } catch (_) {}

    try {
      await _auth.signOut();
    } catch (_) {}
  }
}
