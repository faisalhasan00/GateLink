import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/session_model.dart';
import '../../domain/repositories/session_repository.dart';

class SessionRepositoryImpl implements SessionRepository {
  final FirebaseFirestore _firestore;

  SessionRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<SessionModel>> watchUserSessions(String userId) {
    if (userId.isEmpty) return Stream.value([]);

    return _firestore
        .collectionGroup('user_sessions')
        .where('userUid', isEqualTo: userId)
        .snapshots()
        .map((snap) => snap.docs.map((doc) => SessionModel.fromMap(doc.data(), doc.id)).toList());
  }

  @override
  Future<void> revokeSession({
    required String userId,
    required String sessionId,
  }) async {
    final snap = await _firestore
        .collectionGroup('user_sessions')
        .where('userUid', isEqualTo: userId)
        .get();

    for (final doc in snap.docs) {
      if (doc.id == sessionId) {
        await doc.reference.delete();
        break;
      }
    }
  }

  @override
  Future<void> revokeAllOtherSessions({
    required String userId,
    required String currentSessionId,
  }) async {
    final snap = await _firestore
        .collectionGroup('user_sessions')
        .where('userUid', isEqualTo: userId)
        .get();
    final batch = _firestore.batch();

    for (final doc in snap.docs) {
      if (doc.id != currentSessionId) {
        batch.delete(doc.reference);
      }
    }

    await batch.commit();
  }
}
