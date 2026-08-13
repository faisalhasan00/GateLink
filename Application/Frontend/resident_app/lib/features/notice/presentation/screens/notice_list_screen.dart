import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class NoticeListScreen extends ConsumerWidget {
  const NoticeListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final noticesAsync = ref.watch(noticesStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Society Notices')),
      backgroundColor: AppColors.background,
      body: noticesAsync.when(
        data: (noticesList) {
          if (noticesList.isEmpty) {
            return const Center(
              child: Text('No notices available', style: TextStyle(color: AppColors.textSecondary)),
            );
          }

          final notices = noticesList.map((notice) {
            String dateStr = notice.date;
            if (dateStr.isEmpty && notice.createdAt.isNotEmpty) {
              try {
                final dt = DateTime.parse(notice.createdAt);
                dateStr = '${dt.day}/${dt.month}/${dt.year}';
              } catch (_) {}
            }

            return _NoticeItem(
              id: notice.id,
              title: notice.title,
              date: dateStr,
              category: notice.category,
              isNew: false,
            );
          }).toList();

          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: notices.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, index) {
              final n = notices[index];
              return GestureDetector(
                onTap: () => context.go('/home/notices/${n.id}'),
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.notice.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(AppRadius.md),
                        ),
                        child: const Icon(Icons.campaign_rounded, color: AppColors.notice, size: 22),
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppColors.gray100,
                                    borderRadius: BorderRadius.circular(AppRadius.sm),
                                  ),
                                  child: Text(n.category, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                                ),
                                if (n.isNew) ...[
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppColors.primarySurface,
                                      borderRadius: BorderRadius.circular(AppRadius.sm),
                                    ),
                                    child: const Text('NEW', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primary)),
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(n.title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                            const SizedBox(height: 2),
                            Text(n.date, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textSecondary),
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
    );
  }
}

class _NoticeItem {
  final String id, title, date, category;
  final bool isNew;
  const _NoticeItem({required this.id, required this.title, required this.date, required this.category, required this.isNew});
}
