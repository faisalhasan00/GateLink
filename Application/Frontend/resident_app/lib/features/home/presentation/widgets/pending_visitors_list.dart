import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/providers/visitor_providers.dart';

class PendingVisitorsList extends ConsumerWidget {
  const PendingVisitorsList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visitorsAsync = ref.watch(pendingVisitorsForFlatStreamProvider);

    return visitorsAsync.when(
      data: (visitorsList) {
        final pendingVisitors = visitorsList.where((v) => v.isPending).take(3).toList();

        if (pendingVisitors.isEmpty) {
          return const _EmptyStateSmall(message: 'No pending visitor approvals 👋');
        }

        return Column(
          children: pendingVisitors.map((visitor) {
            final name = visitor.name;
            final purpose = visitor.type;

            String timeStr = 'Just now';
            if (visitor.entryTime != null) {
              try {
                final dt = DateTime.parse(visitor.entryTime!);
                timeStr = DateFormat('h:mm a').format(dt);
              } catch (_) {}
            }

            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: _VisitorCard(
                visitor: _VisitorPreview(
                  id: visitor.id,
                  name: name,
                  purpose: purpose,
                  time: timeStr,
                  initials: visitor.initials,
                ),
              ),
            );
          }).toList(),
        );
      },
      loading: () => const _SkeletonCardList(),
      error: (e, st) => const _EmptyStateSmall(message: 'Unable to load visitor logs'),
    );
  }
}

class _VisitorCard extends ConsumerWidget {
  final _VisitorPreview visitor;
  const _VisitorCard({required this.visitor});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AppColors.visitor.withOpacity(0.1),
            child: Text(
              visitor.initials,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.visitor),
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(visitor.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                Text(visitor.purpose, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                Text(visitor.time, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
          Row(
            children: [
              _ApproveButton(
                label: 'Approve',
                color: AppColors.success,
                onTap: () async {
                  final user = ref.read(currentUserProvider);
                  if (user != null) {
                    await ref.read(visitorControllerProvider.notifier).updateVisitorApproval(
                      visitorId: visitor.id,
                      status: 'approved',
                      residentUid: user.uid,
                    );
                  }
                },
              ),
              const SizedBox(width: 8),
              _ApproveButton(
                label: 'Deny',
                color: AppColors.error,
                onTap: () async {
                  final user = ref.read(currentUserProvider);
                  if (user != null) {
                    await ref.read(visitorControllerProvider.notifier).updateVisitorApproval(
                      visitorId: visitor.id,
                      status: 'denied',
                      residentUid: user.uid,
                    );
                  }
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ApproveButton extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _ApproveButton({required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        child: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
      ),
    );
  }
}

class _VisitorPreview {
  final String id, name, purpose, time, initials;
  const _VisitorPreview({required this.id, required this.name, required this.purpose, required this.time, required this.initials});
}

class _EmptyStateSmall extends StatelessWidget {
  final String message;
  const _EmptyStateSmall({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Center(
        child: Text(message, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w500)),
      ),
    );
  }
}

class _SkeletonCardList extends StatelessWidget {
  const _SkeletonCardList();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
    );
  }
}
