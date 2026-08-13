import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/complaint_repository.dart';
import 'complaint_state.dart';

class ComplaintController extends StateNotifier<ComplaintState> {
  final ComplaintRepository _repository;

  ComplaintController(this._repository) : super(ComplaintState.initial());

  void resetState() {
    state = ComplaintState.initial();
  }

  Future<bool> raiseComplaint({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String title,
    required String description,
    required String category,
    required String block,
    required String floor,
    required String priority,
    String? photoUrl,
  }) async {
    if (state.isLoading) return false;

    if (title.trim().isEmpty) {
      state = state.copyWith(
        status: ComplaintActionStatus.error,
        errorMessage: 'Complaint title is required.',
      );
      return false;
    }

    if (category.trim().isEmpty) {
      state = state.copyWith(
        status: ComplaintActionStatus.error,
        errorMessage: 'Please select a complaint category.',
      );
      return false;
    }

    state = state.copyWith(status: ComplaintActionStatus.loading);

    try {
      final complaintId = await _repository.raiseComplaint(
        societyId: societyId,
        residentUid: residentUid,
        residentName: residentName,
        flatNumber: flatNumber,
        title: title,
        description: description,
        category: category,
        block: block,
        floor: floor,
        priority: priority,
        photoUrl: photoUrl,
      );

      state = state.copyWith(
        status: ComplaintActionStatus.success,
        successMessage: 'Complaint raised successfully!',
        raisedComplaintId: complaintId,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: ComplaintActionStatus.error,
        errorMessage:
            'Failed to raise complaint: ${e.toString().replaceAll('Exception: ', '')}',
      );
      return false;
    }
  }
}
