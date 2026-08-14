import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/session_model.dart';
import '../../domain/repositories/session_repository.dart';

class SessionRepositoryImpl implements SessionRepository {
  final FirebaseFirestore _firestore;

  SessionRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<GuardSessionModel>> watchSessions(String uid) {
    if (uid.isEmpty) return Stream.value([]);
    return _firestore
        .collection('users/$uid/sessions')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => GuardSessionModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  @override
  Future<void> revokeSession(String uid, String sessionId) async {
    if (uid.isEmpty || sessionId.isEmpty) return;
    await _firestore.doc('users/$uid/sessions/$sessionId').delete();
  }

  @override
  Future<void> revokeAllOtherSessions(String uid, String currentSessionId) async {
    if (uid.isEmpty) return;
    final snapshot = await _firestore.collection('users/$uid/sessions').get();
    final batch = _firestore.batch();
    for (final doc in snapshot.docs) {
      if (doc.id != currentSessionId) {
        batch.delete(doc.reference);
      }
    }
    await batch.commit();
  }
}
