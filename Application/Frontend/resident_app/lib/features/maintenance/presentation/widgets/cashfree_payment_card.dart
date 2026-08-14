import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class CashfreePaymentCard extends StatelessWidget {
  final double totalAmount;
  final bool isProcessing;
  final VoidCallback onPayPressed;
  final VoidCallback? onVerifyPressed;
  final String? activeOrderId;

  const CashfreePaymentCard({
    super.key,
    required this.totalAmount,
    required this.isProcessing,
    required this.onPayPressed,
    this.onVerifyPressed,
    this.activeOrderId,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.shield_outlined, color: AppColors.primary, size: 22),
              SizedBox(width: 8),
              Text(
                'Cashfree Secure Payment Gateway',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Pay 100% securely using UPI (PhonePe/GPay/Paytm), Credit/Debit Cards, NetBanking, or Digital Wallets.',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              onPressed: isProcessing ? null : onPayPressed,
              icon: isProcessing
                  ? const SizedBox()
                  : const Icon(Icons.lock_outline_rounded, size: 18),
              label: isProcessing
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2.5,
                      ),
                    )
                  : Text(
                      'Proceed to Cashfree Checkout (₹${totalAmount.toStringAsFixed(0)})',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                ),
              ),
            ),
          ),
          if (activeOrderId != null && onVerifyPressed != null) ...[
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 44,
              child: OutlinedButton.icon(
                onPressed: isProcessing ? null : onVerifyPressed,
                icon: const Icon(Icons.sync_rounded, size: 16),
                label: const Text(
                  'Verify Payment Status',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.primary,
                  side: const BorderSide(color: AppColors.primary),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.xl),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
