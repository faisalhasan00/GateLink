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
      // 1. Direct O(1) read from global user membership mapping
      final rootDoc = await _firestore.doc('users/$uid').get();
      if (rootDoc.exists && rootDoc.data() != null) {
        profileData = Map<String, dynamic>.from(rootDoc.data()!);
        societyId = profileData['societyId'] as String?;

        if (societyId != null && societyId.isNotEmpty) {
          // Try user document first
          final socUserDoc =
              await _firestore.doc('societies/$societyId/users/$uid').get();

          if (socUserDoc.exists && socUserDoc.data() != null) {
            profileData = Map<String, dynamic>.from(socUserDoc.data()!);
          } else {
            // Try staff document for Guards/Staff
            final socStaffDoc =
                await _firestore.doc('societies/$societyId/staff/$uid').get();
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
        final staffQuery = await _firestore
            .collectionGroup('staff')
            .where('uid', isEqualTo: uid)
            .limit(1)
            .get();

        if (staffQuery.docs.isNotEmpty) {
          profileData = Map<String, dynamic>.from(staffQuery.docs.first.data());
        } else {
          final usersQuery = await _firestore
              .collectionGroup('users')
              .where('uid', isEqualTo: uid)
              .limit(1)
              .get();
          if (usersQuery.docs.isNotEmpty) {
            profileData =
                Map<String, dynamic>.from(usersQuery.docs.first.data());
          }
        }
      } catch (_) {}
    }

    if (profileData != null) {
      societyId = profileData['societyId'] as String? ?? societyId;

      // 3. Dynamically fetch real Society Name from societies/{societyId} document if missing or generic
      final currentSocName = profileData['societyName'] as String?;
      if (societyId != null &&
          societyId.isNotEmpty &&
          (currentSocName == null ||
              currentSocName.isEmpty ||
              currentSocName == 'Housing Society' ||
              currentSocName == 'SocietySphere Residency' ||
              currentSocName == societyId)) {
        try {
          final socDoc = await _firestore.doc('societies/$societyId').get();
          if (socDoc.exists && socDoc.data() != null) {
            final realName = socDoc.data()!['name'] as String?;
            if (realName != null && realName.isNotEmpty) {
              profileData['societyName'] = realName;
            }
          }
        } catch (_) {}
      }
    }

    return profileData != null
        ? UserProfileModel.fromMap(profileData, defaultUid: uid)
        : null;
  }

  @override
  Stream<UserProfileModel?> watchUserProfile(String uid) {
    if (uid.isEmpty) return Stream.value(null);

    return _firestore
        .collectionGroup('users')
        .where('uid', isEqualTo: uid)
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) return null;
      return UserProfileModel.fromMap(snapshot.docs.first.data(), defaultUid: uid);
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
    await _firestore
        .collection('societies/$societyId/users/$uid/activity_logs')
        .add({
      'action': action,
      'description': description,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }
}
