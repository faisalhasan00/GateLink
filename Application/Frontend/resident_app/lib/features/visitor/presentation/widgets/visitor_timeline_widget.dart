import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/visitor_model.dart';

class VisitorTimelineWidget extends StatelessWidget {
  final VisitorModel visitor;

  const VisitorTimelineWidget({super.key, required this.visitor});

  @override
  Widget build(BuildContext context) {
    final createdDate = visitor.createdDate ?? '';
    final approvedAt = visitor.approvedAt;
    final rejectedAt = visitor.rejectedAt;
    final entryTime = visitor.entryTime;
    final exitTime = visitor.exitTime;

    return Container(
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
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          _TimelineStep(
            title: 'Visitor Request Logged',
            time: createdDate.isNotEmpty ? createdDate : 'System Recorded',
            isDone: true,
            isCurrent: visitor.isPending,
          ),
          _TimelineStep(
            title: visitor.isRejected
                ? 'Resident Rejected Entry'
                : 'Resident Approved Entry',
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
                  fontWeight:
                      isDone || isCurrent ? FontWeight.w700 : FontWeight.w500,
                  color: isDone || isCurrent
                      ? AppColors.textPrimary
                      : AppColors.textSecondary,
                ),
              ),
              Text(
                time,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ],
    );
  }
}
