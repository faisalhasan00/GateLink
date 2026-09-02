import '../models/poll_model.dart';

abstract class PollRepository {
  /// Stream of all active and past polls in the society.
  Stream<List<PollModel>> watchPolls(String societyId, {String? userUid, String? flatNumber});

  /// Cast a vote on a specific poll option with duplicate protection.
  Future<bool> castVote({
    required String societyId,
    required String pollId,
    required String optionId,
    required String voterUid,
    required String voterName,
    required String flatNumber,
    required String userRole,
  });

  /// Seed demo AGM / community polls for testing.
  Future<void> seedDemoPolls(String societyId);
}
