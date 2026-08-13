import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/repositories/user_repository_impl.dart';
import '../domain/repositories/user_repository.dart';
import '../presentation/controllers/profile_controller.dart';
import '../presentation/controllers/profile_state.dart';

final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepositoryImpl(FirebaseFirestore.instance);
});

final profileControllerProvider =
    StateNotifierProvider<ProfileController, ProfileState>((ref) {
  final repository = ref.watch(userRepositoryProvider);
  return ProfileController(repository);
});
