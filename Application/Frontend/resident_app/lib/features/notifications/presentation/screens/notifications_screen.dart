import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/notification_providers.dart';
import '../widgets/notification_actions_menu.dart';
import '../widgets/notification_category_filter.dart';
import '../widgets/notification_empty_state.dart';
import '../widgets/notification_item_card.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Visitors',
    'Bills',
    'Complaints',
    'Amenities'
  ];

  @override
  Widget build(BuildContext context) {
    final notificationsAsync = ref.watch(notificationsStreamProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Center'),
        actions: const [
          NotificationActionsMenu(),
        ],
      ),
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          NotificationCategoryFilter(
            categories: _categories,
            selectedCategory: _selectedCategory,
            onCategorySelected: (cat) {
              setState(() => _selectedCategory = cat);
            },
          ),
          const Divider(height: 0),
          Expanded(
            child: notificationsAsync.when(
              data: (notifications) {
                final filtered = _selectedCategory == 'All'
                    ? notifications
                    : notifications.where((n) {
                        final type = n.type.toLowerCase();
                        final catLower = _selectedCategory.toLowerCase();
                        return type.contains(catLower) ||
                            type.startsWith(catLower);
                      }).toList();

                if (filtered.isEmpty) {
                  return const NotificationEmptyState();
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) =>
                      const SizedBox(height: AppSpacing.md),
                  itemBuilder: (context, index) {
                    return NotificationItemCard(
                      notification: filtered[index],
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
}
