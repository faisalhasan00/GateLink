import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/auth_providers.dart';
import '../data/repositories/parking_repository_impl.dart';
import '../domain/models/parking_slot_model.dart';
import '../domain/repositories/parking_repository.dart';

final parkingRepositoryProvider = Provider<ParkingRepository>((ref) {
  return ParkingRepositoryImpl(FirebaseFirestore.instance);
});

final parkingSlotsStreamProvider =
    StreamProvider<List<ParkingSlotModel>>((ref) {
  final user = ref.watch(currentUserProvider);
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? '';

  if (user == null || societyId.isEmpty) return Stream.value([]);
  final repository = ref.watch(parkingRepositoryProvider);
  return repository.watchParkingSlots(societyId, user.uid);
});
