import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/models/maintenance_model.dart';
import '../../../../core/providers/admin_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';

class MaintenanceBillItem extends ConsumerWidget {
  final MaintenanceBillModel bill;
  final String societyId;
  final VoidCallback onMarkPaid;

  const MaintenanceBillItem({
    super.key,
    required this.bill,
    required this.societyId,
    required this.onMarkPaid,
  });

  String _formatDueDate(DateTime? date) {
    if (date == null) return 'N/A';
    return DateFormat('yyyy-MM-dd').format(date);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isPaid = bill.status == 'paid';
    final cleanFlat =
        bill.flatNo.isNotEmpty ? 'Flat ${bill.flatNo}' : 'Flat N/A';

    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: isPaid ? AppColors.emeraldLight : AppColors.crimsonLight,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              cleanFlat,
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: isPaid
                    ? AppColors.successEmerald
                    : AppColors.dangerCrimson,
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  bill.residentName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Month: ${bill.month} • Due: ${_formatDueDate(bill.dueDate)}',
                  style: const TextStyle(
                      fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '₹${bill.amount.toStringAsFixed(0)}',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (isPaid)
                    const AppBadge(
                        label: 'PAID',
                        variant: BadgeVariant.success,
                        fontSize: 10)
                  else
                    AppButton(
                      label: 'Settle',
                      onPressed: onMarkPaid,
                      variant: ButtonVariant.outline,
                    ),
                  const SizedBox(width: 6),
                  IconButton(
                    icon: const Icon(Icons.delete_outline,
                        size: 18, color: AppColors.textMuted),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    tooltip: 'Delete Bill',
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (dCtx) => AlertDialog(
                          title: const Text('Delete Invoice?'),
                          content: Text(
                              'Are you sure you want to delete invoice for ${bill.residentName} ($cleanFlat)?'),
                          actions: [
                            TextButton(
                                onPressed: () => Navigator.pop(dCtx, false),
                                child: const Text('Cancel')),
                            TextButton(
                              onPressed: () => Navigator.pop(dCtx, true),
                              style: TextButton.styleFrom(
                                  foregroundColor: AppColors.dangerCrimson),
                              child: const Text('Delete'),
                            ),
                          ],
                        ),
                      );

                      if (confirm == true) {
                        await ref
                            .read(firestoreServiceProvider)
                            .deleteMaintenanceBill(
                              societyId,
                              bill.id,
                            );
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
