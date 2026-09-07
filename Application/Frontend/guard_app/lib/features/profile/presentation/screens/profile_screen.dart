import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../widgets/guard_profile_card.dart';
import '../widgets/guard_option_tile.dart';
import '../widgets/guard_notification_dialog.dart';
import '../widgets/guard_account_deletion_dialog.dart';
import '../widgets/guard_logout_dialog.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(userProfileProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('My Profile')),
      body: profileAsync.when(
        data: (profile) {
          final name = profile?['name'] ?? 'Unknown User';
          final phone = profile?['phone'] ?? 'No Phone';
          final role = profile?['role'] ?? 'Resident';
          final flatNumber = profile?['flatNumber'] ?? 'N/A';
          final societyId = profile?['societyId'] ?? '';

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              children: [
                GuardProfileCard(
                  name: name,
                  phone: phone,
                  role: role,
                  flatNumber: flatNumber,
                  societyId: societyId,
                ),
                const SizedBox(height: AppSpacing.lg),

                // Options List
                GuardOptionTile(
                  icon: Icons.person_outline_rounded,
                  title: 'Edit Profile',
                  onTap: () => context.go(AppRoutes.editProfile),
                ),
                GuardOptionTile(
                  icon: Icons.lock_outline_rounded,
                  title: 'Change Password',
                  onTap: () => context.go(AppRoutes.changePassword),
                ),
                GuardOptionTile(
                  icon: Icons.family_restroom_rounded,
                  title: 'Family & Vehicle Members',
                  onTap: () => context.go(AppRoutes.parking),
                ),
                GuardOptionTile(
                  icon: Icons.notifications_outlined,
                  title: 'Notification Preferences',
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => GuardNotificationDialog(ref: ref),
                    );
                  },
                ),
                GuardOptionTile(
                  icon: Icons.help_outline_rounded,
                  title: 'Help & Support',
                  onTap: () {},
                ),
                GuardOptionTile(
                  icon: Icons.delete_forever_outlined,
                  title: 'Request Account Deletion',
                  titleColor: AppColors.error,
                  iconColor: AppColors.error,
                  onTap: () => GuardAccountDeletionFlow.show(context, ref),
                ),
                GuardOptionTile(
                  icon: Icons.logout_rounded,
                  title: 'Log Out',
                  titleColor: AppColors.error,
                  iconColor: AppColors.error,
                  onTap: () async {
                    final confirm = await GuardLogoutDialog.show(context);
                    if (confirm == true) {
                      await ref.read(authServiceProvider).signOut();
                      if (context.mounted) {
                        context.go(AppRoutes.login);
                      }
                    }
                  },
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
