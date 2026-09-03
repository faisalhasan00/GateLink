import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';
import '../../../maintenance/presentation/screens/pay_maintenance_screen.dart';

class DynamicMaintenanceBanner extends ConsumerWidget {
  const DynamicMaintenanceBanner({super.key});

  String _getNextBillDate() {
    final now = DateTime.now();
    final nextMonth = DateTime(now.year, now.month + 1, 1);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[nextMonth.month - 1]} 1';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final billsAsync = ref.watch(maintenanceBillsStreamProvider);
    final complaintsAsync = ref.watch(myComplaintsStreamProvider);
    final visitorsAsync = ref.watch(visitorsStreamProvider);
    final profile = ref.watch(userProfileProvider).value;

    return billsAsync.when(
      data: (bills) {
        final pendingBills = bills.where((b) => !b.isPaid).toList();

        // ── STATE 1: ALL DUES PAID (MATCHING EXACT CARD DESIGN) ───────────────
        if (pendingBills.isEmpty) {

          final openComplaintsCount = (complaintsAsync.value ?? [])
              .where((c) =>
                  c.status.toLowerCase() != 'resolved' &&
                  c.status.toLowerCase() != 'closed')
              .length;

          final allVisitors = visitorsAsync.value ?? [];
          final flat = profile?.displayFlatNumber ?? '';
          final now = DateTime.now();

          final todayVisitorsCount = allVisitors.where((v) {
            final matchFlat = flat.isNotEmpty && v.hostFlat.contains(flat);
            if (!matchFlat) return false;
            final timeStr = v.entryTime ?? v.createdAt;
            if (timeStr == null || timeStr.isEmpty) return false;
            try {
              final dt = DateTime.parse(timeStr);
              return dt.year == now.year &&
                  dt.month == now.month &&
                  dt.day == now.day;
            } catch (_) {
              return false;
            }
          }).length;

          final nextBillDate = _getNextBillDate();

          return Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.card),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.card),
              child: IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Left Accent Indicator Strip with Dots
                    Container(
                      width: 32,
                      decoration: const BoxDecoration(
                        color: Color(0xFF0D9488), // Teal / Emerald
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            width: 4,
                            height: 4,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.6),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Main Card Content
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Header Row: Checkmark + All dues paid
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(2),
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF0D9488),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.check,
                                    color: Colors.white,
                                    size: 14,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Text(
                                  'All dues paid',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF0F172A),
                                    letterSpacing: -0.2,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            const Padding(
                              padding: EdgeInsets.only(left: 24),
                              child: Text(
                                'Nothing pending as of today',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            const Divider(
                              height: 1,
                              thickness: 1,
                              color: Color(0xFFF1F5F9),
                            ),
                            const SizedBox(height: 10),

                            // Dynamic Metrics Row (NEXT BILL | OPEN COMPLAINTS | VISITORS TODAY)
                            Row(
                              children: [
                                // Next Bill
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'NEXT BILL',
                                        style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF64748B),
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        nextBillDate,
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF0F172A),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Open Complaints
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'OPEN\nCOMPLAINTS',
                                        style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF64748B),
                                          letterSpacing: 0.5,
                                          height: 1.1,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        '$openComplaintsCount',
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF0F172A),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Visitors Today
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'VISITORS\nTODAY',
                                        style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF64748B),
                                          letterSpacing: 0.5,
                                          height: 1.1,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        '$todayVisitorsCount',
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF0F172A),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        // ── STATE 2: PENDING MAINTENANCE BILL TO PAY ─────────────────────────
        final firstBill = pendingBills.first;
        final amount = firstBill.amount;
        final dueDateStr =
            firstBill.dueDate.isNotEmpty ? firstBill.dueDate : firstBill.month;

        return Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.primaryLight],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppRadius.card),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.25),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
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
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                ),
                child: const Text('Pay Now'),
              ),
            ],
          ),
        );
      },
      loading: () => AppSkeleton.maintenanceBanner(),
      error: (err, stack) => const SizedBox.shrink(),
    );
  }
}
