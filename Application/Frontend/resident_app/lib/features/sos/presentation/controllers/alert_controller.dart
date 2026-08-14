import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/alert_repository.dart';
import 'alert_state.dart';

class AlertController extends StateNotifier<AlertState> {
  final AlertRepository _repository;

  AlertController(this._repository) : super(const AlertState());

  Future<bool> broadcastSosAlert({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String phone,
    required String type,
    required String notes,
  }) async {
    state =
        state.copyWith(status: AlertActionStatus.loading, errorMessage: null);
    try {
      await _repository.broadcastSosAlert(
        societyId: societyId,
        residentUid: residentUid,
        residentName: residentName,
        flatNumber: flatNumber,
        phone: phone,
        type: type,
        notes: notes,
      );
      state = state.copyWith(
        status: AlertActionStatus.success,
        successMessage: 'Emergency SOS Alert Broadcasted Successfully!',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: AlertActionStatus.error,
        errorMessage: 'Failed to broadcast SOS alert: $e',
      );
      return false;
    }
  }

  void reset() {
    state = const AlertState();
  }
}
