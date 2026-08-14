import '../models/session_model.dart';

abstract class SessionRepository {
  /// Stream active sessions for a user
  Stream<List<SessionModel>> watchUserSessions(String userId);

  /// Revoke a specific session
  Future<void> revokeSession({
    required String userId,
    required String sessionId,
  });

  /// Revoke all other active sessions except the current session
  Future<void> revokeAllOtherSessions({
    required String userId,
    required String currentSessionId,
  });
}
