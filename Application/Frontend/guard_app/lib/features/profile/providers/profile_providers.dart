import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/session_repository_impl.dart';
import '../data/repositories/user_repository_impl.dart';
import '../domain/models/session_model.dart';
import '../domain/repositories/session_repository.dart';
import '../domain/repositories/user_repository.dart';

final sessionRepositoryProvider = Provider<SessionRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return SessionRepositoryImpl(firestore: firestore);
});

final userRepositoryProvider = Provider<UserRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return UserRepositoryImpl(firestore: firestore);
});

final userSessionsStreamProvider = StreamProvider<List<GuardSessionModel>>((ref) {
  final user = ref.watch(authServiceProvider).currentUser;
  if (user == null) return Stream.value([]);
  final repository = ref.watch(sessionRepositoryProvider);
  return repository.watchSessions(user.uid);
});
