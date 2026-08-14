import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class PaymentMethodItem {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;

  const PaymentMethodItem({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
  });
}

class PaymentMethodSelector extends StatelessWidget {
  final int selectedMethod;
  final ValueChanged<int> onMethodSelected;

  static const List<PaymentMethodItem> methods = [
    PaymentMethodItem(
      icon: Icons.payments_rounded,
      label: 'Option 1: Pay Online with Cashfree',
      subtitle:
          'UPI, Cards, NetBanking, Wallets · Automated Instant Verification',
      color: AppColors.primary,
    ),
    PaymentMethodItem(
      icon: Icons.account_balance_wallet_rounded,
      label: 'Option 2: Offline Payment',
      subtitle: 'Bank Transfer, Cash, or Cheque · Treasurer Verification',
      color: AppColors.success,
    ),
  ];

  const PaymentMethodSelector({
    super.key,
    required this.selectedMethod,
    required this.onMethodSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Select Payment Method',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        ...List.generate(methods.length, (i) {
          final m = methods[i];
          final isSelected = selectedMethod == i;
          return GestureDetector(
            onTap: () => onMethodSelected(i),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: AppSpacing.sm),
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color:
                    isSelected ? m.color.withValues(alpha: 0.06) : Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(
                  color: isSelected ? m.color : AppColors.border,
                  width: isSelected ? 1.5 : 1.0,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: m.color.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                    child: Icon(m.icon, color: m.color, size: 22),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          m.label,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        Text(
                          m.subtitle,
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isSelected ? m.color : AppColors.border,
                        width: isSelected ? 6 : 2,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}
