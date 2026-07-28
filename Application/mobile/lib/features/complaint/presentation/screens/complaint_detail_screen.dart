import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ComplaintDetailScreen extends StatelessWidget {
  final String complaintId;
  const ComplaintDetailScreen({super.key, required this.complaintId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Complaint Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.infoSurface,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(color: AppColors.info.withOpacity(0.3)),
              ),
              child: Row(children: [
                const Icon(Icons.engineering_rounded, color: AppColors.info, size: 22),
                const SizedBox(width: AppSpacing.sm),
                const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('In Progress', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.info)),
                  Text('Staff assigned and working on it', style: TextStyle(fontSize: 12, color: AppColors.info)),
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
                    Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: AppColors.primarySurface, borderRadius: BorderRadius.circular(AppRadius.full)),
                      child: const Text('Plumbing', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.primary))),
                    const Spacer(),
                    Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: AppColors.errorSurface, borderRadius: BorderRadius.circular(AppRadius.full)),
                      child: const Text('High', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.error))),
                  ]),
                  const SizedBox(height: AppSpacing.sm),
                  const Text('Water leakage in bathroom',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                  const SizedBox(height: AppSpacing.sm),
                  const Text(
                    'There is a continuous water leak from the pipe under the washbasin in the master bathroom. The floor is getting wet and tiles may get damaged.',
                    style: TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.6)),
                  const SizedBox(height: AppSpacing.md),
                  const Divider(height: 0),
                  const SizedBox(height: AppSpacing.md),
                  _InfoRow(icon: Icons.tag_rounded, label: 'Complaint ID', value: '#CMP-00${complaintId}'),
                  _InfoRow(icon: Icons.calendar_today_rounded, label: 'Raised On', value: '20 Jul 2026'),
                  _InfoRow(icon: Icons.person_rounded, label: 'Assigned To', value: 'Suresh Kumar (Plumber)'),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // Timeline
            const Text('Activity Timeline',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            const SizedBox(height: AppSpacing.md),
            _TimelineItem(
              icon: Icons.check_circle_rounded, color: AppColors.success,
              title: 'Complaint Raised', subtitle: '20 Jul 2026, 10:30 AM', isFirst: true),
            _TimelineItem(
              icon: Icons.person_rounded, color: AppColors.primary,
              title: 'Staff Assigned', subtitle: 'Suresh Kumar assigned by Admin — 20 Jul 2026, 11:00 AM'),
            _TimelineItem(
              icon: Icons.engineering_rounded, color: AppColors.info,
              title: 'Work In Progress', subtitle: 'Staff marked as In Progress — 21 Jul 2026, 9:00 AM', isLast: true),

            const SizedBox(height: AppSpacing.xl),
            OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.rate_review_rounded, size: 18),
              label: const Text('Add Comment'),
              style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 48)),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label, value;
  const _InfoRow({required this.icon, required this.label, required this.value});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 6),
    child: Row(children: [
      Icon(icon, size: 14, color: AppColors.textSecondary),
      const SizedBox(width: 8),
      Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
      const Spacer(),
      Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
    ]),
  );
}

class _TimelineItem extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title, subtitle;
  final bool isFirst, isLast;
  const _TimelineItem({required this.icon, required this.color, required this.title, required this.subtitle, this.isFirst = false, this.isLast = false});

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 32,
            child: Column(children: [
              Container(width: 32, height: 32,
                decoration: BoxDecoration(color: color.withOpacity(0.12), shape: BoxShape.circle),
                child: Icon(icon, size: 16, color: color)),
              if (!isLast) Expanded(child: Container(width: 2, color: AppColors.border, margin: const EdgeInsets.symmetric(vertical: 4))),
            ]),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : AppSpacing.md),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4)),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}
