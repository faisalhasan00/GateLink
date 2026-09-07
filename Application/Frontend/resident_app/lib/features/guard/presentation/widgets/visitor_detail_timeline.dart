import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/domain/models/visitor_model.dart';

class VisitorDetailTimeline extends StatelessWidget {
  final VisitorModel visitor;

  const VisitorDetailTimeline({
    super.key,
    required this.visitor,
  });

  @override
  Widget build(BuildContext context) {
    final residentName = visitor.hostResidentName ?? 'Resident';
    final hostFlat = visitor.hostFlat;
    final status = visitor.status.toFirestore();
    final gateName = visitor.gateName ?? 'Gate 1 — Main Entry';
    final createdDate = visitor.createdDate ?? '';
    final entryTime = visitor.entryTime;
    final exitTime = visitor.exitTime;
    final isInside = visitor.isInside;
    final isApproved = visitor.isApproved;
    final isRejected = visitor.isRejected;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.timeline_rounded, size: 18, color: AppColors.secondary),
              SizedBox(width: 8),
              Text(
                'ACTIVITY TIMELINE',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textSecondary,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
          const Divider(height: 20),
          _TimelineStep(
            title: 'Visitor Entry Logged',
            subtitle: 'Logged at $gateName by Security Guard',
            timestamp: createdDate.isEmpty ? 'Just now' : createdDate,
            icon: Icons.note_add_rounded,
            color: AppColors.secondary,
            isFirst: true,
          ),
          _TimelineStep(
            title: 'Resident Notification Sent',
            subtitle: 'Sent to $residentName ($hostFlat)',
            timestamp: createdDate.isEmpty ? 'Just now' : createdDate,
            icon: Icons.notifications_active_rounded,
            color: AppColors.info,
          ),
          if (isApproved || isInside || status == 'checked_out')
            _TimelineStep(
              title: 'Resident Approved Request',
              subtitle: 'Approved by $residentName',
              timestamp: visitor.approvedAt ?? 'Approved',
              icon: Icons.check_circle_rounded,
              color: AppColors.success,
            )
          else if (isRejected)
            _TimelineStep(
              title: 'Resident Denied Entry',
              subtitle: 'Entry request rejected by $residentName',
              timestamp: visitor.rejectedAt ?? 'Denied',
              icon: Icons.cancel_rounded,
              color: AppColors.error,
            ),
          if (entryTime != null)
            _TimelineStep(
              title: 'Visitor Checked In',
              subtitle: 'Gate entry allowed',
              timestamp: entryTime,
              icon: Icons.meeting_room_rounded,
              color: AppColors.primary,
            ),
          if (exitTime != null)
            _TimelineStep(
              title: 'Visitor Checked Out',
              subtitle:
                  'Visit Duration: ${visitor.durationString ?? "Checked Out"}',
              timestamp: exitTime,
              icon: Icons.exit_to_app_rounded,
              color: AppColors.textSecondary,
              isLast: true,
            ),
        ],
      ),
    );
  }
}

class _TimelineStep extends StatelessWidget {
  final String title;
  final String subtitle;
  final String timestamp;
  final IconData icon;
  final Color color;
  final bool isFirst;
  final bool isLast;

  const _TimelineStep({
    required this.title,
    required this.subtitle,
    required this.timestamp,
    required this.icon,
    required this.color,
    this.isFirst = false,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: color.withValues(alpha: 0.15),
                child: Icon(icon, size: 14, color: color),
              ),
              if (!isLast)
                Container(
                  width: 2,
                  height: 32,
                  color: AppColors.gray200,
                ),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      timestamp,
                      style: const TextStyle(
                        fontSize: 10,
                        color: AppColors.textDisabled,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
