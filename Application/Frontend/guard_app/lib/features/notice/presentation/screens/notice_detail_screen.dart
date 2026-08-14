import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/notice_providers.dart';

class NoticeDetailScreen extends ConsumerWidget {
  final String noticeId;
  const NoticeDetailScreen({super.key, required this.noticeId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final noticeAsync = ref.watch(noticeDetailProvider(noticeId));

    return Scaffold(
      appBar: AppBar(title: const Text('Notice Details')),
      backgroundColor: AppColors.background,
      body: noticeAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: AppColors.textSecondary))),
        data: (data) {
          if (data == null) {
            return const Center(child: Text('Notice not found', style: TextStyle(color: AppColors.textSecondary)));
          }

          final title = data['title'] as String? ?? 'Notice';
          final body = data['body'] as String? ?? '';
          final category = data['category'] as String? ?? 'General';

          String dateStr = '';
          if (data['createdAt'] != null) {
            try {
              final dt = DateTime.parse(data['createdAt'] as String);
              dateStr = '${dt.day}/${dt.month}/${dt.year}';
            } catch (_) {}
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.xl),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.notice.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                        ),
                        child: Text(category, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.notice)),
                      ),
                      const Spacer(),
                      Text(dateStr, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    title,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary, height: 1.3),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  const Text('Issued by: Management Committee', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary)),
                  const Divider(height: AppSpacing.xl),
                  Text(
                    body,
                    style: const TextStyle(fontSize: 14, color: AppColors.textPrimary, height: 1.6),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
