import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/poll_model.dart';
import '../controllers/poll_controller.dart';
import 'poll_card_footer.dart';
import 'poll_card_header.dart';
import 'poll_interactive_voting.dart';
import 'poll_results_visualizer.dart';

class PollCardWidget extends ConsumerStatefulWidget {
  final PollModel poll;

  const PollCardWidget({
    super.key,
    required this.poll,
  });

  @override
  ConsumerState<PollCardWidget> createState() => _PollCardWidgetState();
}

class _PollCardWidgetState extends ConsumerState<PollCardWidget> {
  String? _selectedOptionId;

  Color _getCategoryColor(String cat) {
    switch (cat) {
      case 'AGM Resolution':
        return const Color(0xFF8B5CF6);
      case 'Facility Upgrade':
        return const Color(0xFF0EA5E9);
      case 'Society Rule':
        return const Color(0xFFF59E0B);
      default:
        return const Color(0xFF10B981);
    }
  }

  Future<void> _handleVote() async {
    if (_selectedOptionId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select an option to cast your vote.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final user = ref.read(currentUserProvider);
    final profile = ref.read(userProfileProvider).value;

    if (user == null || profile == null || profile.societyId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You must be logged in with an active profile to vote.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final societyId = profile.societyId;
    final controller = ref.read(pollControllerProvider.notifier);
    final success = await controller.castVote(
      societyId: societyId,
      pollId: widget.poll.id,
      optionId: _selectedOptionId!,
      voterUid: user.uid,
      voterName: profile.name.isNotEmpty ? profile.name : 'Resident',
      flatNumber: profile.displayFlatNumber,
      userRole: profile.role,
    );

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎉 Your vote has been recorded successfully!'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      final errorMsg =
          ref.read(pollControllerProvider).errorMessage ?? 'Failed to submit vote.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMsg),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final poll = widget.poll;
    final voteState = ref.watch(pollControllerProvider);
    final isThisPollSubmitting =
        voteState.isSubmitting && voteState.votingPollId == poll.id;
    final profile = ref.watch(userProfileProvider).value;
    final userRole = profile?.role ?? 'resident';
    final canVote = poll.canUserVote(userRole);
    final hasVoted = poll.hasVoted;
    final showResults = hasVoted || poll.isExpired;

    final catColor = _getCategoryColor(poll.category);

    String expiryText = '';
    if (poll.expiresAt != null && poll.expiresAt!.isNotEmpty) {
      try {
        final exp = DateTime.parse(poll.expiresAt!);
        final diff = exp.difference(DateTime.now());
        if (diff.isNegative) {
          expiryText = 'Closed on ${DateFormat('dd MMM yyyy').format(exp)}';
        } else if (diff.inDays > 0) {
          expiryText = 'Closes in ${diff.inDays} day${diff.inDays > 1 ? 's' : ''}';
        } else {
          expiryText = 'Closes in ${diff.inHours} hours';
        }
      } catch (_) {}
    }

    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: hasVoted ? const Color(0xFFBFDBFE) : const Color(0xFFE2E8F0),
          width: hasVoted ? 1.5 : 1,
        ),
      ),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            PollCardHeader(
              poll: poll,
              categoryColor: catColor,
            ),
            const SizedBox(height: AppSpacing.md),
            if (showResults)
              PollResultsVisualizer(poll: poll)
            else
              PollInteractiveVoting(
                poll: poll,
                selectedOptionId: _selectedOptionId,
                canVote: canVote,
                onOptionSelected: (optId) =>
                    setState(() => _selectedOptionId = optId),
              ),
            PollCardFooter(
              poll: poll,
              showResults: showResults,
              canVote: canVote,
              isSubmitting: isThisPollSubmitting,
              expiryText: expiryText,
              onVote: _handleVote,
            ),
          ],
        ),
      ),
    );
  }
}
