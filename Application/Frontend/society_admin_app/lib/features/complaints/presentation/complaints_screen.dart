import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/complaint_model.dart';

class ComplaintsScreen extends ConsumerStatefulWidget {
  const ComplaintsScreen({super.key});

  @override
  ConsumerState<ComplaintsScreen> createState() => _ComplaintsScreenState();
}

class _ComplaintsScreenState extends ConsumerState<ComplaintsScreen> {
  String _statusFilter = 'all'; // 'all', 'open', 'in_progress', 'resolved'

  @override
  Widget build(BuildContext context) {
    final society = ref.watch(activeSocietyProvider);
    final complaintsAsync = ref.watch(complaintsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Complaints & Helpdesk'),
      ),
      body: Column(
        children: [
          // Filter Row
          Padding(
            padding: const EdgeInsets.all(16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _FilterChip(
                    label: 'All Tickets',
                    isSelected: _statusFilter == 'all',
                    onSelected: () => setState(() => _statusFilter = 'all'),
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Open',
                    isSelected: _statusFilter == 'open',
                    onSelected: () => setState(() => _statusFilter = 'open'),
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'In Progress',
                    isSelected: _statusFilter == 'in_progress',
                    onSelected: () => setState(() => _statusFilter = 'in_progress'),
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Resolved',
                    isSelected: _statusFilter == 'resolved',
                    onSelected: () => setState(() => _statusFilter = 'resolved'),
                  ),
                ],
              ),
            ),
          ),

          // Complaints List
          Expanded(
            child: complaintsAsync.when(
              loading: () => const LoadingStateWidget(message: 'Loading complaints...'),
              error: (err, _) => ErrorStateWidget(
                message: 'Failed to load complaints: ${err.toString()}',
                onRetry: () => ref.invalidate(complaintsStreamProvider),
              ),
              data: (complaints) {
                final filtered = complaints.where((c) {
                  if (_statusFilter == 'all') return true;
                  return c.status == _statusFilter;
                }).toList();

                if (filtered.isEmpty) {
                  return const EmptyStateWidget(
                    title: 'No Complaints Found',
                    description: 'There are no complaints under this filter category.',
                    icon: Icons.assignment_turned_in_outlined,
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final complaint = filtered[index];
                    return _ComplaintCard(
                      complaint: complaint,
                      onUpdateStatus: (newStatus) async {
                        if (society != null) {
                          await ref.read(firestoreServiceProvider).updateComplaintStatus(
                                society.id,
                                complaint.id,
                                newStatus,
                              );
                        }
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onSelected;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onSelected,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryNavy : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primaryNavy : AppColors.cardBorder,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : AppColors.textSecondary,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

class _ComplaintCard extends StatelessWidget {
  final ComplaintModel complaint;
  final ValueChanged<String> onUpdateStatus;

  const _ComplaintCard({
    required this.complaint,
    required this.onUpdateStatus,
  });

  @override
  Widget build(BuildContext context) {
    BadgeVariant statusVariant;
    switch (complaint.status) {
      case 'resolved':
        statusVariant = BadgeVariant.success;
        break;
      case 'in_progress':
        statusVariant = BadgeVariant.sky;
        break;
      default:
        statusVariant = BadgeVariant.warning;
        break;
    }

    final dateStr = complaint.createdAt != null
        ? DateFormat('dd MMM, hh:mm a').format(complaint.createdAt!)
        : 'Recently';

    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  complaint.category.toUpperCase(),
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
                ),
              ),
              AppBadge(label: complaint.status.replaceAll('_', ' ').toUpperCase(), variant: statusVariant),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            complaint.title,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          if (complaint.description.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              complaint.description,
              style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
          ],
          const SizedBox(height: 12),
          Text(
            'Raised by ${complaint.residentName} (Flat ${complaint.flatNo}) • $dateStr',
            style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
          ),
          const SizedBox(height: 14),
          const Divider(height: 1, color: AppColors.cardBorder),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              if (complaint.status != 'in_progress' && complaint.status != 'resolved')
                TextButton(
                  onPressed: () => onUpdateStatus('in_progress'),
                  child: const Text('Mark In Progress'),
                ),
              if (complaint.status != 'resolved') ...[
                const SizedBox(width: 8),
                AppButton(
                  label: 'Resolve Ticket',
                  onPressed: () => onUpdateStatus('resolved'),
                  variant: ButtonVariant.primary,
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
