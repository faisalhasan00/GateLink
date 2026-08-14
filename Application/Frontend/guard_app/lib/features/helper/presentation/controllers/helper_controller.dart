import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/helper_model.dart';
import '../../domain/repositories/helper_repository.dart';
import '../../providers/helper_providers.dart';

final helperControllerProvider =
    StateNotifierProvider<HelperController, AsyncValue<void>>((ref) {
  final repository = ref.watch(helperRepositoryProvider);
  return HelperController(repository, ref);
});

class HelperController extends StateNotifier<AsyncValue<void>> {
  final HelperRepository _repository;
  final Ref _ref;

  HelperController(this._repository, this._ref) : super(const AsyncValue.data(null));

  String? get _societyId {
    final profile = _ref.read(userProfileProvider).value;
    return profile?['societyId'] as String?;
  }

  Future<void> registerHelper(HelperModel helper) async {
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
      () => _repository.registerHelper(societyId, helper),
    );
  }

  Future<void> logHelperEntryExit(HelperLogModel log) async {
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
      () => _repository.logHelperEntryExit(societyId, log),
    );
  }
}
