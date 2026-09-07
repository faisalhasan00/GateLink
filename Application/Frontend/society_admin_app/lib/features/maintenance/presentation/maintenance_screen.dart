import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/resident_model.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/state_views.dart';
import 'widgets/generate_bill_sheet.dart';
import 'widgets/maintenance_bill_item.dart';
import 'widgets/maintenance_summary_card.dart';
import 'widgets/record_payment_dialog.dart';

class MaintenanceScreen extends ConsumerStatefulWidget {
  const MaintenanceScreen({super.key});

  @override
  ConsumerState<MaintenanceScreen> createState() => _MaintenanceScreenState();
}

class _MaintenanceScreenState extends ConsumerState<MaintenanceScreen> {
  String _filterStatus = 'All'; // 'All' | 'pending' | 'paid'

  @override
  Widget build(BuildContext context) {
    final society = ref.watch(activeSocietyProvider);
    final billsAsync = ref.watch(maintenanceBillsStreamProvider);
    final residentsAsync = ref.watch(residentsStreamProvider);

    final residents = residentsAsync.maybeWhen(
      data: (list) => list,
      orElse: () => <ResidentModel>[],
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Maintenance & Invoicing'),
      ),
      floatingActionButton: society != null
          ? FloatingActionButton.extended(
              onPressed: () => GenerateBillBottomSheet.show(
                context,
                societyId: society.id,
                residents: residents,
              ),
              backgroundColor: AppColors.primaryNavy,
              icon: const Icon(Icons.receipt_long, color: Colors.white),
              label: const Text(
                'Generate Bill',
                style:
                    TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
              ),
            )
          : null,
      body: billsAsync.when(
        loading: () => const LoadingStateWidget(
            message: 'Loading maintenance ledgers...'),
        error: (err, _) => ErrorStateWidget(
          message: 'Failed to load maintenance bills: ${err.toString()}',
          onRetry: () => ref.invalidate(maintenanceBillsStreamProvider),
        ),
        data: (bills) {
          final validBills = bills;

          final totalBilled =
              validBills.fold(0.0, (sum, b) => sum + b.amount);
          final totalCollected = validBills
              .where((b) => b.status == 'paid')
              .fold(0.0, (sum, b) => sum + b.amount);
          final totalPending = totalBilled - totalCollected;

          final filteredBills = validBills.where((b) {
            if (_filterStatus == 'All') return true;
            return b.status == _filterStatus;
          }).toList();

          return SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 90),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                MaintenanceSummaryCard(
                  totalPending: totalPending,
                  totalCollected: totalCollected,
                  totalBilled: totalBilled,
                ),
                const SizedBox(height: 20),

                // Filter chips
                Row(
                  children: [
                    _filterChip('All (${validBills.length})', 'All'),
                    const SizedBox(width: 8),
                    _filterChip(
                        'Pending (${validBills.where((b) => b.status != 'paid').length})',
                        'pending'),
                    const SizedBox(width: 8),
                    _filterChip(
                        'Paid (${validBills.where((b) => b.status == 'paid').length})',
                        'paid'),
                  ],
                ),
                const SizedBox(height: 16),

                if (filteredBills.isEmpty)
                  const EmptyStateWidget(
                    title: 'No Invoices Found',
                    description:
                        'No maintenance invoices match the selected filter.',
                    icon: Icons.receipt_outlined,
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredBills.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final bill = filteredBills[index];
                      return MaintenanceBillItem(
                        bill: bill,
                        societyId: society!.id,
                        onMarkPaid: () {
                          RecordPaymentDialog.show(
                            context,
                            societyId: society.id,
                            bill: bill,
                          );
                        },
                      );
                    },
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _filterChip(String label, String value) {
    final isSelected = _filterStatus == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _filterStatus = value),
      selectedColor: AppColors.primaryNavy,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppColors.textPrimary,
        fontWeight: FontWeight.w600,
        fontSize: 12,
      ),
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
            color: isSelected ? AppColors.primaryNavy : AppColors.cardBorder),
      ),
    );
  }
}
