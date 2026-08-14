import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/visitor_model.dart';
import '../../domain/repositories/visitor_repository.dart';
import '../../providers/visitor_providers.dart';

final visitorControllerProvider =
    StateNotifierProvider<VisitorController, AsyncValue<void>>((ref) {
  final repository = ref.watch(visitorRepositoryProvider);
  return VisitorController(repository, ref);
});

class VisitorController extends StateNotifier<AsyncValue<void>> {
  final VisitorRepository _repository;
  final Ref _ref;

  VisitorController(this._repository, this._ref) : super(const AsyncValue.data(null));

  String? get _societyId {
    final profile = _ref.read(userProfileProvider).value;
    return profile?['societyId'] as String?;
  }

  Future<void> updateVisitorStatus(String visitorId, String status) async {
    final societyId = _societyId;
    if (societyId == null || societyId.isEmpty) {
      state = AsyncValue.error(
        Exception('Society ID is missing from user profile'),
        StackTrace.current,
      );
      return;
    }
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => _repository.updateVisitorStatus(societyId, visitorId, status),
    );
  }

  Future<void> markVisitorExit(String visitorId) async {
    await updateVisitorStatus(visitorId, 'left');
  }

  Future<void> approveVisitorEntry(String visitorId) async {
    await updateVisitorStatus(visitorId, 'inside');
  }

  Future<Map<String, dynamic>> validateAndProcessQrScan(String qrCode) async {
    final societyId = _societyId;
    if (societyId == null || societyId.isEmpty) {
      return {
        'valid': false,
        'reason': 'error',
        'error': 'Society ID is missing from user profile',
      };
    }
    return await _repository.validateAndProcessQrScan(societyId, qrCode);
  }

  Future<void> logVisitorEntry(VisitorModel visitor) async {
    final societyId = _societyId;
    if (societyId == null || societyId.isEmpty) {
      state = AsyncValue.error(
        Exception('Society ID is missing from user profile'),
        StackTrace.current,
      );
      return;
    }
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => _repository.logVisitorEntry(societyId, visitor),
    );
  }
}
