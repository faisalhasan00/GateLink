import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/helper_repository.dart';
import 'helper_state.dart';

class HelperController extends StateNotifier<HelperState> {
  final HelperRepository _repository;

  HelperController(this._repository) : super(HelperState.initial());

  void resetState() {
    state = HelperState.initial();
  }

  Future<bool> registerHelper({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String name,
    required String phone,
    required String type,
    required String govtIdType,
    required String govtIdNumber,
    required String workingDays,
    required String emergencyContact,
  }) async {
    if (state.isLoading) return false;

    if (name.trim().isEmpty) {
      state = state.copyWith(
        status: HelperActionStatus.error,
        errorMessage: 'Helper full name is required.',
      );
      return false;
    }

    if (phone.trim().isEmpty) {
      state = state.copyWith(
        status: HelperActionStatus.error,
        errorMessage: 'Helper mobile phone is required.',
      );
      return false;
    }

    state = state.copyWith(status: HelperActionStatus.loading);

    try {
      await _repository.registerHelper(
        societyId: societyId,
        residentUid: residentUid,
        residentName: residentName,
        flatNumber: flatNumber,
        name: name,
        phone: phone,
        type: type,
        govtIdType: govtIdType,
        govtIdNumber: govtIdNumber,
        workingDays: workingDays,
        emergencyContact: emergencyContact,
      );

      state = state.copyWith(
        status: HelperActionStatus.success,
        successMessage: 'Successfully registered $name as $type with Permanent QR Pass!',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: HelperActionStatus.error,
        errorMessage:
            'Error registering helper: ${e.toString().replaceAll('Exception: ', '')}',
      );
      return false;
    }
  }

  Future<bool> revokeHelperAccess({
    required String societyId,
    required String helperId,
    required String helperName,
  }) async {
    state = state.copyWith(status: HelperActionStatus.loading);
    try {
      await _repository.updateHelperStatus(
        societyId: societyId,
        helperId: helperId,
        status: 'Revoked',
      );
      state = state.copyWith(
        status: HelperActionStatus.success,
        successMessage: 'Access revoked for $helperName. Gate entry is now blocked.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: HelperActionStatus.error,
        errorMessage: 'Error revoking access: $e',
      );
      return false;
    }
  }

  Future<bool> reactivateHelperAccess({
    required String societyId,
    required String helperId,
    required String helperName,
  }) async {
    state = state.copyWith(status: HelperActionStatus.loading);
    try {
      await _repository.updateHelperStatus(
        societyId: societyId,
        helperId: helperId,
        status: 'Active',
      );
      state = state.copyWith(
        status: HelperActionStatus.success,
        successMessage: 'Access reactivated for $helperName. QR pass is now active.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: HelperActionStatus.error,
        errorMessage: 'Error reactivating access: $e',
      );
      return false;
    }
  }

  Future<bool> deleteHelper({
    required String societyId,
    required String helperId,
    required String helperName,
  }) async {
    state = state.copyWith(status: HelperActionStatus.loading);
    try {
      await _repository.deleteHelper(
        societyId: societyId,
        helperId: helperId,
      );
      state = state.copyWith(
        status: HelperActionStatus.success,
        successMessage: 'Helper $helperName deleted successfully.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: HelperActionStatus.error,
        errorMessage: 'Error deleting helper: $e',
      );
      return false;
    }
  }
}
