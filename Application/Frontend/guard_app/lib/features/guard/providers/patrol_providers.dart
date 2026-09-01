import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../data/repositories/patrol_repository.dart';
import '../domain/models/patrol_checkpoint_model.dart';
import '../domain/models/patrol_log_model.dart';

final patrolRepositoryProvider = Provider<PatrolRepository>((ref) {
  return PatrolRepository();
});

/// Stream of all active checkpoints for the guard's society
final patrolCheckpointsProvider = StreamProvider<List<PatrolCheckpointModel>>((ref) {
  final userProfile = ref.watch(userProfileProvider).value;
  final societyId = userProfile?['societyId'] as String? ?? '';
  if (societyId.isEmpty) return Stream.value([]);

  final repo = ref.watch(patrolRepositoryProvider);
  return repo.streamCheckpoints(societyId);
});

/// Stream of today's patrol logs for the guard's society
final todayPatrolLogsProvider = StreamProvider<List<PatrolLogModel>>((ref) {
  final userProfile = ref.watch(userProfileProvider).value;
  final societyId = userProfile?['societyId'] as String? ?? '';
  if (societyId.isEmpty) return Stream.value([]);

  final repo = ref.watch(patrolRepositoryProvider);
  return repo.streamTodayPatrolLogs(societyId);
});
