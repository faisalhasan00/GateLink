import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/repositories/session_repository.dart';
import '../../providers/profile_providers.dart';

final sessionControllerProvider =
    StateNotifierProvider<SessionController, AsyncValue<void>>((ref) {
  final repository = ref.watch(sessionRepositoryProvider);
  return SessionController(repository, ref);
});

class SessionController extends StateNotifier<AsyncValue<void>> {
  final SessionRepository _repository;
  final Ref _ref;

  SessionController(this._repository, this._ref) : super(const AsyncValue.data(null));

  String? get _userUid => _ref.read(authServiceProvider).currentUser?.uid;

  Future<void> revokeSession(String sessionId) async {
    final uid = _userUid;
    if (uid == null) return;
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _repository.revokeSession(uid, sessionId));
  }

  Future<void> revokeAllOtherSessions(String currentSessionId) async {
    final uid = _userUid;
    if (uid == null) return;
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => _repository.revokeAllOtherSessions(uid, currentSessionId),
    );
  }
}
