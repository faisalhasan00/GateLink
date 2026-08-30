import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/helper_repository_impl.dart';
import '../domain/models/helper_log_model.dart';
import '../domain/models/helper_model.dart';
import '../domain/repositories/helper_repository.dart';

final helperRepositoryProvider = Provider<HelperRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return HelperRepositoryImpl(firestore: firestore);
});

final registeredHelpersStreamProvider = StreamProvider<List<HelperModel>>((ref) {
  final userProfileAsync = ref.watch(userProfileProvider);
  final societyId = userProfileAsync.value?['societyId'] as String?;
  if (societyId == null || societyId.isEmpty) return Stream.value([]);
  final repository = ref.watch(helperRepositoryProvider);
  // Guards see all helpers across the society
  return repository.watchRegisteredHelpers(societyId);
});

final helperLogsStreamProvider = StreamProvider<List<HelperLogModel>>((ref) {
  final userProfileAsync = ref.watch(userProfileProvider);
  final societyId = userProfileAsync.value?['societyId'] as String?;
  if (societyId == null || societyId.isEmpty) return Stream.value([]);
  final repository = ref.watch(helperRepositoryProvider);
  return repository.watchHelperLogs(societyId);
});
