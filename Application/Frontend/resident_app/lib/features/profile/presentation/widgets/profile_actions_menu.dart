import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ProfileActionsMenu extends StatelessWidget {
  final VoidCallback onEditProfile;
  final VoidCallback onChangePassword;
  final VoidCallback onNotificationPreferences;
  final VoidCallback onSocietySupport;
  final VoidCallback onTermsAndPrivacy;
  final VoidCallback onLogout;

  const ProfileActionsMenu({
    super.key,
    required this.onEditProfile,
    required this.onChangePassword,
    required this.onNotificationPreferences,
    required this.onSocietySupport,
    required this.onTermsAndPrivacy,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          _MenuItem(
            icon: Icons.person_outline_rounded,
            title: 'Edit Profile & Details',
            subtitle: 'Name, phone, date of birth & gender',
            onTap: onEditProfile,
          ),
          const Divider(height: 1),
          _MenuItem(
            icon: Icons.lock_outline_rounded,
            title: 'Change Password',
            subtitle: 'Update your login password securely',
            onTap: onChangePassword,
          ),
          const Divider(height: 1),
          _MenuItem(
            icon: Icons.notifications_none_rounded,
            title: 'Notification Preferences',
            subtitle: 'Gate alerts, visitor approval & notices',
            onTap: onNotificationPreferences,
          ),
          const Divider(height: 1),
          _MenuItem(
            icon: Icons.support_agent_rounded,
            title: 'Help & Society Support',
            subtitle: 'Contact gate security & society admin',
            onTap: onSocietySupport,
          ),
          const Divider(height: 1),
          _MenuItem(
            icon: Icons.privacy_tip_outlined,
            title: 'Privacy Policy & Terms',
            subtitle: 'GateLink data protection standards',
            onTap: onTermsAndPrivacy,
          ),
          const Divider(height: 1),
          _MenuItem(
            icon: Icons.logout_rounded,
            title: 'Log Out',
            subtitle: 'Sign out from this device',
            isDestructive: true,
            onTap: onLogout,
          ),
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final bool isDestructive;

  const _MenuItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.isDestructive = false,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: isDestructive
              ? AppColors.error.withValues(alpha: 0.1)
              : AppColors.primarySurface,
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        child: Icon(
          icon,
          color: isDestructive ? AppColors.error : AppColors.primary,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: isDestructive ? AppColors.error : AppColors.textPrimary,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
      ),
      trailing: Icon(
        Icons.chevron_right_rounded,
        size: 20,
        color: isDestructive ? AppColors.error : AppColors.gray400,
      ),
      onTap: onTap,
    );
  }
}
