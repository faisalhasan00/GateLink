import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/guard_alert_model.dart';
import '../../domain/repositories/alert_repository.dart';
import '../../providers/alert_providers.dart';

final alertControllerProvider =
    StateNotifierProvider<AlertController, AsyncValue<void>>((ref) {
  final repository = ref.watch(alertRepositoryProvider);
  return AlertController(repository, ref);
});

class AlertController extends StateNotifier<AsyncValue<void>> {
  final AlertRepository _repository;
  final Ref _ref;

  AlertController(this._repository, this._ref) : super(const AsyncValue.data(null));

  String? get _societyId {
    final profile = _ref.read(userProfileProvider).value;
    return profile?['societyId'] as String?;
  }

  Future<void> broadcastSosAlert(GuardAlertModel alert) async {
    final societyId = _societyId;
    if (societyId == null || societyId.isEmpty) {
      state = AsyncValue.error(
        Exception('Society ID is missing from user profile'),
        StackTrace.current,
      );
      return;
    }
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await _repository.broadcastSosAlert(societyId, alert);
      await _repository.sendSosNotification(
        societyId,
        title: '🚨 EMERGENCY SOS TRIGGERED: ${alert.type}',
        body: 'Emergency SOS triggered by ${alert.residentName ?? alert.guardEmail ?? "User"} (${alert.flatNumber ?? "Gate"}). Type: ${alert.type}. Immediate assistance required!',
      );
    });
  }
}
