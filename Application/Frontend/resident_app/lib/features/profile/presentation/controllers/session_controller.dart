import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/session_repository.dart';
import 'session_state.dart';

class SessionController extends StateNotifier<SessionState> {
  final SessionRepository _repository;

  SessionController(this._repository) : super(const SessionState());

  Future<bool> revokeSession({
    required String userId,
    required String sessionId,
  }) async {
    if (userId.trim().isEmpty || sessionId.trim().isEmpty) {
      state = state.copyWith(
        status: SessionActionStatus.error,
        errorMessage: 'Invalid parameters for session revocation',
      );
      return false;
    }
    state = state.copyWith(status: SessionActionStatus.loading, errorMessage: null);
    try {
      await _repository.revokeSession(userId: userId, sessionId: sessionId);
      state = state.copyWith(
        status: SessionActionStatus.success,
        successMessage: 'Session revoked successfully',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: SessionActionStatus.error,
        errorMessage: 'Failed to revoke session: $e',
      );
      return false;
    }
  }

  Future<bool> revokeAllOtherSessions({
    required String userId,
    required String currentSessionId,
  }) async {
    state = state.copyWith(status: SessionActionStatus.loading, errorMessage: null);
    try {
      await _repository.revokeAllOtherSessions(
        userId: userId,
        currentSessionId: currentSessionId,
      );
      state = state.copyWith(
        status: SessionActionStatus.success,
        successMessage: 'All other active sessions logged out',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: SessionActionStatus.error,
        errorMessage: 'Failed to revoke other sessions: $e',
      );
      return false;
    }
  }

  void reset() {
    state = const SessionState();
  }
}
