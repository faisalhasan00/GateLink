import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/notification_model.dart';
import '../../providers/notification_providers.dart';

class NotificationItemCard extends ConsumerWidget {
  final NotificationModel notification;

  const NotificationItemCard({
    super.key,
    required this.notification,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isRead = notification.read;
    final type = notification.type;

    String timeStr = 'Just now';
    if (notification.createdAt.isNotEmpty) {
      final dt = DateTime.tryParse(notification.createdAt);
      if (dt != null) {
        final local = dt.toLocal();
        timeStr =
            '${local.day}/${local.month}/${local.year} ${local.hour}:${local.minute.toString().padLeft(2, '0')}';
      }
    }

    return Dismissible(
      key: Key(notification.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppColors.error,
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Text(
              'Delete',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
            SizedBox(width: 6),
            Icon(Icons.delete_outline_rounded, color: Colors.white),
          ],
        ),
      ),
      onDismissed: (_) async {
        final user = ref.read(currentUserProvider);
        final profile = ref.read(userProfileProvider).value;
        final activeSocId = profile?.societyId ?? 'SOC-001';
        if (user != null) {
          await ref
              .read(notificationControllerProvider.notifier)
              .deleteNotification(
                societyId: activeSocId,
                notificationId: notification.id,
                uid: user.uid,
              );
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Notification deleted.')),
            );
          }
        }
      },
      child: GestureDetector(
        onTap: () async {
          final user = ref.read(currentUserProvider);
          final profile = ref.read(userProfileProvider).value;
          final activeSocId = profile?.societyId ?? 'SOC-001';

          if (user != null && !isRead) {
            await ref
                .read(notificationControllerProvider.notifier)
                .markNotificationAsRead(
                  societyId: activeSocId,
                  notificationId: notification.id,
                  uid: user.uid,
                );
          }

          // Deep Link Navigation
          if (context.mounted) {
            if (type.contains('visitor')) {
              context.go(AppRoutes.visitors);
            } else if (type.contains('payment') || type.contains('bill')) {
              context.go(AppRoutes.maintenanceHistory);
            } else if (type.contains('complaint')) {
              context.go(AppRoutes.complaints);
            } else if (type.contains('amenity')) {
              context.go(AppRoutes.myBookings);
            } else if (type.contains('document')) {
              context.go(AppRoutes.documents);
            } else if (type.contains('notice')) {
              context.go(AppRoutes.notices);
            }
          }
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: isRead
                ? Colors.white
                : AppColors.primarySurface.withValues(alpha: 0.3),
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(
              color: isRead
                  ? AppColors.border
                  : AppColors.primary.withValues(alpha: 0.4),
              width: isRead ? 1 : 1.5,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: _getIconColorForType(type).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: Icon(
                  _getIconForType(type),
                  color: _getIconColorForType(type),
                  size: 20,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            notification.title,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight:
                                  isRead ? FontWeight.w600 : FontWeight.w800,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        if (!isRead)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notification.body,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      timeStr,
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textDisabled,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close_rounded,
                    size: 18, color: AppColors.textDisabled),
                onPressed: () async {
                  final user = ref.read(currentUserProvider);
                  final profile = ref.read(userProfileProvider).value;
                  final activeSocId = profile?.societyId ?? 'SOC-001';
                  if (user != null) {
                    await ref
                        .read(notificationControllerProvider.notifier)
                        .deleteNotification(
                          societyId: activeSocId,
                          notificationId: notification.id,
                          uid: user.uid,
                        );
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getIconForType(String type) {
    if (type.contains('visitor')) return Icons.person_rounded;
    if (type.contains('payment') || type.contains('bill')) {
      return Icons.receipt_long_rounded;
    }
    if (type.contains('complaint')) return Icons.engineering_rounded;
    if (type.contains('amenity')) return Icons.pool_rounded;
    if (type.contains('document')) return Icons.insert_drive_file_rounded;
    if (type.contains('notice')) return Icons.campaign_rounded;
    return Icons.notifications_rounded;
  }

  Color _getIconColorForType(String type) {
    if (type.contains('visitor')) return AppColors.visitor;
    if (type.contains('payment') || type.contains('bill')) {
      return AppColors.success;
    }
    if (type.contains('complaint')) return AppColors.complaint;
    if (type.contains('amenity')) return AppColors.amenity;
    if (type.contains('document')) return AppColors.info;
    if (type.contains('notice')) return AppColors.warning;
    return AppColors.primary;
  }
}
