import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/poll_repository.dart';
import '../../providers/poll_providers.dart';

enum PollVoteStatus { initial, loading, success, error }

class PollVoteState {
  final PollVoteStatus status;
  final String? errorMessage;
  final String? votingPollId;

  const PollVoteState({
    this.status = PollVoteStatus.initial,
    this.errorMessage,
    this.votingPollId,
  });

  bool get isSubmitting => status == PollVoteStatus.loading;

  PollVoteState copyWith({
    PollVoteStatus? status,
    String? errorMessage,
    String? votingPollId,
  }) {
    return PollVoteState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      votingPollId: votingPollId,
    );
  }
}

class PollController extends StateNotifier<PollVoteState> {
  final PollRepository _repository;

  PollController(this._repository) : super(const PollVoteState());

  Future<bool> castVote({
    required String societyId,
    required String pollId,
    required String optionId,
    required String voterUid,
    required String voterName,
    required String flatNumber,
    required String userRole,
  }) async {
    if (state.isSubmitting) return false;

    state = state.copyWith(
      status: PollVoteStatus.loading,
      votingPollId: pollId,
    );

    try {
      final success = await _repository.castVote(
        societyId: societyId,
        pollId: pollId,
        optionId: optionId,
        voterUid: voterUid,
        voterName: voterName,
        flatNumber: flatNumber,
        userRole: userRole,
      );

      state = state.copyWith(
        status: PollVoteStatus.success,
        votingPollId: null,
      );
      return success;
    } catch (e) {
      final msg = e.toString().replaceAll('Exception:', '').trim();
      state = state.copyWith(
        status: PollVoteStatus.error,
        errorMessage: msg,
        votingPollId: null,
      );
      return false;
    }
  }

  void resetStatus() {
    state = const PollVoteState();
  }
}

final pollControllerProvider =
    StateNotifierProvider<PollController, PollVoteState>((ref) {
  final repository = ref.watch(pollRepositoryProvider);
  return PollController(repository);
});
