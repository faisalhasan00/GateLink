import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';

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
                // Profile Card
                Container(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.xl),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    children: [
                      const CircleAvatar(
                        radius: 40,
                        backgroundColor: AppColors.primarySurface,
                        child: Icon(Icons.person_rounded, size: 48, color: AppColors.primary),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Text(name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                      const SizedBox(height: 4),
                      Text(phone, style: const TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primarySurface,
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                        child: Text('${role.toUpperCase()} • Flat $flatNumber', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary)),
                      ),
                      if (societyId.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text('Society ID: $societyId', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Options List
                _OptionTile(
                  icon: Icons.person_outline_rounded,
                  title: 'Edit Profile',
                  onTap: () => context.go(AppRoutes.editProfile),
                ),
                _OptionTile(
                  icon: Icons.lock_outline_rounded,
                  title: 'Change Password',
                  onTap: () => context.go(AppRoutes.changePassword),
                ),
                _OptionTile(
                  icon: Icons.family_restroom_rounded,
                  title: 'Family & Vehicle Members',
                  onTap: () => context.go(AppRoutes.parking),
                ),
                _OptionTile(
                  icon: Icons.notifications_outlined,
                  title: 'Notification Preferences',
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => _NotificationPreferencesDialog(ref: ref),
                    );
                  },
                ),
                _OptionTile(
                  icon: Icons.help_outline_rounded,
                  title: 'Help & Support',
                  onTap: () {},
                ),
                _OptionTile(
                  icon: Icons.logout_rounded,
                  title: 'Log Out',
                  titleColor: AppColors.error,
                  iconColor: AppColors.error,
                  onTap: () async {
                    await ref.read(authServiceProvider).signOut();
                    if (context.mounted) {
                      context.go(AppRoutes.login);
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

class _OptionTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color? titleColor;
  final Color? iconColor;

  const _OptionTile({
    required this.icon,
    required this.title,
    required this.onTap,
    this.titleColor,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: ListTile(
        onTap: onTap,
        leading: Icon(icon, color: iconColor ?? AppColors.textPrimary, size: 22),
        title: Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: titleColor ?? AppColors.textPrimary)),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textSecondary),
      ),
    );
  }
}

class _NotificationPreferencesDialog extends StatefulWidget {
  final WidgetRef ref;
  const _NotificationPreferencesDialog({required this.ref});

  @override
  State<_NotificationPreferencesDialog> createState() => _NotificationPreferencesDialogState();
}

class _NotificationPreferencesDialogState extends State<_NotificationPreferencesDialog> {
  bool _visitors = true;
  bool _bills = true;
  bool _complaints = true;
  bool _amenities = true;
  bool _notices = true;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Notification Preferences', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SwitchListTile(
              title: const Text('Visitor Alerts', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Real-time gate arrival & approval alerts'),
              value: _visitors,
              onChanged: (v) => setState(() => _visitors = v),
            ),
            SwitchListTile(
              title: const Text('Billing & Maintenance', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Invoice generation & payment receipts'),
              value: _bills,
              onChanged: (v) => setState(() => _bills = v),
            ),
            SwitchListTile(
              title: const Text('Complaint Status', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Staff assignment & resolution updates'),
              value: _complaints,
              onChanged: (v) => setState(() => _complaints = v),
            ),
            SwitchListTile(
              title: const Text('Amenity Bookings', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Slot confirmation & cancellation updates'),
              value: _amenities,
              onChanged: (v) => setState(() => _amenities = v),
            ),
            SwitchListTile(
              title: const Text('Society Notices', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Emergency announcements & circulars'),
              value: _notices,
              onChanged: (v) => setState(() => _notices = v),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        ElevatedButton(
          onPressed: () async {
            final user = widget.ref.read(currentUserProvider);
            final svc = widget.ref.read(firestoreServiceProvider);
            if (user != null && svc != null) {
              await svc.updateNotificationPreferences(user.uid, {
                'visitors': _visitors,
                'bills': _bills,
                'complaints': _complaints,
                'amenities': _amenities,
                'notices': _notices,
              });
              if (context.mounted) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Notification preferences saved!')),
                );
              }
            }
          },
          child: const Text('Save Settings'),
        ),
      ],
    );
  }
}
