import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../data/repositories/poll_repository_impl.dart';
import '../domain/models/poll_model.dart';
import '../domain/repositories/poll_repository.dart';

final pollRepositoryProvider = Provider<PollRepository>((ref) {
  return PollRepositoryImpl(FirebaseFirestore.instance);
});

final pollsStreamProvider = StreamProvider<List<PollModel>>((ref) {
  final user = ref.watch(currentUserProvider);
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? '';

  if (societyId.isEmpty) return Stream.value([]);

  final repository = ref.watch(pollRepositoryProvider);
  return repository.watchPolls(
    societyId,
    userUid: user?.uid,
    flatNumber: profile?.displayFlatNumber,
  );
});
