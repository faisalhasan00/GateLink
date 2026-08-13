import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';

class VisitorDetailScreen extends ConsumerWidget {
  final String visitorId;
  const VisitorDetailScreen({super.key, required this.visitorId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visitorsAsync = ref.watch(visitorsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Visitor Details'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        surfaceTintColor: Colors.white,
      ),
      body: visitorsAsync.when(
        data: (visitors) {
          final matchingVisitors = visitors.where((v) => v.id == visitorId).toList();
          if (matchingVisitors.isEmpty) {
            return const Center(
              child: Text('Visitor details not found or removed.', style: TextStyle(color: AppColors.textSecondary)),
            );
          }

          final visitor = matchingVisitors.first;
          final name = visitor.name;
          final phone = visitor.phone;
          final type = visitor.type;
          final hostFlat = visitor.hostFlat;
          final vehicleNumber = visitor.vehicleNumber ?? 'None';
          final company = visitor.company ?? '';
          final createdDate = visitor.createdDate ?? '';
          final approvedAt = visitor.approvedAt;
          final rejectedAt = visitor.rejectedAt;
          final entryTime = visitor.entryTime;
          final exitTime = visitor.exitTime;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              children: [
                // Visitor Header Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: visitor.isRejected
                          ? [AppColors.error, const Color(0xFF991B1B)]
                          : visitor.isApproved
                              ? [AppColors.success, const Color(0xFF047857)]
                              : [AppColors.visitor, const Color(0xFF059669)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(AppRadius.xl),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            visitor.initials,
                            style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        name,
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                      if (company.isNotEmpty) ...[
                        const SizedBox(height: 2),
                        Text(company, style: const TextStyle(fontSize: 13, color: Colors.white70)),
                      ],
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                        child: Text(
                          visitor.status.displayName.toUpperCase(),
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // Details Card
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.xl),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    children: [
                      _InfoRow(icon: Icons.phone_rounded, label: 'Mobile', value: phone, color: AppColors.success),
                      const Divider(height: 1, indent: 56),
                      _InfoRow(icon: Icons.category_rounded, label: 'Entry Type', value: type, color: AppColors.amenity),
                      const Divider(height: 1, indent: 56),
                      _InfoRow(icon: Icons.directions_car_rounded, label: 'Vehicle Number', value: vehicleNumber, color: AppColors.warning),
                      const Divider(height: 1, indent: 56),
                      _InfoRow(icon: Icons.door_front_door_rounded, label: 'Visiting Flat', value: hostFlat, color: AppColors.visitor),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // Timeline Visualization
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.xl),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Audit & Visit Timeline',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      _TimelineStep(
                        title: 'Visitor Request Logged',
                        time: createdDate.isNotEmpty ? createdDate : 'System Recorded',
                        isDone: true,
                        isCurrent: visitor.isPending,
                      ),
                      _TimelineStep(
                        title: visitor.isRejected ? 'Resident Rejected Entry' : 'Resident Approved Entry',
                        time: approvedAt ?? rejectedAt ?? 'Pending Resident Action',
                        isDone: approvedAt != null || rejectedAt != null,
                        isCurrent: false,
                        isError: visitor.isRejected,
                      ),
                      _TimelineStep(
                        title: 'Gate Check-In',
                        time: entryTime ?? 'Awaiting Gate Entry',
                        isDone: entryTime != null,
                        isCurrent: visitor.isInside,
                      ),
                      _TimelineStep(
                        title: 'Gate Check-Out',
                        time: exitTime ?? 'Awaiting Gate Exit',
                        isDone: exitTime != null,
                        isCurrent: visitor.isCheckedOut,
                        isLast: true,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // QR Pass Card
                if (visitor.isApproved || visitor.isExpected) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(AppRadius.xl),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'Digital Gate Pass',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        QrImageView(
                          data: 'SOCIETY_SPHERE_PASS_$visitorId',
                          version: QrVersions.auto,
                          size: 160.0,
                          backgroundColor: Colors.white,
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          'PASS-$visitorId',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                        ),
                      ],
                    ),
                  ),
                ],
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

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _InfoRow({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
            child: Icon(icon, size: 18, color: color),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            ],
          ),
        ],
      ),
    );
  }
}

class _TimelineStep extends StatelessWidget {
  final String title;
  final String time;
  final bool isDone;
  final bool isCurrent;
  final bool isError;
  final bool isLast;

  const _TimelineStep({
    required this.title,
    required this.time,
    this.isDone = false,
    this.isCurrent = false,
    this.isError = false,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    final color = isError
        ? AppColors.error
        : isDone
            ? AppColors.success
            : isCurrent
                ? AppColors.warning
                : AppColors.textDisabled;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 16,
              height: 16,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 32,
                color: isDone ? AppColors.success : AppColors.gray200,
              ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: isDone || isCurrent ? FontWeight.w700 : FontWeight.w500,
                  color: isDone || isCurrent ? AppColors.textPrimary : AppColors.textSecondary,
                ),
              ),
              Text(
                time,
                style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ],
    );
  }
}
