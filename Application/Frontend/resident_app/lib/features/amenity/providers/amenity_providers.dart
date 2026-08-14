import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/auth_providers.dart';
import '../data/repositories/amenity_repository_impl.dart';
import '../domain/models/amenity_booking_model.dart';
import '../domain/models/amenity_model.dart';
import '../domain/repositories/amenity_repository.dart';
import '../presentation/controllers/amenity_controller.dart';
import '../presentation/controllers/amenity_state.dart';

final amenityRepositoryProvider = Provider<AmenityRepository>((ref) {
  return AmenityRepositoryImpl(FirebaseFirestore.instance);
});

final amenitiesStreamProvider = StreamProvider<List<AmenityModel>>((ref) {
  final repository = ref.watch(amenityRepositoryProvider);
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';
  return repository.watchAmenities(societyId);
});

final myBookingsStreamProvider =
    StreamProvider<List<AmenityBookingModel>>((ref) {
  final repository = ref.watch(amenityRepositoryProvider);
  final user = ref.watch(currentUserProvider);
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  if (user == null) return const Stream.empty();
  return repository.watchMyBookings(societyId, user.uid);
});

final amenityControllerProvider =
    StateNotifierProvider<AmenityController, AmenityState>((ref) {
  final repository = ref.watch(amenityRepositoryProvider);
  return AmenityController(repository);
});
