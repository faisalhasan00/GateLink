import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/repositories/alert_repository_impl.dart';
import '../domain/repositories/alert_repository.dart';
import '../presentation/controllers/alert_controller.dart';
import '../presentation/controllers/alert_state.dart';

final alertRepositoryProvider = Provider<AlertRepository>((ref) {
  return AlertRepositoryImpl(FirebaseFirestore.instance);
});

final alertControllerProvider =
    StateNotifierProvider<AlertController, AlertState>((ref) {
  final repository = ref.watch(alertRepositoryProvider);
  return AlertController(repository);
});
