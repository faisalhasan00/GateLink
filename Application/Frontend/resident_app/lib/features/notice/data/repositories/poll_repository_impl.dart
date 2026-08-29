import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/poll_model.dart';
import '../../domain/repositories/poll_repository.dart';

class PollRepositoryImpl implements PollRepository {
  final FirebaseFirestore _firestore;

  PollRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  String _sanitizeDocId(String raw) {
    return raw.trim().replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
  }

  @override
  Stream<List<PollModel>> watchPolls(String societyId, {String? userUid, String? flatNumber}) {
    if (societyId.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/polls')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .asyncMap((snapshot) async {
      final polls = <PollModel>[];

      for (final doc in snapshot.docs) {
        final data = doc.data();
        final votingRule = data['votingRule'] as String? ?? 'one_per_flat';
        
        String? votedOptionId;

        // Check if current user / flat has voted
        try {
          String checkKey = '';
          if (votingRule == 'one_per_flat' && flatNumber != null && flatNumber.isNotEmpty) {
            checkKey = _sanitizeDocId(flatNumber);
          } else if (userUid != null && userUid.isNotEmpty) {
            checkKey = userUid;
          }

          if (checkKey.isNotEmpty) {
            final voteDoc = await _firestore
                .collection('societies/$societyId/polls/${doc.id}/votes')
                .doc(checkKey)
                .get();
            if (voteDoc.exists) {
              votedOptionId = voteDoc.data()?['optionId'] as String?;
            }
          }
        } catch (_) {}

        polls.add(PollModel.fromMap(data, defaultId: doc.id, userVotedOptionId: votedOptionId));
      }

      return polls;
    });
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
    if (societyId.isEmpty || pollId.isEmpty || optionId.isEmpty) {
      throw Exception('Invalid voting request parameters.');
    }

    final pollRef = _firestore.doc('societies/$societyId/polls/$pollId');

    return await _firestore.runTransaction<bool>((transaction) async {
      final pollSnapshot = await transaction.get(pollRef);
      if (!pollSnapshot.exists) {
        throw Exception('Poll does not exist or has been removed.');
      }

      final pollData = pollSnapshot.data() as Map<String, dynamic>;
      final poll = PollModel.fromMap(pollData, defaultId: pollSnapshot.id);

      if (!poll.isActive) {
        throw Exception('This poll has closed or expired.');
      }

      if (!poll.canUserVote(userRole)) {
        throw Exception(
          poll.isOwnerOnly
              ? 'This AGM resolution is restricted to Flat Owners only.'
              : 'You are not authorized to vote on this poll.',
        );
      }

      final votingRule = poll.votingRule;
      final voteDocKey = votingRule == 'one_per_flat'
          ? _sanitizeDocId(flatNumber)
          : voterUid;

      final voteRef = _firestore.doc('societies/$societyId/polls/$pollId/votes/$voteDocKey');
      final existingVote = await transaction.get(voteRef);

      if (existingVote.exists) {
        throw Exception(
          votingRule == 'one_per_flat'
              ? 'Flat $flatNumber has already cast a vote for this poll.'
              : 'You have already voted on this poll.',
        );
      }

      // Update options voteCount
      final updatedOptions = poll.options.map((opt) {
        if (opt.id == optionId) {
          return opt.copyWith(voteCount: opt.voteCount + 1);
        }
        return opt;
      }).toList();

      // Record Vote Doc
      final nowIso = DateTime.now().toIso8601String();
      transaction.set(voteRef, {
        'pollId': pollId,
        'optionId': optionId,
        'voterUid': voterUid,
        'voterName': voterName,
        'flatNumber': flatNumber,
        'userRole': userRole,
        'votedAt': nowIso,
        'createdAt': FieldValue.serverTimestamp(),
      });

      // Update Poll Doc
      transaction.update(pollRef, {
        'totalVotes': poll.totalVotes + 1,
        'options': updatedOptions.map((o) => o.toMap()).toList(),
        'updatedAt': FieldValue.serverTimestamp(),
      });

      return true;
    });
  }
}
