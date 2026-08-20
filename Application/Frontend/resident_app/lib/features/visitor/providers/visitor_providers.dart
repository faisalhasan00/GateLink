import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/visitor_repository_impl.dart';
import '../domain/models/visitor_model.dart';
import '../domain/repositories/visitor_repository.dart';
import '../presentation/controllers/visitor_controller.dart';
import '../presentation/controllers/visitor_state.dart';

final visitorRepositoryProvider = Provider<VisitorRepository>((ref) {
  final firestoreService = ref.watch(firestoreServiceProvider);
  return VisitorRepositoryImpl(firestoreService);
});

final visitorControllerProvider =
    StateNotifierProvider<VisitorController, VisitorState>((ref) {
  final repo = ref.watch(visitorRepositoryProvider);
  return VisitorController(repo);
});

/// Real-time stream of all visitors in current society.
final visitorsProvider = StreamProvider<List<VisitorModel>>((ref) {
  final repo = ref.watch(visitorRepositoryProvider);
  return repo.watchVisitors();
});

/// Stream of pending gate visitors requiring approval for current resident's flat.
final pendingVisitorsForFlatProvider =
    StreamProvider<List<VisitorModel>>((ref) {
  final repo = ref.watch(visitorRepositoryProvider);
  final profile = ref.watch(userProfileProvider).value;
  if (profile == null) return const Stream.empty();

  final flatNumber = profile.flatNumber;
  final tower = profile.tower;
  final uid = profile.uid;

  if (flatNumber.isEmpty && uid.isEmpty) return const Stream.empty();

  return repo.watchPendingVisitorsForResident(
    residentUid: uid,
    flatNumber: flatNumber,
    tower: tower,
  );
});
