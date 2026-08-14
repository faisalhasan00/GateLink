import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/maintenance_repository_impl.dart';
import '../domain/repositories/maintenance_repository.dart';

final maintenanceRepositoryProvider = Provider<MaintenanceRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return MaintenanceRepositoryImpl(firestore: firestore);
});

final guardMaintenanceBillsStreamProvider = StreamProvider<List<Map<String, dynamic>>>((ref) {
  final userProfileAsync = ref.watch(userProfileProvider);
  final societyId = userProfileAsync.value?['societyId'] as String?;
  if (societyId == null || societyId.isEmpty) return Stream.value([]);
  final repository = ref.watch(maintenanceRepositoryProvider);
  return repository.watchMaintenanceBills(societyId);
});
