import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = ['All', 'Visitors', 'Bills', 'Complaints', 'Amenities'];

  @override
  Widget build(BuildContext context) {
    final notificationsAsync = ref.watch(notificationsStreamProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Center'),
        actions: [
          TextButton(
            onPressed: () async {
              final user = ref.read(currentUserProvider);
              final svc = ref.read(firestoreServiceProvider);
              if (user != null && svc != null) {
                await svc.markAllNotificationsAsRead(user.uid);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('All notifications marked as read.')),
                  );
                }
              }
            },
            child: const Text('Mark all read', style: TextStyle(fontSize: 13, color: AppColors.primary)),
          ),
        ],
      ),
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // Filter Bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(AppSpacing.pagePadding, 0, AppSpacing.pagePadding, AppSpacing.sm),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _categories.map((cat) {
                  final isSelected = _selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      selectedColor: AppColors.primary,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : AppColors.textSecondary,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        fontSize: 12,
                      ),
                      onSelected: (selected) {
                        if (selected) setState(() => _selectedCategory = cat);
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const Divider(height: 0),

          // Notifications List
          Expanded(
            child: notificationsAsync.when(
              data: (snapshot) {
                final allDocs = snapshot.docs;

                final filtered = _selectedCategory == 'All'
                    ? allDocs
                    : allDocs.where((doc) {
                        final data = doc.data() as Map<String, dynamic>;
                        final type = (data['type'] ?? '').toString().toLowerCase();
                        final catLower = _selectedCategory.toLowerCase();
                        return type.contains(catLower) || type.startsWith(catLower);
                      }).toList();

                if (filtered.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.notifications_off_rounded, size: 56, color: AppColors.textDisabled),
                        SizedBox(height: AppSpacing.md),
                        Text(
                          'No notifications in this category',
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 15),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
                  itemBuilder: (context, index) {
                    final doc = filtered[index];
                    final data = doc.data() as Map<String, dynamic>;

                    final title = data['title'] as String? ?? 'Notification';
                    final body = data['body'] as String? ?? '';
                    final type = data['type'] as String? ?? 'info';
                    final isRead = data['read'] as bool? ?? false;

                    String timeStr = 'Just now';
                    if (data['createdAt'] != null) {
                      try {
                        final dt = DateTime.parse(data['createdAt']);
                        timeStr = '${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
                      } catch (_) {}
                    }

                    return GestureDetector(
                      onTap: () async {
                        final user = ref.read(currentUserProvider);
                        final svc = ref.read(firestoreServiceProvider);
                        if (user != null && svc != null && !isRead) {
                          await svc.markNotificationAsRead(doc.id, user.uid);
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
                          color: isRead ? Colors.white : AppColors.primarySurface.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(AppRadius.lg),
                          border: Border.all(
                            color: isRead ? AppColors.border : AppColors.primary.withValues(alpha: 0.4),
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
                                          title,
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: isRead ? FontWeight.w600 : FontWeight.w800,
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
                                  Text(body, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                                  const SizedBox(height: 6),
                                  Text(timeStr, style: const TextStyle(fontSize: 11, color: AppColors.textDisabled)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, st) => Center(child: Text('Error: $e')),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getIconForType(String type) {
    if (type.contains('visitor')) return Icons.person_rounded;
    if (type.contains('payment') || type.contains('bill')) return Icons.receipt_long_rounded;
    if (type.contains('complaint')) return Icons.engineering_rounded;
    if (type.contains('amenity')) return Icons.pool_rounded;
    if (type.contains('document')) return Icons.insert_drive_file_rounded;
    if (type.contains('notice')) return Icons.campaign_rounded;
    return Icons.notifications_rounded;
  }

  Color _getIconColorForType(String type) {
    if (type.contains('visitor')) return AppColors.visitor;
    if (type.contains('payment') || type.contains('bill')) return AppColors.success;
    if (type.contains('complaint')) return AppColors.complaint;
    if (type.contains('amenity')) return AppColors.amenity;
    if (type.contains('document')) return AppColors.info;
    if (type.contains('notice')) return AppColors.warning;
    return AppColors.primary;
  }
}
