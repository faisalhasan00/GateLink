import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/models/user_profile_model.dart';
import '../../domain/repositories/user_repository.dart';

class UserRepositoryImpl implements UserRepository {
  final FirebaseFirestore _firestore;

  UserRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Future<UserProfileModel?> getUserProfile(String uid) async {
    if (uid.isEmpty) return null;

    Map<String, dynamic>? profileData;
    String? societyId;

    try {
      // 1. Direct read from global users/{uid} mapping
      final rootDoc = await _firestore.doc('users/$uid').get();
      if (rootDoc.exists && rootDoc.data() != null) {
        profileData = Map<String, dynamic>.from(rootDoc.data()!);
        societyId = profileData['societyId'] as String?;

        if (societyId != null &&
            societyId.isNotEmpty &&
            societyId != 'SOC-001') {
          // Try user document in society subcollection
          final socUserDoc =
              await _firestore.doc('societies/$societyId/users/$uid').get();

          if (socUserDoc.exists && socUserDoc.data() != null) {
            final socData = Map<String, dynamic>.from(socUserDoc.data()!);
            profileData = {...profileData, ...socData};
          } else {
            // Try staff document for Guards/Staff
            final socStaffDoc =
                await _firestore.doc('societies/$societyId/staff/$uid').get();
            if (socStaffDoc.exists && socStaffDoc.data() != null) {
              final staffData = Map<String, dynamic>.from(socStaffDoc.data()!);
              profileData = {...profileData, ...staffData};
            }
          }
        }
      }
    } catch (_) {}

    // 2. Fallback check across root staff / users if empty
    if (profileData == null) {
      try {
        final rootUserDoc = await _firestore.doc('users/$uid').get();
        if (rootUserDoc.exists && rootUserDoc.data() != null) {
          profileData = Map<String, dynamic>.from(rootUserDoc.data()!);
        }
      } catch (_) {}
    }

    if (profileData != null) {
      final Map<String, dynamic> data = Map<String, dynamic>.from(profileData);

      // Auto-sanitize legacy dummy strings from older mock versions
      final rawSocName = data['societyName'] as String? ?? '';
      final isMockSoc = rawSocName == 'My Home Bhooja' ||
          rawSocName == 'SocietySphere Residency' ||
          rawSocName == 'Housing Society' ||
          rawSocName.isEmpty;
      if (isMockSoc) {
        data['societyName'] = '';
      }

      societyId = data['societyId'] as String? ?? societyId;
      if (societyId == 'SOC-001') {
        societyId = '';
        data['societyId'] = '';
      }

      // 3. Dynamically fetch real Society details if societyId is valid
      if (societyId != null && societyId.isNotEmpty) {
        try {
          final socDoc = await _firestore.doc('societies/$societyId').get();
          if (socDoc.exists && socDoc.data() != null) {
            final socData = socDoc.data()!;
            final realName = socData['name'] as String?;
            final realCode = socData['code'] as String?;
            final realCity = socData['city'] as String?;
            final realCountry = socData['country'] as String?;

            if (realName != null && realName.isNotEmpty) {
              data['societyName'] = realName;
            }
            if (realCode != null && realCode.isNotEmpty) {
              data['societyCode'] = realCode;
            }
            if (realCity != null && realCity.isNotEmpty) {
              data['city'] = realCity;
            }
            if (realCountry != null && realCountry.isNotEmpty) {
              data['country'] = realCountry;
            }
          } else {
            // Document does not exist in Firestore; reset societyId
            societyId = '';
            data['societyId'] = '';
          }
        } catch (_) {}
      }

      // 4. If society is empty/unassigned, query all active societies in Firestore
      if (data['societyName'] == null ||
          (data['societyName'] as String).isEmpty ||
          societyId == null ||
          societyId.isEmpty) {
        try {
          final societiesSnap = await _firestore.collection('societies').get();
          if (societiesSnap.docs.isNotEmpty) {
            QueryDocumentSnapshot<Map<String, dynamic>>? matchedSocDoc;

            // Check each society to see if user has a membership subcollection doc
            for (final doc in societiesSnap.docs) {
              try {
                final memberDoc = await _firestore
                    .doc('societies/${doc.id}/users/$uid')
                    .get();
                if (memberDoc.exists && memberDoc.data() != null) {
                  matchedSocDoc = doc;
                  data.addAll(memberDoc.data()!);
                  break;
                }
              } catch (_) {}
            }

            // If not found in subcollection, link to the first active database society
            matchedSocDoc ??= societiesSnap.docs.first;

            final socData = matchedSocDoc.data();
            final realSocId = matchedSocDoc.id;
            final realSocName = socData['name'] as String? ?? 'Housing Society';
            final realSocCode = socData['code'] as String? ?? realSocId;
            final realCity = socData['city'] as String? ?? 'FAROOQNAGAR';
            final realCountry = socData['country'] as String? ?? 'India';

            data['societyId'] = realSocId;
            data['societyName'] = realSocName;
            data['societyCode'] = realSocCode;
            data['city'] = realCity;
            data['country'] = realCountry;

            // Auto-repair root document so Firestore stays clean and synced
            try {
              await _firestore.doc('users/$uid').set({
                'societyId': realSocId,
                'societyName': realSocName,
                'societyCode': realSocCode,
                'city': realCity,
                'country': realCountry,
              }, SetOptions(merge: true));
            } catch (_) {}
          }
        } catch (_) {}
      }

      return UserProfileModel.fromMap(data, defaultUid: uid);
    }

    return null;
  }

