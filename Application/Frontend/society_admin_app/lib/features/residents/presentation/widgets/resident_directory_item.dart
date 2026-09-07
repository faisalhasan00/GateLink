import 'package:flutter/material.dart';
import '../../../../core/models/resident_model.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_card.dart';

class ResidentDirectoryItem extends StatelessWidget {
  final ResidentModel resident;
  final VoidCallback onTap;

  const ResidentDirectoryItem({
    super.key,
    required this.resident,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AppCard(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.skyLight,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                '${resident.wing.isNotEmpty ? '${resident.wing}-' : ''}${resident.flatNo}',
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primaryNavy,
                  fontSize: 13,
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    resident.name,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    resident.phone,
                    style: const TextStyle(
                        fontSize: 13, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
            AppBadge(
              label: resident.userType.toUpperCase(),
              variant: resident.userType == 'owner'
                  ? BadgeVariant.primary
                  : BadgeVariant.neutral,
              fontSize: 10,
            ),
          ],
        ),
      ),
    );
  }
}
