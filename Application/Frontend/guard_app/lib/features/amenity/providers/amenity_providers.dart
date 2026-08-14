import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/amenity_repository_impl.dart';
import '../domain/repositories/amenity_repository.dart';

final amenityRepositoryProvider = Provider<AmenityRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return AmenityRepositoryImpl(firestore: firestore);
});

final guardAmenitiesStreamProvider = StreamProvider<List<Map<String, dynamic>>>((ref) {
  final userProfileAsync = ref.watch(userProfileProvider);
  final societyId = userProfileAsync.value?['societyId'] as String?;
  if (societyId == null || societyId.isEmpty) return Stream.value([]);
  final repository = ref.watch(amenityRepositoryProvider);
  return repository.watchAmenities(societyId);
});

final guardAmenityBookingsStreamProvider = StreamProvider<List<Map<String, dynamic>>>((ref) {
  final userProfileAsync = ref.watch(userProfileProvider);
  final societyId = userProfileAsync.value?['societyId'] as String?;
  if (societyId == null || societyId.isEmpty) return Stream.value([]);
  final repository = ref.watch(amenityRepositoryProvider);
  return repository.watchAmenityBookings(societyId);
});
