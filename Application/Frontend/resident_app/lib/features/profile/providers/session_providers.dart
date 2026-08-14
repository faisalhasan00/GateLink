import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../data/repositories/session_repository_impl.dart';
import '../domain/models/session_model.dart';
import '../domain/repositories/session_repository.dart';
import '../presentation/controllers/session_controller.dart';
import '../presentation/controllers/session_state.dart';

final sessionRepositoryProvider = Provider<SessionRepository>((ref) {
  return SessionRepositoryImpl();
});

final userSessionsStreamProvider =
    StreamProvider.autoDispose<List<SessionModel>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value([]);
  final repository = ref.watch(sessionRepositoryProvider);
  return repository.watchUserSessions(user.uid);
});

final sessionControllerProvider =
    StateNotifierProvider<SessionController, SessionState>((ref) {
  final repository = ref.watch(sessionRepositoryProvider);
  return SessionController(repository);
});
