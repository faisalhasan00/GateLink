import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/profile_header_card.dart';
import '../widgets/residency_details_card.dart';
import '../widgets/profile_actions_menu.dart';
import '../widgets/society_support_sheet.dart';
import '../widgets/notification_preferences_dialog.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  void _showLogoutDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.xl),
        ),
        title: const Row(
          children: [
            Icon(Icons.logout_rounded, color: AppColors.error),
            SizedBox(width: 8),
            Text(
              'Sign Out',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
            ),
          ],
        ),
        content: const Text(
          'Are you sure you want to log out of your resident account?',
          style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel',
                style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authServiceProvider).signOut();
              if (context.mounted) {
                context.go('/login');
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
            ),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final profileAsync = ref.watch(userProfileProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            tooltip: 'Edit Profile',
            onPressed: () => context.push(AppRoutes.editProfile),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          ref.invalidate(userProfileProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: profileAsync.when(
            data: (profile) {
              final societyName =
                  profile?.displaySocietyName ?? 'Housing Society';

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ProfileHeaderCard(
                    profile: profile,
                    fallbackDisplayName: user?.displayName ?? 'Resident',
                    fallbackEmail: user?.email ?? '',
                    onAvatarTap: () => context.push(AppRoutes.editProfile),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  const Text(
                    'RESIDENCY DETAILS',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  ResidencyDetailsCard(
                    profile: profile,
                    fallbackPhone: user?.phoneNumber ?? '',
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  const Text(
                    'ACCOUNT & SETTINGS',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  ProfileActionsMenu(
                    onEditProfile: () => context.push(AppRoutes.editProfile),
                    onReferral: () => context.push(AppRoutes.referral),
                    onChangePassword: () =>
                        context.push(AppRoutes.changePassword),
                    onNotificationPreferences: () =>
                        NotificationPreferencesDialog.show(context,
                            profile: profile),
                    onSocietySupport: () =>
                        SocietySupportSheet.show(context,
                            societyName: societyName),
                    onTermsAndPrivacy: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                              'GateLink Security & Data Protection v2.4.0 (ISO/IEC 27001 Certified)'),
                        ),
                      );
                    },
                    onLogout: () => _showLogoutDialog(context, ref),
                  ),
                  const SizedBox(height: AppSpacing.xxl),
                  const Center(
                    child: Text(
                      'GateLink Resident App • v2.4.0 (Production)',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.gray400,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                ],
              );
            },
            loading: () => const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 60),
                child: CircularProgressIndicator(color: AppColors.primary),
              ),
            ),
            error: (e, _) => Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 40),
                child: Column(
                  children: [
                    const Icon(Icons.error_outline_rounded,
                        color: AppColors.error, size: 40),
                    const SizedBox(height: 12),
                    const Text(
                      'Unable to load profile data',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () => ref.invalidate(userProfileProvider),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
