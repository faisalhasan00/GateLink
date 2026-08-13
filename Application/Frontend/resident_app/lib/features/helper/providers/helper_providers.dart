import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/auth_providers.dart';
import '../data/repositories/helper_repository_impl.dart';
import '../domain/models/helper_log_model.dart';
import '../domain/models/helper_model.dart';
import '../domain/repositories/helper_repository.dart';
import '../presentation/controllers/helper_controller.dart';
import '../presentation/controllers/helper_state.dart';

final helperRepositoryProvider = Provider<HelperRepository>((ref) {
  return HelperRepositoryImpl(FirebaseFirestore.instance);
});

final helperControllerProvider =
    StateNotifierProvider<HelperController, HelperState>((ref) {
  final repository = ref.watch(helperRepositoryProvider);
  return HelperController(repository);
});

final myHelpersStreamProvider = StreamProvider<List<HelperModel>>((ref) {
  final user = ref.watch(currentUserProvider);
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  if (user == null) return Stream.value([]);
  final repository = ref.watch(helperRepositoryProvider);
  return repository.watchMyHelpers(societyId, user.uid);
});

final todayHelperLogsStreamProvider =
    StreamProvider<List<HelperLogModel>>((ref) {
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  final repository = ref.watch(helperRepositoryProvider);
  return repository.watchTodayHelperLogs(societyId);
});
