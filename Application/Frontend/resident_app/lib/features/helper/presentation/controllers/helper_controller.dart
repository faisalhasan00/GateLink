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
        successMessage: 'Successfully registered $name as $type!',
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
}
