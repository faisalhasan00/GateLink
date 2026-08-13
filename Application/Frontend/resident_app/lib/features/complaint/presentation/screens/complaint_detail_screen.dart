import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../domain/models/complaint_model.dart';
import '../providers/complaint_providers.dart';

class ComplaintDetailScreen extends ConsumerWidget {
  final String complaintId;
  const ComplaintDetailScreen({super.key, required this.complaintId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final complaintAsync = ref.watch(complaintDetailStreamProvider(complaintId));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Complaint Details')),
      body: complaintAsync.when(
        data: (complaint) {
          if (complaint == null) {
            return const Center(
              child: Text('Complaint not found or unavailable.',
                  style: TextStyle(color: AppColors.textSecondary)),
            );
          }

          final statusColor = complaint.isResolved
              ? AppColors.success
              : complaint.isInProgress
                  ? AppColors.info
                  : AppColors.warning;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status Banner
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(
                        color: statusColor.withValues(alpha: 0.3)),
                  ),
                  child: Row(children: [
                    Icon(
                      complaint.isResolved
                          ? Icons.check_circle_rounded
                          : Icons.engineering_rounded,
                      color: statusColor,
                      size: 22,
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(complaint.status.toUpperCase(),
                              style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: statusColor)),
                          Text(
                              'Assigned: ${complaint.assignedTo ?? "Unassigned"}',
                              style: TextStyle(
                                  fontSize: 12, color: statusColor)),
                        ]),
                  ]),
                ),
                const SizedBox(height: AppSpacing.md),

                // Complaint Info
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primarySurface,
                            borderRadius:
                                BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(complaint.category,
                              style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.primary)),
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.warning.withValues(alpha: 0.1),
                            borderRadius:
                                BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(
                            'Priority: ${complaint.priority.toUpperCase()}',
                            style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppColors.warning),
                          ),
                        ),
                      ]),
                      const SizedBox(height: AppSpacing.md),
                      Text(complaint.title,
                          style: const TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: AppSpacing.xs),
                      Text(complaint.ticketNumber,
                          style: const TextStyle(
                              fontSize: 12, color: AppColors.textSecondary)),
                      const Divider(height: AppSpacing.lg),
                      const Text('Description',
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textSecondary)),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        complaint.description.isNotEmpty
                            ? complaint.description
                            : 'No description provided.',
                        style: const TextStyle(
                            fontSize: 14, color: AppColors.textPrimary),
                      ),
                      if (complaint.photoUrl != null &&
                          complaint.photoUrl!.isNotEmpty) ...[
                        const SizedBox(height: AppSpacing.lg),
                        const Text('Attached Photo Proof',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textSecondary)),
                        const SizedBox(height: AppSpacing.xs),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          child: Image.network(
                            complaint.photoUrl!,
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              height: 120,
                              color: AppColors.gray100,
                              child: const Center(
                                  child: Icon(Icons.broken_image_rounded,
                                      color: AppColors.textDisabled)),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
