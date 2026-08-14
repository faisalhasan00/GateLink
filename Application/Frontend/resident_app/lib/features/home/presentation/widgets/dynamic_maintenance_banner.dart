import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../maintenance/presentation/screens/pay_maintenance_screen.dart';

class DynamicMaintenanceBanner extends ConsumerWidget {
  const DynamicMaintenanceBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final billsAsync = ref.watch(maintenanceBillsStreamProvider);

    return billsAsync.when(
      data: (bills) {
        final pendingBills = bills.where((b) => !b.isPaid).toList();

        if (pendingBills.isEmpty) {
          return Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              borderRadius: BorderRadius.circular(AppRadius.xl),
              border: Border.all(color: const Color(0xFFA7F3D0)),
            ),
            child: const Row(
              children: [
                Icon(Icons.check_circle_rounded,
                    color: Color(0xFF059669), size: 32),
                SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('No Pending Dues',
                          style: TextStyle(
                              color: Color(0xFF065F46),
                              fontSize: 15,
                              fontWeight: FontWeight.w700)),
                      Text('All maintenance bills are paid up to date!',
                          style: TextStyle(
                              color: Color(0xFF047857), fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          );
        }

        final firstBill = pendingBills.first;
        final amount = firstBill.amount;
        final dueDateStr =
            firstBill.dueDate.isNotEmpty ? firstBill.dueDate : firstBill.month;

        return Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1E40AF), Color(0xFF3B82F6)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppRadius.xl),
          ),
          child: Row(
            children: [
              const Icon(Icons.receipt_long_rounded,
                  color: Colors.white, size: 36),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Pending Maintenance',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    Text(
                      '₹ ${amount.toString()}',
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.w700),
                    ),
                    Text(
                      'Due: $dueDateStr',
                      style:
                          const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PayMaintenanceScreen(
                        billId: firstBill.id,
                        amount: firstBill.amount,
                        month: firstBill.month,
                        invoiceNumber: firstBill.invoiceNumber,
                        dueDate: firstBill.dueDate,
                        maintenanceCharge: firstBill.maintenanceCharge,
                        waterCharge: firstBill.waterCharge,
                        parkingCharge: firstBill.parkingCharge,
                        sinkingFund: firstBill.sinkingFund,
                        penaltyFee: firstBill.penaltyFee,
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppColors.primary,
                  minimumSize: const Size(80, 36),
                  textStyle: const TextStyle(
                      fontSize: 13, fontWeight: FontWeight.w700),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                ),
                child: const Text('Pay Now'),
              ),
            ],
          ),
        );
      },
      loading: () => const _SkeletonBanner(),
      error: (err, stack) => const SizedBox.shrink(),
    );
  }
}

class _SkeletonBanner extends StatelessWidget {
  const _SkeletonBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(AppRadius.xl),
      ),
    );
  }
}
