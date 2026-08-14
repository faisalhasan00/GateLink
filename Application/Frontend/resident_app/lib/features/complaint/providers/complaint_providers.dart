import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/auth_providers.dart';
import '../data/repositories/complaint_repository_impl.dart';
import '../domain/models/complaint_model.dart';
import '../domain/repositories/complaint_repository.dart';
import '../presentation/controllers/complaint_controller.dart';
import '../presentation/controllers/complaint_state.dart';

final complaintRepositoryProvider = Provider<ComplaintRepository>((ref) {
  return ComplaintRepositoryImpl(FirebaseFirestore.instance);
});

final complaintControllerProvider =
    StateNotifierProvider<ComplaintController, ComplaintState>((ref) {
  final repository = ref.watch(complaintRepositoryProvider);
  return ComplaintController(repository);
});

final myComplaintsStreamProvider = StreamProvider<List<ComplaintModel>>((ref) {
  final user = ref.watch(currentUserProvider);
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  if (user == null) return Stream.value([]);
  final repository = ref.watch(complaintRepositoryProvider);
  return repository.watchMyComplaints(societyId, user.uid);
});

final complaintDetailStreamProvider =
    StreamProvider.family<ComplaintModel?, String>((ref, complaintId) {
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  if (complaintId.isEmpty) return Stream.value(null);
  final repository = ref.watch(complaintRepositoryProvider);
  return repository.watchComplaintDetail(societyId, complaintId);
});
