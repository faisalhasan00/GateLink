import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class VisitorHistoryItemCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onTap;

  const VisitorHistoryItemCard({
    super.key,
    required this.item,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final name = item['name'] ?? 'Visitor';
    final type = item['type'] ?? 'Guest';
    final hostFlat = item['hostFlat'] ?? 'N/A';
    final residentName = item['hostResidentName'] ?? 'Resident';
    final status = item['status'] ?? 'pending';
    final durationStr = item['durationString'] as String?;
    final createdStr = item['createdDate'] ?? item['createdAt'] ?? '';

    DateTime? createdDt;
    try {
      createdDt = DateTime.parse(createdStr);
    } catch (_) {}

    final formattedDate = createdDt != null
        ? DateFormat('d MMM, hh:mm a').format(createdDt)
        : 'Recent';

    final isInside = status == 'inside';
    final isCheckedOut = status == 'checked_out' || status == 'left';
    final isDenied = status == 'denied' || status == 'rejected';

    return Card(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        side: BorderSide(color: AppColors.border.withValues(alpha: 0.8)),
      ),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: isInside
                    ? AppColors.primary
                    : isCheckedOut
                        ? AppColors.gray400
                        : isDenied
                            ? AppColors.error
                            : AppColors.secondary,
                child: Text(
                  name.isNotEmpty ? name[0].toUpperCase() : 'V',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            name,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: isInside
                                ? AppColors.success.withValues(alpha: 0.15)
                                : isCheckedOut
                                    ? AppColors.gray200
                                    : isDenied
                                        ? AppColors.error.withValues(alpha: 0.15)
                                        : AppColors.warning.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(
                            status.toUpperCase().replaceAll('_', ' '),
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: isInside
                                  ? AppColors.success
                                  : isCheckedOut
                                      ? AppColors.textSecondary
                                      : isDenied
                                          ? AppColors.error
                                          : AppColors.warning,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '$type  •  Flat $hostFlat ($residentName)',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.access_time_rounded, size: 13, color: AppColors.textDisabled),
                        const SizedBox(width: 4),
                        Text(
                          formattedDate,
                          style: const TextStyle(fontSize: 11, color: AppColors.textDisabled),
                        ),
                        if (durationStr != null) ...[
                          const SizedBox(width: 8),
                          const Icon(Icons.timer_outlined, size: 13, color: AppColors.secondary),
                          const SizedBox(width: 3),
                          Text(
                            durationStr,
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.secondary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right_rounded, color: AppColors.gray400),
            ],
          ),
        ),
      ),
    );
  }
}
