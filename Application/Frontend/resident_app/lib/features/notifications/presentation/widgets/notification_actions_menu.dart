import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../providers/notification_providers.dart';

class NotificationActionsMenu extends ConsumerWidget {
  const NotificationActionsMenu({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.more_vert_rounded),
      onSelected: (value) async {
        final user = ref.read(currentUserProvider);
        final profile = ref.read(userProfileProvider).value;
        final activeSocId = profile?.societyId ?? 'SOC-001';
        if (user == null) return;

        if (value == 'mark_read') {
          final success = await ref
              .read(notificationControllerProvider.notifier)
              .markAllNotificationsAsRead(
                societyId: activeSocId,
                uid: user.uid,
              );

          if (success && context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('All notifications marked as read.'),
              ),
            );
          }
        } else if (value == 'clear_all') {
          final confirm = await showDialog<bool>(
            context: context,
            builder: (ctx) => AlertDialog(
              title: const Text('Clear All Notifications?'),
              content: const Text(
                'Are you sure you want to clear all notifications? This cannot be undone.',
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx, false),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.pop(ctx, true),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.error,
                  ),
                  child: const Text('Clear All'),
                ),
              ],
            ),
          );

          if (confirm == true) {
            final success = await ref
                .read(notificationControllerProvider.notifier)
                .clearAllNotifications(
                  societyId: activeSocId,
                  uid: user.uid,
                );

            if (success && context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('All notifications cleared.'),
                  backgroundColor: AppColors.error,
                ),
              );
            }
          }
        }
      },
      itemBuilder: (context) => [
        const PopupMenuItem(
          value: 'mark_read',
          child: Row(
            children: [
              Icon(Icons.done_all_rounded, size: 18, color: AppColors.primary),
              SizedBox(width: 10),
              Text('Mark all as read'),
            ],
          ),
        ),
        const PopupMenuItem(
          value: 'clear_all',
          child: Row(
            children: [
              Icon(Icons.delete_sweep_rounded, size: 18, color: AppColors.error),
              SizedBox(width: 10),
              Text('Clear all notifications', style: TextStyle(color: AppColors.error)),
            ],
          ),
        ),
      ],
    );
  }
}
