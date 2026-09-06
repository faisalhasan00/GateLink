import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/notice_model.dart';

class NoticesScreen extends ConsumerWidget {
  const NoticesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);
    final noticesAsync = ref.watch(noticesStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Notices & Broadcasts'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryNavy,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('New Notice'),
        onPressed: () {
          if (society != null) {
            _showCreateNoticeModal(context, ref, society.id);
          }
        },
      ),
      body: noticesAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading society notices...'),
        error: (err, _) => ErrorStateWidget(
          message: 'Failed to load notices: ${err.toString()}',
          onRetry: () => ref.invalidate(noticesStreamProvider),
        ),
        data: (notices) {
          if (notices.isEmpty) {
            return EmptyStateWidget(
              title: 'No Notices Published',
              description: 'Publish your first society notice or broadcast circular.',
              icon: Icons.campaign_outlined,
              actionLabel: 'Create Notice',
              onAction: () {
                if (society != null) {
                  _showCreateNoticeModal(context, ref, society.id);
                }
              },
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: notices.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final notice = notices[index];
              return _NoticeCard(
                notice: notice,
                onDelete: () async {
                  if (society != null) {
                    await ref.read(firestoreServiceProvider).deleteNotice(society.id, notice.id);
                  }
                },
              );
            },
          );
        },
      ),
    );
  }

  void _showCreateNoticeModal(BuildContext context, WidgetRef ref, String societyId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        final titleCtrl = TextEditingController();
        final contentCtrl = TextEditingController();
        String selectedCategory = 'general';
        bool isUrgent = false;

        return StatefulBuilder(
          builder: (modalCtx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(modalCtx).viewInsets.bottom + 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Publish Society Notice',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.of(modalCtx).pop(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    AppTextField(
                      controller: titleCtrl,
                      label: 'Notice Title',
                      hintText: 'e.g. Water Supply Interruption / AGM Meeting',
                    ),
                    const SizedBox(height: 14),
                    const Text('Category', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      initialValue: selectedCategory,
                      decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
                      items: const [
                        DropdownMenuItem(value: 'general', child: Text('General Notice')),
                        DropdownMenuItem(value: 'emergency', child: Text('Emergency Alert')),
                        DropdownMenuItem(value: 'maintenance', child: Text('Maintenance / Outage')),
                        DropdownMenuItem(value: 'event', child: Text('Event / Celebration')),
                        DropdownMenuItem(value: 'meeting', child: Text('General Body Meeting')),
                      ],
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedCategory = val);
                      },
                    ),
                    const SizedBox(height: 14),
                    AppTextField(
                      controller: contentCtrl,
                      label: 'Notice Details',
                      hintText: 'Write the complete announcement text...',
                      maxLines: 4,
                    ),
                    const SizedBox(height: 14),
                    CheckboxListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Mark as High Priority / Urgent Broadcast', style: TextStyle(fontSize: 14)),
                      value: isUrgent,
                      activeColor: AppColors.dangerCrimson,
                      onChanged: (val) => setModalState(() => isUrgent = val ?? false),
                    ),
                    const SizedBox(height: 20),
                    AppButton(
                      label: 'Publish & Notify Residents',
                      width: double.infinity,
                      variant: isUrgent ? ButtonVariant.danger : ButtonVariant.primary,
                      onPressed: () async {
                        if (titleCtrl.text.trim().isEmpty) return;
                        try {
                          final notice = NoticeModel(
                            id: '',
                            title: titleCtrl.text.trim(),
                            content: contentCtrl.text.trim(),
                            category: selectedCategory,
                            isUrgent: isUrgent,
                            createdAt: DateTime.now(),
                          );
                          await ref.read(firestoreServiceProvider).createNotice(societyId, notice);
                          if (modalCtx.mounted) Navigator.of(modalCtx).pop();
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Notice published successfully!'),
                                backgroundColor: AppColors.successEmerald,
                              ),
                            );
                          }
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Failed to publish notice: $e'),
                                backgroundColor: AppColors.dangerCrimson,
                              ),
                            );
                          }
                        }
                      },
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class _NoticeCard extends StatelessWidget {
  final NoticeModel notice;
  final VoidCallback onDelete;

  const _NoticeCard({
    required this.notice,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final dateStr = notice.createdAt != null
        ? DateFormat('dd MMM yyyy, hh:mm a').format(notice.createdAt!)
        : 'Recently';

    return AppCard(
      padding: const EdgeInsets.all(16),
      borderColor: notice.isUrgent ? AppColors.dangerCrimson.withValues(alpha: 0.5) : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  AppBadge(
                    label: notice.category.toUpperCase(),
                    variant: notice.isUrgent ? BadgeVariant.danger : BadgeVariant.primary,
                  ),
                  if (notice.isUrgent) ...[
                    const SizedBox(width: 6),
                    const AppBadge(label: 'URGENT', variant: BadgeVariant.danger),
                  ],
                ],
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, size: 20, color: AppColors.textMuted),
                onPressed: onDelete,
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            notice.title,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 8),
          Text(
            notice.content,
            style: const TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.4),
          ),
          const SizedBox(height: 12),
          Text(
            'Published by ${notice.createdBy} • $dateStr',
            style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
          ),
        ],
      ),
    );
  }
}
