import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class VisitorHistoryLogCard extends StatelessWidget {
  final Map<String, dynamic> data;
  final VoidCallback onTap;

  const VisitorHistoryLogCard({
    super.key,
    required this.data,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final name = data['name'] as String? ?? 'Visitor';
    final type = data['type'] as String? ?? 'Guest';
    final hostFlat = data['hostFlat'] as String? ?? 'N/A';
    final vehicleNumber = data['vehicleNumber'] as String? ?? '';
    final status = (data['status'] as String? ?? 'pending').toLowerCase();
    final photoUrl = data['photoUrl'] as String?;

    DateTime entryTime = DateTime.now();
    if (data['createdAt'] != null) {
      entryTime = (data['createdAt'] as dynamic).toDate();
    } else if (data['entryTime'] != null) {
      entryTime = (data['entryTime'] as dynamic).toDate();
    }

    Color statusColor = AppColors.warning;
    String statusLabel = 'PENDING';
    if (status == 'inside') {
      statusColor = AppColors.success;
      statusLabel = 'INSIDE';
    } else if (status == 'approved') {
      statusColor = AppColors.primary;
      statusLabel = 'APPROVED';
    } else if (status == 'denied' || status == 'rejected') {
      statusColor = AppColors.error;
      statusLabel = 'DENIED';
    } else if (status == 'checked_out' || status == 'exited') {
      statusColor = Colors.grey;
      statusLabel = 'CHECKED OUT';
    }

    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        side: BorderSide(color: AppColors.border),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            children: [
              // Photo Avatar
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  image: photoUrl != null && photoUrl.isNotEmpty
                      ? DecorationImage(
                          image: NetworkImage(photoUrl),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: photoUrl == null || photoUrl.isEmpty
                    ? Center(
                        child: Text(
                          name.isNotEmpty ? name[0].toUpperCase() : 'V',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      )
                    : null,
              ),
              const SizedBox(width: AppSpacing.md),

              // Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: statusColor.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                            border: Border.all(color: statusColor.withValues(alpha: 0.5)),
                          ),
                          child: Text(
                            statusLabel,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: statusColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Flat: $hostFlat • $type',
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        if (vehicleNumber.isNotEmpty) ...[
                          const Icon(Icons.directions_car_rounded, size: 13, color: AppColors.textSecondary),
                          const SizedBox(width: 3),
                          Text(
                            vehicleNumber,
                            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                          ),
                          const SizedBox(width: 8),
                        ],
                        const Icon(Icons.access_time_rounded, size: 13, color: AppColors.textSecondary),
                        const SizedBox(width: 3),
                        Text(
                          DateFormat('hh:mm a, dd MMM').format(entryTime),
                          style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
