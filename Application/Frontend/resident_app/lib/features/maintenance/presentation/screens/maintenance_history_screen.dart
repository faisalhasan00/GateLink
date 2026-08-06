import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';

class MaintenanceHistoryScreen extends ConsumerWidget {
  const MaintenanceHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final firestoreService = ref.watch(firestoreServiceProvider);

    if (user == null || firestoreService == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Payment History')),
        body: const Center(child: Text('Please log in to view payment history.')),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Payment History')),
      backgroundColor: AppColors.background,
      body: StreamBuilder(
        stream: firestoreService.paymentReceiptsStream(user.uid),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error loading history: ${snapshot.error}'));
          }

          final docs = snapshot.data?.docs ?? [];
          if (docs.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.receipt_long_rounded, size: 56, color: AppColors.textDisabled),
                  const SizedBox(height: AppSpacing.md),
                  const Text('No payment history recorded yet', style: TextStyle(color: AppColors.textSecondary)),
                ],
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: docs.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, index) {
              final data = docs[index].data() as Map<String, dynamic>;
              final period = data['billingPeriod'] ?? 'Monthly Maintenance';
              final amount = (data['amount'] ?? 0.0).toDouble();
              final paidAt = data['paidAt'] ?? data['createdAt'] ?? '';
              final txnId = data['transactionId'] ?? 'TXN000000';
              final invoiceNum = data['invoiceNumber'] ?? 'INV-001';
              final payMethod = data['paymentMethod'] ?? 'UPI';

              final dateStr = paidAt.length >= 10 ? paidAt.substring(0, 10) : paidAt;

              return Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppColors.successSurface,
                            borderRadius: BorderRadius.circular(AppRadius.md),
                          ),
                          child: const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 24),
                        ),
                        const SizedBox(width: AppSpacing.md),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(period, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                              Text('Paid on $dateStr  •  $payMethod', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                            ],
                          ),
                        ),
                        Text('₹${amount.toStringAsFixed(0)}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                      ],
                    ),
                    const Divider(height: 20),
                    Row(
                      children: [
                        const Text('Txn ID:', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        const SizedBox(width: 6),
                        Text(txnId, style: const TextStyle(fontSize: 11, color: AppColors.textPrimary, fontFamily: 'monospace')),
                        const Spacer(),
                        GestureDetector(
                          onTap: () {
                            showDialog(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: const Text('Digital Receipt'),
                                content: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Invoice #: $invoiceNum', style: const TextStyle(fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 4),
                                    Text('Billing Period: $period'),
                                    Text('Amount Paid: ₹${amount.toStringAsFixed(0)}'),
                                    Text('Payment Method: $payMethod'),
                                    Text('Transaction ID: $txnId'),
                                    Text('Timestamp: $dateStr'),
                                    const Divider(height: 16),
                                    const Text('Authorized by SocietySphere System', style: TextStyle(fontSize: 11, color: AppColors.textSecondary, fontStyle: FontStyle.italic)),
                                  ],
                                ),
                                actions: [
                                  TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close')),
                                ],
                              ),
                            );
                          },
                          child: const Row(children: [
                            Icon(Icons.download_rounded, size: 14, color: AppColors.primary),
                            SizedBox(width: 4),
                            Text('Receipt', style: TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w500)),
                          ]),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
