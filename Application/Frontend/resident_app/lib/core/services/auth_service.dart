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

  /// Sign in with email and password (with pre-provisioned account checks for residents and staff)
  Future<UserCredential> signInWithEmail(String email, String password) async {
    final cleanEmail = email.trim().toLowerCase();
    final cleanPass = password.trim();

    try {
      return await _auth.signInWithEmailAndPassword(
        email: cleanEmail,
        password: cleanPass,
      );
    } catch (e) {
      // If user not in Firebase Auth yet, check if RWA Admin pre-added them in Firestore (staff or users)
      try {
        // 1. Check collectionGroup('staff')
        final staffQuery = await _db.collectionGroup('staff').get();
        for (final docSnap in staffQuery.docs) {
          final docData = docSnap.data();
          if ((docData['email'] as String? ?? '').trim().toLowerCase() ==
              cleanEmail) {
            final parentSocId = docSnap.reference.parent.parent?.id ??
                docData['societyId'] ??
                'SOC-001';

            UserCredential cred;
            try {
              cred = await _auth.createUserWithEmailAndPassword(
                email: cleanEmail,
                password: cleanPass,
              );
            } catch (authErr) {
              if (authErr is FirebaseAuthException &&
                  authErr.code == 'email-already-in-use') {
                cred = await _auth.signInWithEmailAndPassword(
                    email: cleanEmail, password: cleanPass);
              } else {
                rethrow;
              }
            }

            if (cred.user != null) {
              final updatedData = Map<String, dynamic>.from(docData);
              updatedData['uid'] = cred.user!.uid;
              updatedData.remove('password');

              await docSnap.reference.set(updatedData, SetOptions(merge: true));

              // Populate direct /users/{uid} index mapping for Auth & RBAC
              await _db.doc('users/${cred.user!.uid}').set({
                'uid': cred.user!.uid,
                'email': cleanEmail,
                'societyId': parentSocId,
                'role': 'guard',
                'department': docData['department'] ?? 'Security',
                'name': docData['name'] ?? 'Gate Guard',
                'phone': docData['phone'] ?? '',
                'status': 'active',
                'createdAt': DateTime.now().toIso8601String(),
              }, SetOptions(merge: true));

              return cred;
            }
          }
        }

        // 2. Check collectionGroup('users')
        final usersQuery = await _db.collectionGroup('users').get();
        for (final docSnap in usersQuery.docs) {
          final docData = docSnap.data();
          if ((docData['email'] as String? ?? '').trim().toLowerCase() ==
              cleanEmail) {
            final parentSocId = docSnap.reference.parent.parent?.id ??
                docData['societyId'] ??
                'SOC-001';

            UserCredential cred;
            try {
              cred = await _auth.createUserWithEmailAndPassword(
                email: cleanEmail,
                password: cleanPass,
              );
            } catch (authErr) {
              if (authErr is FirebaseAuthException &&
                  authErr.code == 'email-already-in-use') {
                cred = await _auth.signInWithEmailAndPassword(
                    email: cleanEmail, password: cleanPass);
              } else {
                rethrow;
              }
            }

            if (cred.user != null) {
              final updatedData = Map<String, dynamic>.from(docData);
              updatedData['uid'] = cred.user!.uid;
              updatedData.remove('password');

              await docSnap.reference.set(updatedData, SetOptions(merge: true));

              await _db.doc('users/${cred.user!.uid}').set({
                'uid': cred.user!.uid,
                'email': cleanEmail,
                'societyId': parentSocId,
                'role': docData['role'] ?? 'resident',
                'flatNumber': docData['flatNumber'] ?? '',
                'name': docData['name'] ?? '',
                'phone': docData['phone'] ?? '',
                'createdAt': DateTime.now().toIso8601String(),
              }, SetOptions(merge: true));

              return cred;
            }
          }
        }
      } catch (_) {}
      rethrow;
    }
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

    // 4. Save profile to Firestore with pending_approval status
    await _db
        .collection('societies/$societyId/users')
        .doc(credential.user!.uid)
        .set({
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
      'status': 'pending_approval', // Requires RWA Admin approval
      'documentProofUrl': documentProofUrl ?? '',
      'documentType':
          documentType ?? 'Rent Agreement / Electricity Bill / Address Proof',
      'createdAt': DateTime.now().toIso8601String(),
    });

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
      // Ensure global mapping exists
      await _db.collection('users').doc(userCred.user!.uid).set({
        'uid': userCred.user!.uid,
        'email': userCred.user!.email ?? '',
        'name': userCred.user!.displayName ?? '',
        'updatedAt': DateTime.now().toIso8601String(),
      }, SetOptions(merge: true));
    }
    return userCred;
  }

  // ── SIGN OUT ─────────────────────────────────────────────────────────────────

  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
