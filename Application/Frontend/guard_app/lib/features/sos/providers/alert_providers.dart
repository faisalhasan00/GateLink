import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/alert_repository_impl.dart';
import '../domain/repositories/alert_repository.dart';

final alertRepositoryProvider = Provider<AlertRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return AlertRepositoryImpl(firestore: firestore);
});
