import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class SocietyInfoCard extends ConsumerWidget {
  const SocietyInfoCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(userProfileProvider).value;
    final societyName = profile?.displaySocietyName ?? 'Housing Society';
    final societyCode = profile?.societyCode ?? '';
    final societyId = profile?.societyId ?? '';
    final tower = profile?.tower ?? '';
    final flat = profile?.displayFlatNumber ?? 'Not Assigned';
    final roleTitle = profile?.displayRoleTitle ?? 'Resident';

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('My Resident Profile',
              style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary)),
          const SizedBox(height: AppSpacing.sm),
          const Divider(),
          const SizedBox(height: AppSpacing.sm),
          _InfoRow(
              icon: Icons.apartment_rounded,
              label: 'Society',
              value: societyName),
          if (societyCode.isNotEmpty || societyId.isNotEmpty)
            _InfoRow(
                icon: Icons.tag_rounded,
                label: 'Society Code',
                value: societyCode.isNotEmpty ? societyCode : societyId),
          if (tower.isNotEmpty)
            _InfoRow(icon: Icons.layers_rounded, label: 'Tower / Block', value: tower),
          _InfoRow(
              icon: Icons.door_front_door_rounded,
              label: 'Flat Allotment',
              value: 'Flat $flat'),
          _InfoRow(
              icon: Icons.badge_outlined,
              label: 'Resident Type',
              value: roleTitle),
          const _InfoRow(
              icon: Icons.verified_user_rounded,
              label: 'Account Status',
              value: 'Active Resident',
              valueColor: AppColors.success),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;
  const _InfoRow(
      {required this.icon,
      required this.label,
      required this.value,
      this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 14, color: AppColors.textSecondary),
          const SizedBox(width: 8),
          Text(label,
              style: const TextStyle(
                  fontSize: 13, color: AppColors.textSecondary)),
          const Spacer(),
          Text(value,
              style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: valueColor ?? AppColors.textPrimary)),
        ],
      ),
    );
  }
}
