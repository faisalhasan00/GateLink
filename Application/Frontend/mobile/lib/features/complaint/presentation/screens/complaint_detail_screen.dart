import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';

class ComplaintDetailScreen extends ConsumerWidget {
  final String complaintId;
  const ComplaintDetailScreen({super.key, required this.complaintId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final firestoreService = ref.watch(firestoreServiceProvider);

    if (firestoreService == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Complaint Details')),
        body: const Center(child: Text('Service unavailable')),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Complaint Details')),
      body: StreamBuilder(
        stream: firestoreService.complaintDetailStream(complaintId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError || !snapshot.hasData || !snapshot.data!.exists) {
            return const Center(child: Text('Complaint not found or unavailable.'));
          }

          final data = snapshot.data!.data() as Map<String, dynamic>;
          final title = data['title'] ?? 'Complaint';
          final description = data['description'] ?? 'No description provided.';
          final category = data['category'] ?? 'General';
          final priority = (data['priority'] ?? 'medium').toString();
          final status = (data['status'] ?? 'Open').toString();
          final ticketNum = data['ticketNumber'] ?? '#CMP-$complaintId';
          final assignedTo = data['assignedTo'] ?? 'Unassigned';
          final photoUrl = data['photoUrl'] as String?;
          final createdAtRaw = data['createdAt'] ?? '';

          final isResolved = status.toLowerCase() == 'resolved';
          final isInProgress = status.toLowerCase() == 'in progress' || status.toLowerCase() == 'assigned';

          final statusColor = isResolved
              ? AppColors.success
              : isInProgress
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
                    border: Border.all(color: statusColor.withValues(alpha: 0.3)),
                  ),
                  child: Row(children: [
                    Icon(
                      isResolved ? Icons.check_circle_rounded : Icons.engineering_rounded,
                      color: statusColor,
                      size: 22,
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(status.toUpperCase(), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: statusColor)),
                      Text('Assigned: $assignedTo', style: TextStyle(fontSize: 12, color: statusColor)),
                    ]),
                  ]),
                ),
                const SizedBox(height: AppSpacing.md),

                // Complaint Info
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(AppRadius.lg), border: Border.all(color: AppColors.border)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: AppColors.primarySurface, borderRadius: BorderRadius.circular(AppRadius.full)),
                          child: Text(category, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primary)),
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: AppColors.errorSurface, borderRadius: BorderRadius.circular(AppRadius.full)),
                          child: Text(priority.toUpperCase(), style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.error)),
                        ),
                      ]),
                      const SizedBox(height: AppSpacing.sm),
                      Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                      const SizedBox(height: AppSpacing.sm),
                      Text(description, style: const TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.6)),
                      
                      if (photoUrl != null && photoUrl.isNotEmpty) ...[
                        const SizedBox(height: AppSpacing.md),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          child: Image.network(
                            photoUrl,
                            height: 180,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const Icon(Icons.image_not_supported_rounded, size: 48),
                          ),
                        ),
                      ],

                      const SizedBox(height: AppSpacing.md),
                      const Divider(height: 0),
                      const SizedBox(height: AppSpacing.md),
                      _InfoRow(icon: Icons.tag_rounded, label: 'Ticket ID', value: ticketNum),
                      _InfoRow(icon: Icons.calendar_today_rounded, label: 'Raised On', value: createdAtRaw.length >= 10 ? createdAtRaw.substring(0, 10) : createdAtRaw),
                      _InfoRow(icon: Icons.person_rounded, label: 'Assigned Staff', value: assignedTo),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // Timeline
                const Text('Activity Timeline', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                const SizedBox(height: AppSpacing.md),
                const _TimelineItem(
                  icon: Icons.check_circle_rounded, color: AppColors.success,
                  title: 'Complaint Raised', subtitle: 'Ticket logged successfully', isFirst: true),
                _TimelineItem(
                  icon: Icons.person_rounded, color: AppColors.primary,
                  title: 'Staff Assignment', subtitle: assignedTo == 'Unassigned' ? 'Awaiting staff allocation by Admin' : 'Assigned to $assignedTo'),
                _TimelineItem(
                  icon: isResolved ? Icons.verified_rounded : Icons.engineering_rounded,
                  color: isResolved ? AppColors.success : AppColors.info,
                  title: isResolved ? 'Resolution Complete' : 'Work Status',
                  subtitle: isResolved ? 'Complaint marked resolved by Maintenance' : 'In Progress',
                  isLast: true,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label, value;
  const _InfoRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(children: [
        Icon(icon, size: 16, color: AppColors.textSecondary),
        const SizedBox(width: 8),
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        const Spacer(),
        Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
      ]),
    );
  }
}

class _TimelineItem extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title, subtitle;
  final bool isFirst, isLast;

  const _TimelineItem({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    this.isFirst = false,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            CircleAvatar(radius: 14, backgroundColor: color.withValues(alpha: 0.1), child: Icon(icon, size: 16, color: color)),
            if (!isLast) Container(width: 2, height: 24, color: AppColors.border),
          ],
        ),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ],
    );
  }
}
