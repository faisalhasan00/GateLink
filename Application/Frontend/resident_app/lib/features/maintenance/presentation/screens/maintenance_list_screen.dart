import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/maintenance_bill_model.dart';
import '../../domain/models/payment_status.dart';
import '../../providers/maintenance_providers.dart';
import 'pay_maintenance_screen.dart';
import '../widgets/payment_success_bottom_sheet.dart';

class MaintenanceListScreen extends ConsumerStatefulWidget {
  const MaintenanceListScreen({super.key});

  @override
  ConsumerState<MaintenanceListScreen> createState() =>
      _MaintenanceListScreenState();
}

class _MaintenanceListScreenState extends ConsumerState<MaintenanceListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final billsAsync = ref.watch(maintenanceBillsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Maintenance Bills'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [
            Tab(text: 'Pending'),
            Tab(text: 'Paid'),
          ],
        ),
      ),
      body: billsAsync.when(
        data: (bills) {
          final pending = bills.where((b) => !b.isPaid).toList();
          final paid = bills.where((b) => b.isPaid).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _BillsListView(bills: pending, isPaid: false, ref: ref),
              _BillsListView(bills: paid, isPaid: true, ref: ref),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _BillsListView extends StatelessWidget {
  final List<MaintenanceBillModel> bills;
  final bool isPaid;
  final WidgetRef ref;
  const _BillsListView(
      {required this.bills, required this.isPaid, required this.ref});

  @override
  Widget build(BuildContext context) {
    if (bills.isEmpty) {
      return Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(
              isPaid
                  ? Icons.check_circle_outline_rounded
                  : Icons.receipt_long_rounded,
              size: 56,
              color: AppColors.textDisabled),
          const SizedBox(height: AppSpacing.md),
          Text(
              isPaid
                  ? 'No paid bills recorded'
                  : 'No pending maintenance bills 🎉',
              style: const TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: AppSpacing.lg),
          if (kDebugMode && !isPaid)
            ElevatedButton.icon(
              onPressed: () async {
                try {
                  final user = ref.read(currentUserProvider);
                  final userProfile = ref.read(userProfileProvider).value;
                  final activeSocId =
                      userProfile?['societyId'] as String? ?? '';
                  final flatNum = userProfile?['flatNumber'] ?? 'A-101';
                  if (activeSocId.isEmpty || user == null) return;

                  await ref
                      .read(maintenanceControllerProvider.notifier)
                      .seedDemoBills(
                        societyId: activeSocId,
                        residentUid: user.uid,
                        flatNumber: flatNum,
                      );
                } catch (e) {
                  debugPrint('Seeding error: $e');
                }
              },
              icon: const Icon(Icons.receipt_rounded),
              label: const Text('Generate Sample Maintenance Bills'),
            ),
        ]),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: bills.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, index) {
        final bill = bills[index];
        return _BillCard(bill: bill, ref: ref);
      },
    );
  }
}

class _BillCard extends StatelessWidget {
  final MaintenanceBillModel bill;
  final WidgetRef ref;

  const _BillCard({
    required this.bill,
    required this.ref,
  });

  Color get _statusColor {
    switch (bill.status) {
      case PaymentStatus.paid:
        return AppColors.success;
      case PaymentStatus.overdue:
        return AppColors.error;
      case PaymentStatus.pendingVerification:
        return AppColors.warning;
      case PaymentStatus.pending:
      case PaymentStatus.unknown:
        return AppColors.warning;
    }
  }

  String get _statusLabel {
    return bill.status.displayName;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        side: const BorderSide(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(bill.month,
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary)),
                    const SizedBox(height: 2),
                    Text(bill.invoiceNumber,
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: _statusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: Text(
                    _statusLabel,
                    style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _statusColor),
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Due Date',
                        style: TextStyle(
                            fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 2),
                    Text(bill.dueDate,
                        style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text('Total Amount',
                        style: TextStyle(
                            fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 2),
                    Text('₹${bill.amount.toStringAsFixed(0)}',
                        style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),
            ExpansionTile(
              tilePadding: EdgeInsets.zero,
              title: const Text('View Charge Breakdown',
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary)),
              children: [
                _breakdownRow('Maintenance Charge', bill.maintenanceCharge),
                _breakdownRow('Water Supply Charge', bill.waterCharge),
                _breakdownRow('Parking Slot Fee', bill.parkingCharge),
                _breakdownRow('Sinking Fund', bill.sinkingFund),
                if (bill.penaltyFee > 0)
                  _breakdownRow('Late Payment Penalty', bill.penaltyFee,
                      isWarning: true),
              ],
            ),
            if (!bill.isPaid) ...[
              const SizedBox(height: AppSpacing.md),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => PayMaintenanceScreen(
                          billId: bill.id,
                          amount: bill.amount,
                          month: bill.month,
                          invoiceNumber: bill.invoiceNumber,
                          dueDate: bill.dueDate,
                          maintenanceCharge: bill.maintenanceCharge,
                          waterCharge: bill.waterCharge,
                          parkingCharge: bill.parkingCharge,
                          sinkingFund: bill.sinkingFund,
                          penaltyFee: bill.penaltyFee,
                        ),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md)),
                  ),
                  child: Text('Pay Now  •  ₹${bill.amount.toStringAsFixed(0)}'),
                ),
              ),
            ] else ...[
              const SizedBox(height: AppSpacing.md),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    final txnRef = (bill.utrNumber != null && bill.utrNumber!.isNotEmpty)
                        ? bill.utrNumber!
                        : (bill.transactionId ?? 'CF-PAY-OK');
                    PaymentSuccessBottomSheet.show(
                      context,
                      amount: bill.amount,
                      transactionId: txnRef,
                      invoiceNumber: bill.invoiceNumber,
                    );
                  },
                  icon: const Icon(Icons.receipt_long_rounded, size: 18),
                  label: const Text('View Tax Invoice & Receipt'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: const BorderSide(color: AppColors.primary),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _breakdownRow(String label, double amount, {bool isWarning = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(
                  fontSize: 13,
                  color:
                      isWarning ? AppColors.error : AppColors.textSecondary)),
          Text('₹${amount.toStringAsFixed(0)}',
              style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: isWarning ? AppColors.error : AppColors.textPrimary)),
        ],
      ),
    );
  }
}