  @override
  Stream<UserProfileModel?> watchUserProfile(String uid) {
    if (uid.isEmpty) return Stream.value(null);

    return _firestore.doc('users/$uid').snapshots().asyncMap((snapshot) async {
      if (!snapshot.exists || snapshot.data() == null) return null;
      return getUserProfile(uid);
    });
  }

  @override
  Future<void> updateUserProfile({
    required String uid,
    required String societyId,
    required String name,
    required String email,
    required String gender,
    required String dob,
  }) async {
    final userRef = _firestore.doc('societies/$societyId/users/$uid');

    await userRef.set({
      'name': name,
      'email': email,
      'gender': gender,
      'dob': dob,
      'updatedAt': DateTime.now().toIso8601String(),
    }, SetOptions(merge: true));

    // Also sync to root global membership document
    await _firestore.doc('users/$uid').set({
      'name': name,
      'email': email,
      'updatedAt': DateTime.now().toIso8601String(),
    }, SetOptions(merge: true));
  }

  @override
  Future<void> updateProfilePhoto({
    required String uid,
    required String societyId,
    required String photoUrl,
  }) async {
    final now = DateTime.now().toIso8601String();
    
    // Update root user profile
    await _firestore.doc('users/$uid').set({
      'photoUrl': photoUrl,
      'updatedAt': now,
    }, SetOptions(merge: true));

    // Update society membership profile if societyId is available
    if (societyId.isNotEmpty) {
      await _firestore.doc('societies/$societyId/users/$uid').set({
        'photoUrl': photoUrl,
        'updatedAt': now,
      }, SetOptions(merge: true));
    }
  }

  @override
  Future<void> updateNotificationPreferences({
    required String societyId,
    required String uid,
    required Map<String, bool> preferences,
  }) async {
    await _firestore.doc('societies/$societyId/users/$uid').set({
      'notificationPreferences': preferences,
    }, SetOptions(merge: true));
  }

  @override
  Future<void> logUserActivity({
    required String societyId,
    required String uid,
    required String action,
    required String description,
  }) async {
    try {
      if (societyId.isNotEmpty && uid.isNotEmpty) {
        await _firestore
            .collection('societies/$societyId/users/$uid/activity_logs')
            .add({
          'action': action,
          'description': description,
          'timestamp': DateTime.now().toIso8601String(),
        });
      }
    } catch (e) {
      // Activity logging should never disrupt user transactions
      print('Non-fatal activity log failure: $e');
    }
  }
}
