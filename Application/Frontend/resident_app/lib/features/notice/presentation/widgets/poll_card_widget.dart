import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/poll_model.dart';
import '../controllers/poll_controller.dart';

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
      final errorMsg = ref.read(pollControllerProvider).errorMessage ?? 'Failed to submit vote.';
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
    final isThisPollSubmitting = voteState.isSubmitting && voteState.votingPollId == poll.id;
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
            // Top Badges Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Category Chip
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: catColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    poll.category.toUpperCase(),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: catColor,
                      letterSpacing: 0.4,
                    ),
                  ),
                ),

                // Status / Expiry Badge
                Row(
                  children: [
                    if (poll.isOwnerOnly) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        margin: const EdgeInsets.only(right: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.lock_outline_rounded, size: 12, color: Color(0xFFB45309)),
                            SizedBox(width: 3),
                            Text(
                              'OWNER ONLY',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFFB45309),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: poll.isActive ? const Color(0xFFECFDF5) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        poll.isActive ? '🟢 ACTIVE' : '⚪ CLOSED',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: poll.isActive ? const Color(0xFF059669) : const Color(0xFF64748B),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),

            // Poll Title
            Text(
              poll.title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                height: 1.3,
              ),
            ),
            if (poll.description.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                poll.description,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF64748B),
                  height: 1.4,
                ),
              ),
            ],
            const SizedBox(height: AppSpacing.md),

            // Options Section
            if (showResults) ...[
              // Results Visualizer Mode
              ...poll.options.map((opt) {
                final percentage = poll.totalVotes > 0
                    ? ((opt.voteCount / poll.totalVotes) * 100).round()
                    : 0;
                final isUserVote = poll.userVotedOptionId == opt.id;

                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isUserVote ? const Color(0xFFEFF6FF) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isUserVote ? const Color(0xFF3B82F6) : const Color(0xFFE2E8F0),
                      width: isUserVote ? 1.5 : 1,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                if (isUserVote)
                                  const Padding(
                                    padding: EdgeInsets.only(right: 6),
                                    child: Icon(Icons.check_circle_rounded,
                                        size: 16, color: Color(0xFF2563EB)),
                                  ),
                                Expanded(
                                  child: Text(
                                    opt.text,
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: isUserVote ? FontWeight.w800 : FontWeight.w600,
                                      color: isUserVote ? const Color(0xFF1D4ED8) : const Color(0xFF1E293B),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            '$percentage% (${opt.voteCount})',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: isUserVote ? const Color(0xFF1D4ED8) : const Color(0xFF475569),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: LinearProgressIndicator(
                          value: poll.totalVotes > 0 ? opt.voteCount / poll.totalVotes : 0.0,
                          backgroundColor: const Color(0xFFE2E8F0),
                          valueColor: AlwaysStoppedAnimation<Color>(
                            isUserVote ? const Color(0xFF2563EB) : const Color(0xFF94A3B8),
                          ),
                          minHeight: 8,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ] else ...[
              // Interactive Radio Voting Mode
              ...poll.options.map((opt) {
                final isSelected = _selectedOptionId == opt.id;

                return GestureDetector(
                  onTap: () {
                    if (canVote) {
                      setState(() => _selectedOptionId = opt.id);
                    }
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFEFF6FF) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFCBD5E1),
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                          color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFF94A3B8),
                          size: 20,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            opt.text,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                              color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFF1E293B),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ],

            const SizedBox(height: AppSpacing.sm),

            // Bottom Footer Row (Vote Button or Voted Info)
            if (!showResults && canVote) ...[
              SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton(
                  onPressed: isThisPollSubmitting ? null : _handleVote,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E3A8A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: isThisPollSubmitting
                      ? const SizedBox(
                          height: 18,
                          width: 18,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text(
                          'Cast Vote',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                        ),
                ),
              ),
              const SizedBox(height: 8),
            ] else if (!showResults && !canVote) ...[
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline_rounded, size: 16, color: Color(0xFFDC2626)),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        poll.isOwnerOnly
                            ? 'Voting is restricted to verified Flat Owners.'
                            : 'You cannot participate in this poll.',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF991B1B), fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
            ],

            // Vote Metadata Footer
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${poll.totalVotes} Vote${poll.totalVotes == 1 ? '' : 's'} cast • ${poll.votingRule == 'one_per_flat' ? '1 vote/flat' : '1 vote/resident'}',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                ),
                if (expiryText.isNotEmpty)
                  Text(
                    expiryText,
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
