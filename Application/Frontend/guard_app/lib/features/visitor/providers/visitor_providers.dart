import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/visitor_repository_impl.dart';
import '../domain/models/visitor_model.dart';
import '../domain/repositories/visitor_repository.dart';

final visitorRepositoryProvider = Provider<VisitorRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return VisitorRepositoryImpl(firestore: firestore);
});

final todayVisitorsStreamProvider = StreamProvider<List<VisitorModel>>((ref) {
  final userProfileAsync = ref.watch(userProfileProvider);
  final societyId = userProfileAsync.value?['societyId'] as String?;
  if (societyId == null || societyId.isEmpty) {
    return Stream.value([]);
  }
  final repository = ref.watch(visitorRepositoryProvider);
  return repository.watchTodayVisitors(societyId);
});
