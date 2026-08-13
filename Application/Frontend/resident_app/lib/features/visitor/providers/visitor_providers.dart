import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/visitor_repository_impl.dart';
import '../domain/models/visitor_model.dart';
import '../domain/repositories/visitor_repository.dart';

final visitorRepositoryProvider = Provider<VisitorRepository>((ref) {
  final firestoreService = ref.watch(firestoreServiceProvider);
  return VisitorRepositoryImpl(firestoreService);
});

final visitorsProvider = StreamProvider<List<VisitorModel>>((ref) {
  final repo = ref.watch(visitorRepositoryProvider);
  return repo.watchVisitors();
});

final pendingVisitorsForFlatProvider = StreamProvider<List<VisitorModel>>((ref) {
  final repo = ref.watch(visitorRepositoryProvider);
  final profile = ref.watch(userProfileProvider).value;
  final flatNumber = profile?['flatNumber'] as String? ?? '';
  final tower = profile?['tower'] as String? ?? '';
  if (flatNumber.isEmpty || tower.isEmpty) return const Stream.empty();

  final hostFlat = '$tower-$flatNumber';
  return repo.watchPendingVisitorsForFlat(hostFlat);
});
