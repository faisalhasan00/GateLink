import 'package:flutter/material.dart';
import '../../../../core/models/user_profile_model.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ResidencyDetailsCard extends StatelessWidget {
  final UserProfileModel? profile;
  final String fallbackPhone;

  const ResidencyDetailsCard({
    super.key,
    required this.profile,
    required this.fallbackPhone,
  });

  @override
  Widget build(BuildContext context) {
    final societyName = profile?.displaySocietyName ?? '';
    final societyCode = profile?.societyCode ?? '';
    final societyId = profile?.societyId ?? '';
    final tower = profile?.tower ?? '';
    final flatNumber = profile?.displayFlatNumber ?? 'Not Assigned';
    final phone = profile?.phone.isNotEmpty == true
        ? profile!.phone
        : (fallbackPhone.isNotEmpty ? fallbackPhone : 'Not added');
    final occupancy = profile?.occupancyStatus.isNotEmpty == true
        ? profile!.occupancyStatus
        : 'Currently residing';

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          _DetailRow(
            icon: Icons.apartment_rounded,
            label: 'Society',
            value: societyName,
          ),
          const Divider(height: 16),
          if (societyCode.isNotEmpty || societyId.isNotEmpty) ...[
            _DetailRow(
              icon: Icons.tag_rounded,
              label: 'Society Code',
              value: societyCode.isNotEmpty ? societyCode : societyId,
            ),
            const Divider(height: 16),
          ],
          if (tower.isNotEmpty) ...[
            _DetailRow(
              icon: Icons.layers_rounded,
              label: 'Building / Tower',
              value: tower,
            ),
            const Divider(height: 16),
          ],
          _DetailRow(
            icon: Icons.door_front_door_rounded,
            label: 'Assigned Flat',
            value: 'Flat $flatNumber',
          ),
          const Divider(height: 16),
          _DetailRow(
            icon: Icons.phone_outlined,
            label: 'Mobile Number',
            value: phone,
          ),
          const Divider(height: 16),
          _DetailRow(
            icon: Icons.home_work_outlined,
            label: 'Occupancy Status',
            value: occupancy,
            valueColor: AppColors.textPrimary,
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.textSecondary),
        const SizedBox(width: 10),
        Text(
          label,
          style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
        ),
        const Spacer(),
        Flexible(
          child: Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: valueColor ?? AppColors.textPrimary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.end,
          ),
        ),
      ],
    );
  }
}
