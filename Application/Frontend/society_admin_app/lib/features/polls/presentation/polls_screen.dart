import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/facility_models.dart';

class PollsScreen extends ConsumerWidget {
  const PollsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);
    final pollsAsync = ref.watch(pollsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Community Polls & Voting'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryNavy,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.poll_outlined),
        label: const Text('New Poll'),
        onPressed: () {
          if (society != null) _showCreatePollModal(context, ref, society.id);
        },
      ),
      body: pollsAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading active society polls...'),
        error: (err, _) => ErrorStateWidget(message: err.toString()),
        data: (polls) {
          if (polls.isEmpty) {
            return EmptyStateWidget(
              title: 'No Active Polls',
              description: 'Create voting polls for AGM decisions, festivals, and rules.',
              icon: Icons.how_to_vote_outlined,
              actionLabel: 'Create Poll',
              onAction: () {
                if (society != null) _showCreatePollModal(context, ref, society.id);
              },
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: polls.length,
            separatorBuilder: (_, __) => const SizedBox(height: 14),
            itemBuilder: (context, index) {
              final poll = polls[index];
              final totalVotes = poll.totalVotes > 0 ? poll.totalVotes : 1;

              return AppCard(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        AppBadge(
                          label: poll.isClosed ? 'CLOSED' : 'VOTING LIVE',
                          variant: poll.isClosed ? BadgeVariant.neutral : BadgeVariant.success,
                        ),
                        if (!poll.isClosed)
                          TextButton(
                            onPressed: () async {
                              if (society != null) {
                                await ref.read(firestoreServiceProvider).closePoll(society.id, poll.id);
                              }
                            },
                            child: const Text('Close Poll', style: TextStyle(color: AppColors.dangerCrimson, fontSize: 13)),
                          ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      poll.question,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 14),
                    ...poll.options.map((opt) {
                      final count = poll.votes[opt] ?? 0;
                      final pct = (count / totalVotes);

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(opt, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                                Text('$count votes (${(pct * 100).toStringAsFixed(0)}%)', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: pct,
                                minHeight: 8,
                                backgroundColor: AppColors.cardBorder,
                                valueColor: const AlwaysStoppedAnimation<Color>(AppColors.secondarySky),
                              ),
                            ),
                          ],
                        ),
                      );
                    }),
                    const SizedBox(height: 8),
                    Text(
                      'Total Votes: ${poll.totalVotes} • Published by ${poll.createdBy}',
                      style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _showCreatePollModal(BuildContext context, WidgetRef ref, String societyId) {
    final questionCtrl = TextEditingController();
    final opt1Ctrl = TextEditingController();
    final opt2Ctrl = TextEditingController();
    final opt3Ctrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Create Community Poll', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                const SizedBox(height: 16),
                AppTextField(controller: questionCtrl, label: 'Poll Question', hintText: 'e.g. Should we install EV charging stations?'),
                const SizedBox(height: 12),
                AppTextField(controller: opt1Ctrl, label: 'Option 1', hintText: 'Yes, Absolutely'),
                const SizedBox(height: 10),
                AppTextField(controller: opt2Ctrl, label: 'Option 2', hintText: 'No, Not now'),
                const SizedBox(height: 10),
                AppTextField(controller: opt3Ctrl, label: 'Option 3 (Optional)', hintText: 'Need more information'),
                const SizedBox(height: 20),
                AppButton(
                  label: 'Launch Poll',
                  width: double.infinity,
                  onPressed: () async {
                    if (questionCtrl.text.trim().isEmpty || opt1Ctrl.text.trim().isEmpty || opt2Ctrl.text.trim().isEmpty) return;
                    final options = [opt1Ctrl.text.trim(), opt2Ctrl.text.trim()];
                    if (opt3Ctrl.text.trim().isNotEmpty) options.add(opt3Ctrl.text.trim());

                    final poll = PollModel(
                      id: '',
                      question: questionCtrl.text.trim(),
                      options: options,
                      votes: {for (var o in options) o: 0},
                      totalVotes: 0,
                    );
                    await ref.read(firestoreServiceProvider).createPoll(societyId, poll);
                    if (ctx.mounted) Navigator.of(ctx).pop();
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
