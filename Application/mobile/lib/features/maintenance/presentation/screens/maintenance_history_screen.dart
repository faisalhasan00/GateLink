import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class MaintenanceHistoryScreen extends StatelessWidget {
  const MaintenanceHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final history = [
      _Payment(month: 'June 2026', amount: 'Rs. 3,500', date: '08 Jun 2026', txnId: 'TXN202606081234'),
      _Payment(month: 'May 2026', amount: 'Rs. 3,500', date: '05 May 2026', txnId: 'TXN202605051100'),
      _Payment(month: 'April 2026', amount: 'Rs. 3,200', date: '10 Apr 2026', txnId: 'TXN202604100987'),
      _Payment(month: 'March 2026', amount: 'Rs. 3,500', date: '07 Mar 2026', txnId: 'TXN202603070456'),
      _Payment(month: 'February 2026', amount: 'Rs. 3,500', date: '09 Feb 2026', txnId: 'TXN202602090312'),
      _Payment(month: 'January 2026', amount: 'Rs. 3,000', date: '10 Jan 2026', txnId: 'TXN202601100201'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Payment History')),
      backgroundColor: AppColors.background,
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        itemCount: history.length,
        separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
        itemBuilder: (context, index) {
          final p = history[index];
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
                      width: 44, height: 44,
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
                          Text(p.month, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                          Text('Paid on ${p.date}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                    Text(p.amount, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  children: [
                    const Text('Txn ID:', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                    const SizedBox(width: 6),
                    Text(p.txnId, style: const TextStyle(fontSize: 11, color: AppColors.textPrimary, fontFamily: 'monospace')),
                    const Spacer(),
                    GestureDetector(
                      onTap: () {},
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
      ),
    );
  }
}

class _Payment {
  final String month, amount, date, txnId;
  const _Payment({required this.month, required this.amount, required this.date, required this.txnId});
}
