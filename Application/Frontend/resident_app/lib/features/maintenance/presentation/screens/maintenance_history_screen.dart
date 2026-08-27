import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/maintenance_providers.dart';
import 'tax_invoice_screen.dart';

class MaintenanceHistoryScreen extends ConsumerWidget {
  const MaintenanceHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final receiptsAsync = ref.watch(paymentReceiptsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Payment History')),
      backgroundColor: AppColors.background,
      body: receiptsAsync.when(
        data: (receipts) {
          if (receipts.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.receipt_long_rounded,
                      size: 56, color: AppColors.textDisabled),
                  const SizedBox(height: AppSpacing.md),
                  const Text('No payment history recorded yet',
                      style: TextStyle(color: AppColors.textSecondary)),
                ],
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: receipts.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, index) {
              final receipt = receipts[index];

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
                          child: const Icon(Icons.check_circle_rounded,
                              color: AppColors.success, size: 24),
                        ),
                        const SizedBox(width: AppSpacing.md),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(receipt.billingPeriod,
                                  style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.textPrimary)),
                              Text(
                                  'Paid on ${receipt.formattedDate}  •  ${receipt.paymentMethod}',
                                  style: const TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textSecondary)),
                            ],
                          ),
                        ),
                        Text('₹${receipt.amount.toStringAsFixed(0)}',
                            style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary)),
                      ],
                    ),
                    const Divider(height: 20),
                    Row(
                      children: [
                        const Text('Txn ID:',
                            style: TextStyle(
                                fontSize: 11, color: AppColors.textSecondary)),
                        const SizedBox(width: 6),
                        Text(receipt.transactionId,
                            style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textPrimary,
                                fontFamily: 'monospace')),
                        const Spacer(),
                        InkWell(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => TaxInvoiceScreen(
                                  amount: receipt.amount,
                                  transactionId: receipt.transactionId,
                                  invoiceNumber: receipt.invoiceNumber,
                                  billingPeriod: receipt.billingPeriod,
                                  paymentMethod: receipt.paymentMethod,
                                ),
                              ),
                            );
                          },
                          child: const Row(children: [
                            Icon(Icons.download_rounded,
                                size: 14, color: AppColors.primary),
                            SizedBox(width: 4),
                            Text('Receipt',
                                style: TextStyle(
                                    fontSize: 12,
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w500)),
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
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error loading history: $e')),
      ),
    );
  }
}
