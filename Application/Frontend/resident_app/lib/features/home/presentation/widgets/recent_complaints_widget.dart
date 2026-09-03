import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';
import '../../../complaint/providers/complaint_providers.dart';

class RecentComplaintsWidget extends ConsumerWidget {
  const RecentComplaintsWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final complaintsAsync = ref.watch(myComplaintsStreamProvider);

    return complaintsAsync.when(
      data: (complaints) {
        if (complaints.isEmpty) {
          return const _EmptyStateSmall(message: 'No active complaints 🛠️');
        }

        final complaint = complaints.first;
        final title = complaint.title;
        final status = complaint.status;
        final category = complaint.category;

        final isResolved = complaint.isResolved;

        return Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.complaint.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: const Icon(Icons.support_agent_rounded,
                    color: AppColors.complaint, size: 22),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '$category • Status: $status',
                      style: const TextStyle(
                          fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              TextButton(
                onPressed: () => context.push('/home/complaints/${complaint.id}'),
                child: Text(
                  isResolved ? 'View' : 'Track',
                  style: const TextStyle(
                      color: AppColors.primary, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        );
      },
      loading: () => AppSkeleton.listItem(avatarSize: 44, height: 72),
      error: (e, st) => const SizedBox.shrink(),
    );
  }
}

class _EmptyStateSmall extends StatelessWidget {
  final String message;
  const _EmptyStateSmall({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Center(
        child: Text(
          message,
          style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
        ),
      ),
    );
  }
}
