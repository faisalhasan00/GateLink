import 'package:flutter/material.dart';
import '../../../../core/models/user_profile_model.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';

class ProfileHeaderCard extends StatelessWidget {
  final UserProfileModel? profile;
  final String fallbackDisplayName;
  final String fallbackEmail;
  final VoidCallback? onAvatarTap;

  const ProfileHeaderCard({
    super.key,
    required this.profile,
    required this.fallbackDisplayName,
    required this.fallbackEmail,
    this.onAvatarTap,
  });

  @override
  Widget build(BuildContext context) {
    final name = profile?.name.isNotEmpty == true
        ? profile!.name
        : (fallbackDisplayName.isNotEmpty ? fallbackDisplayName : 'Resident');
    final email = profile?.email.isNotEmpty == true
        ? profile!.email
        : (fallbackEmail.isNotEmpty ? fallbackEmail : 'No email');
    final roleTitle = profile?.displayRoleTitle ?? 'Resident';
    final flatNumber = profile?.displayFlatNumber ?? 'Not Assigned';
    final photoUrl = profile?.photoUrl;

    return AppCard(
      child: Column(
        children: [
          AppAvatar(
            name: name,
            imageUrl: photoUrl,
            size: AppAvatarSize.xl,
            showBorder: true,
            borderColor: AppColors.primarySurface,
            onTap: onAvatarTap,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            name,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            email,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Wrap(
            alignment: WrapAlignment.center,
            spacing: 8,
            runSpacing: 6,
            children: [
              AppBadge(
                text: '$roleTitle • Flat $flatNumber',
                variant: AppBadgeVariant.primary,
                size: AppBadgeSize.sm,
              ),
              const AppBadge(
                text: 'Active Resident',
                variant: AppBadgeVariant.success,
                size: AppBadgeSize.sm,
                leadingIcon: Icons.verified_rounded,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
