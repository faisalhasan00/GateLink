import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/repositories/user_repository.dart';

class UserRepositoryImpl implements UserRepository {
  final FirebaseFirestore _firestore;

  UserRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Future<void> updateUserProfile(String societyId, String uid, Map<String, dynamic> data) async {
    if (societyId.isEmpty || uid.isEmpty) {
      throw ArgumentError('Society ID and User UID are required');
    }
    await _firestore.doc('societies/$societyId/users/$uid').update(data);
  }

  @override
  Future<void> logAuditAction(String societyId, Map<String, dynamic> auditData) async {
    if (societyId.isEmpty) return;
    await _firestore.collection('societies/$societyId/audit_logs').add(auditData);
  }

  @override
  Future<Map<String, dynamic>?> checkUserStatus(String uid) async {
    if (uid.isEmpty) return null;
    final socSnap = await _firestore.collection('societies').get();
    for (final soc in socSnap.docs) {
      final userDoc = await _firestore.doc('societies/${soc.id}/users/$uid').get();
      if (userDoc.exists) {
        final data = userDoc.data();
        if (data != null) {
          data['societyId'] = soc.id;
          return data;
        }
      }
    }
    return null;
  }
}
