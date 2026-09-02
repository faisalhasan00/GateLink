import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/notice/domain/models/poll_model.dart';
import 'package:societysphere/features/notice/domain/repositories/poll_repository.dart';
import 'package:societysphere/features/notice/presentation/controllers/poll_controller.dart';

class MockPollRepository implements PollRepository {
  int castVoteCalls = 0;
  bool shouldFail = false;

  @override
  Stream<List<PollModel>> watchPolls(String societyId, {String? userUid, String? flatNumber}) {
    return Stream.value([
      PollModel(
        id: 'poll-1',
        title: 'AGM Resolution 1',
        description: 'Solar Rooftop Proposal',
        category: 'AGM Resolution',
        allowedRoles: const ['owner'],
        votingRule: 'one_per_flat',
        options: const [
          PollOption(id: 'opt-1', text: 'Yes', voteCount: 10),
          PollOption(id: 'opt-2', text: 'No', voteCount: 2),
        ],
      ),
    ]);
  }

  @override
  Future<bool> castVote({
    required String societyId,
    required String pollId,
    required String optionId,
    required String voterUid,
    required String voterName,
    required String flatNumber,
    required String userRole,
  }) async {
    castVoteCalls++;
    if (shouldFail) throw Exception('Your flat has already voted on this poll.');
    return true;
  }

  @override
  Future<void> seedDemoPolls(String societyId) async {}
}

void main() {
  group('PollController Unit Tests', () {
    late MockPollRepository mockRepo;
    late PollController controller;

    setUp(() {
      mockRepo = MockPollRepository();
      controller = PollController(mockRepo);
    });

    test('initial state is correct', () {
      expect(controller.state.status, PollVoteStatus.initial);
      expect(controller.state.isSubmitting, false);
      expect(controller.state.errorMessage, isNull);
    });

    test('castVote succeeds with valid input', () async {
      final success = await controller.castVote(
        societyId: 'soc-123',
        pollId: 'poll-1',
        optionId: 'opt-1',
        voterUid: 'user-456',
        voterName: 'Test Owner',
        flatNumber: 'A-402',
        userRole: 'owner',
      );

      expect(success, true);
      expect(mockRepo.castVoteCalls, 1);
      expect(controller.state.status, PollVoteStatus.success);
      expect(controller.state.errorMessage, isNull);
    });

    test('castVote sets error state on repository duplicate exception', () async {
      mockRepo.shouldFail = true;

      final success = await controller.castVote(
        societyId: 'soc-123',
        pollId: 'poll-1',
        optionId: 'opt-1',
        voterUid: 'user-456',
        voterName: 'Test Owner',
        flatNumber: 'A-402',
        userRole: 'owner',
      );

      expect(success, false);
      expect(mockRepo.castVoteCalls, 1);
      expect(controller.state.status, PollVoteStatus.error);
      expect(controller.state.errorMessage, contains('already voted'));
    });
  });
}
