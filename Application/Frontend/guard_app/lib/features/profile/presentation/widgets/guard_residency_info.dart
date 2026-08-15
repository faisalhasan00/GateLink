import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class GuardResidencyInfo extends StatelessWidget {
  final String phone;
  final String societyName;
  final String flatNumber;

  const GuardResidencyInfo({
    super.key,
    required this.phone,
    required this.societyName,
    required this.flatNumber,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: AppColors.primarySurface,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border:
                Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
          ),
          child: const Row(
            children: [
              Icon(Icons.info_outline_rounded,
                  color: AppColors.primary, size: 20),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Mobile number, society, and flat assignment are read-only and verified by society administration.',
                  style: TextStyle(
                      fontSize: 12, color: AppColors.primary, height: 1.3),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        const Divider(),
        const SizedBox(height: AppSpacing.md),
        const Text(
          'READ-ONLY SYSTEM DETAILS',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        _ReadOnlyField(
          label: 'Registered Mobile Number',
          value: phone,
          icon: Icons.phone_android_rounded,
        ),
        const SizedBox(height: AppSpacing.sm),
        _ReadOnlyField(
          label: 'Assigned Society',
          value: societyName,
          icon: Icons.location_city_rounded,
        ),
        const SizedBox(height: AppSpacing.sm),
        _ReadOnlyField(
          label: 'Assigned Flat',
          value: 'Flat $flatNumber',
          icon: Icons.home_work_rounded,
        ),
      ],
    );
  }
}

class _ReadOnlyField extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _ReadOnlyField({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.border.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.textSecondary),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                    fontSize: 11, color: AppColors.textSecondary),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const Spacer(),
          const Icon(Icons.lock_rounded,
              size: 16, color: AppColors.textSecondary),
        ],
      ),
    );
  }
}
