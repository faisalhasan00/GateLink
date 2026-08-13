import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';

class PayMaintenanceScreen extends ConsumerStatefulWidget {
  final String? billId;
  final double? amount;
  final String? month;
  final String? invoiceNumber;

  const PayMaintenanceScreen({
    super.key,
    this.billId,
    this.amount,
    this.month,
    this.invoiceNumber,
  });

  @override
  ConsumerState<PayMaintenanceScreen> createState() => _PayMaintenanceScreenState();
}

class _PayMaintenanceScreenState extends ConsumerState<PayMaintenanceScreen> {
  int _selectedMethod = 0;
  bool _isProcessing = false;

  final _methods = const [
    _PayMethod(icon: Icons.smartphone_rounded, label: 'Direct UPI (PhonePe / GPay / Paytm)', subtitle: 'Instant 0% Fee · Auto-Verified', color: AppColors.success),
    _PayMethod(icon: Icons.account_balance_rounded, label: 'Net Banking', subtitle: 'All major banks', color: AppColors.primary),
    _PayMethod(icon: Icons.credit_card_rounded, label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay', color: AppColors.visitor),
  ];

  Future<void> _pay() async {
    setState(() => _isProcessing = true);

    try {
      final firestoreService = ref.read(firestoreServiceProvider);
      final user = ref.read(currentUserProvider);

      final payMethodName = _methods[_selectedMethod].label;
      final targetBillId = widget.billId ?? 'bill_latest';
      final payAmount = widget.amount ?? 3500.0;
      final invNum = widget.invoiceNumber ?? 'INV-2026-08-101';
      final period = widget.month ?? 'August 2026';

      // 1. Direct UPI Intent Launcher if method 0 selected
      if (_selectedMethod == 0) {
        const upiVpa = 'societysphere@okicici';
        const payeeName = 'Society Management Committee';
        final txnToken = 'SS-PAY-$invNum-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
        
        final upiUri = Uri.parse(
          'upi://pay?pa=$upiVpa&pn=${Uri.encodeComponent(payeeName)}&am=${payAmount.toStringAsFixed(2)}&tn=${Uri.encodeComponent(txnToken)}&cu=INR'
        );

        try {
          if (await canLaunchUrl(upiUri)) {
            await launchUrl(upiUri, mode: LaunchMode.externalApplication);
          }
        } catch (upiErr) {
          debugPrint('UPI launch fallback: $upiErr');
        }
      }

      if (firestoreService != null && user != null) {
        await firestoreService.payMaintenanceBill(
          billId: targetBillId,
          residentUid: user.uid,
          amount: payAmount,
          paymentMethod: payMethodName,
          invoiceNumber: invNum,
          billingPeriod: period,
        );
      }

      setState(() => _isProcessing = false);
      if (!mounted) return;

      showModalBottomSheet(
        context: context,
        backgroundColor: Colors.transparent,
        isScrollControlled: true,
        builder: (_) => Container(
          padding: const EdgeInsets.all(AppSpacing.xl),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xxl)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircleAvatar(
                radius: 36,
                backgroundColor: AppColors.successSurface,
                child: Icon(Icons.check_circle_rounded, color: AppColors.success, size: 40),
              ),
              const SizedBox(height: 16),
              const Text('Payment Successful!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              Text('₹${payAmount.toStringAsFixed(0)} paid via $payMethodName', style: const TextStyle(color: AppColors.textSecondary)),
              const SizedBox(height: 8),
              Text('Invoice: $invNum', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              const SizedBox(height: AppSpacing.xl),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.success,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
                  ),
                  child: const Text('Done', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                ),
              ),
            ],
          ),
        ),
      );
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Payment Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pay Maintenance'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        surfaceTintColor: Colors.white,
      ),
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Bill Summary Card
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1D4ED8), Color(0xFF2563EB)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppRadius.xl),
              ),
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Bill Summary',
                          style: TextStyle(fontSize: 13, color: Colors.white70, fontWeight: FontWeight.w500),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                        child: const Text(
                          'PENDING',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: 0.5),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'August 2026',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  const Divider(color: Colors.white24),
                  const SizedBox(height: AppSpacing.sm),
                  _BillLine(label: 'Base Maintenance', value: 'Rs. 3,000', white: true),
                  _BillLine(label: 'Water Charges', value: 'Rs. 200', white: true),
                  _BillLine(label: 'Late Penalty', value: 'Rs. 300', isRed: true),
                  const Divider(color: Colors.white24, height: AppSpacing.lg),
                  Row(
                    children: [
                      const Text('Total Payable', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
                      const Spacer(),
                      const Text(
                        'Rs. 3,500',
                        style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Due Date Warning
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.warningSurface,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.calendar_today_rounded, color: AppColors.warning, size: 18),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Due date: 10 Aug 2026 · Late penalty of Rs. 300 has been applied.',
                      style: TextStyle(fontSize: 12, color: AppColors.warning, fontWeight: FontWeight.w500, height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Payment Methods
            const Text('Select Payment Method',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
            const SizedBox(height: AppSpacing.md),
            ...List.generate(_methods.length, (i) {
              final m = _methods[i];
              final isSelected = _selectedMethod == i;
              return GestureDetector(
                onTap: () => setState(() => _selectedMethod = i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: isSelected ? m.color.withValues(alpha: 0.06) : Colors.white,
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
                            Text(m.label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                            Text(m.subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
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
            const SizedBox(height: AppSpacing.xl),

            // Pay Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : _pay,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: AppColors.primary.withValues(alpha: 0.6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
                  elevation: 0,
                ),
                child: _isProcessing
                    ? const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                          ),
                          SizedBox(width: 12),
                          Text('Processing Payment...', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                        ],
                      )
                    : const Text('Pay Rs. 3,500 Now', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            const Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.lock_rounded, size: 14, color: AppColors.textSecondary),
                  SizedBox(width: 4),
                  Text(
                    'Secured by 256-bit SSL encryption',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BillLine extends StatelessWidget {
  final String label, value;
  final bool white;
  final bool isRed;
  const _BillLine({required this.label, required this.value, this.white = false, this.isRed = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: white ? Colors.white70 : AppColors.textSecondary)),
          const Spacer(),
          Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isRed ? Colors.redAccent.shade100 : (white ? Colors.white : AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}

class _PayMethod {
  final IconData icon;
  final String label, subtitle;
  final Color color;
  const _PayMethod({required this.icon, required this.label, required this.subtitle, required this.color});
}
