import '../models/session_model.dart';

abstract class SessionRepository {
  Stream<List<GuardSessionModel>> watchSessions(String uid);
  Future<void> revokeSession(String uid, String sessionId);
  Future<void> revokeAllOtherSessions(String uid, String currentSessionId);
}
