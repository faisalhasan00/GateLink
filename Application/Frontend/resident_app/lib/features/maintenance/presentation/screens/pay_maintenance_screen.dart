import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
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
  final String? dueDate;
  final double? maintenanceCharge;
  final double? waterCharge;
  final double? parkingCharge;
  final double? sinkingFund;
  final double? penaltyFee;

  const PayMaintenanceScreen({
    super.key,
    this.billId,
    this.amount,
    this.month,
    this.invoiceNumber,
    this.dueDate,
    this.maintenanceCharge,
    this.waterCharge,
    this.parkingCharge,
    this.sinkingFund,
    this.penaltyFee,
  });

  @override
  ConsumerState<PayMaintenanceScreen> createState() => _PayMaintenanceScreenState();
}

class _PayMaintenanceScreenState extends ConsumerState<PayMaintenanceScreen> {
  int _selectedMethod = 0;
  bool _isProcessing = false;
  bool _upiAppLaunched = false;
  final TextEditingController _utrController = TextEditingController();

  final _methods = const [
    _PayMethod(icon: Icons.smartphone_rounded, label: 'Direct UPI (PhonePe / GPay / Paytm)', subtitle: 'Instant 0% Fee · Verified via UTR', color: AppColors.success),
    _PayMethod(icon: Icons.account_balance_rounded, label: 'Net Banking', subtitle: 'All major banks', color: AppColors.primary),
    _PayMethod(icon: Icons.credit_card_rounded, label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay', color: AppColors.visitor),
  ];

  @override
  void dispose() {
    _utrController.dispose();
    super.dispose();
  }

  Future<void> _launchUpiApp() async {
    final activeSocId = ref.read(userProfileProvider).value?['societyId'] as String? ?? 'SOC-001';
    final payAmount = widget.amount ?? 3500.0;
    final invNum = widget.invoiceNumber ?? 'INV-2026-08-101';

    String upiVpa = '8106342858@ybl';
    String payeeName = 'MOHAMMED FAISAL HASAN';

    try {
      final upiDoc = await FirebaseFirestore.instance
          .doc('societies/$activeSocId/config/upi')
          .get();
      if (upiDoc.exists && upiDoc.data() != null) {
        final data = upiDoc.data()!;
        if ((data['upiId'] as String?)?.isNotEmpty == true) {
          upiVpa = data['upiId'];
        }
        if ((data['payeeName'] as String?)?.isNotEmpty == true) {
          payeeName = data['payeeName'];
        }
      }
    } catch (e) {
      debugPrint('Config fetch fallback: $e');
    }

    final txnToken = 'SS-PAY-$invNum-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
    
    final upiUri = Uri.parse(
      'upi://pay?pa=$upiVpa&pn=${Uri.encodeComponent(payeeName)}&am=${payAmount.toStringAsFixed(2)}&tn=${Uri.encodeComponent(txnToken)}&cu=INR'
    );

    try {
      if (await canLaunchUrl(upiUri)) {
        await launchUrl(upiUri, mode: LaunchMode.externalApplication);
        setState(() {
          _upiAppLaunched = true;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No UPI apps (PhonePe/GPay) found on this device.'), backgroundColor: AppColors.error),
        );
      }
    } catch (upiErr) {
      debugPrint('UPI launch error: $upiErr');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not launch UPI app: $upiErr'), backgroundColor: AppColors.error),
      );
    }
  }

  Future<void> _verifyAndCompletePayment() async {
    final utrText = _utrController.text.trim();
    if (_selectedMethod == 0 && utrText.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter valid UPI UTR / Reference Number (at least 6 digits) from your PhonePe/GPay receipt.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isProcessing = true);

    try {
      final firestoreService = ref.read(firestoreServiceProvider);
      final user = ref.read(currentUserProvider);

      final payMethodName = _methods[_selectedMethod].label;
      final targetBillId = widget.billId ?? 'bill_latest';
      final payAmount = widget.amount ?? 3500.0;
      final invNum = widget.invoiceNumber ?? 'INV-2026-08-101';
      final period = widget.month ?? 'August 2026';
      final txnId = utrText.isNotEmpty ? utrText : 'TXN-${DateTime.now().millisecondsSinceEpoch}';

      if (firestoreService != null && user != null && widget.billId != null) {
        await firestoreService.payMaintenanceBill(
          billId: targetBillId,
          residentUid: user.uid,
          amount: payAmount,
          paymentMethod: payMethodName,
          invoiceNumber: invNum,
          billingPeriod: period,
        );

        // Update exact transaction ID / UTR in Firestore
        final activeSocId = ref.read(userProfileProvider).value?['societyId'] as String? ?? 'SOC-001';
        await FirebaseFirestore.instance
            .doc('societies/$activeSocId/maintenance_bills/$targetBillId')
            .update({
          'transactionId': txnId,
          'utrNumber': txnId,
          'status': 'paid',
        }).catchError((_) {});
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
              const Text('Payment Verified!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              Text('₹${payAmount.toStringAsFixed(0)} settled via $payMethodName', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13), textAlign: TextAlign.center),
              const SizedBox(height: 4),
              Text('Ref UTR: $txnId', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary)),
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
    final displayMonth = widget.month ?? 'August 2026';
    final totalAmount = widget.amount ?? 3500.0;
    final displayDueDate = widget.dueDate ?? '10 Aug 2026';
    final maintCharge = widget.maintenanceCharge ?? (totalAmount * 0.7);
    final waterCharge = widget.waterCharge ?? (totalAmount * 0.15);
    final parkingCharge = widget.parkingCharge ?? 0.0;
    final sinkingFund = widget.sinkingFund ?? 0.0;
    final penaltyFee = widget.penaltyFee ?? 0.0;

    return Scaffold(
      appBar: AppBar(
        title: Text('Pay Bill: ${widget.invoiceNumber ?? 'Invoice'}'),
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
                  Text(
                    displayMonth,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  const Divider(color: Colors.white24),
                  const SizedBox(height: AppSpacing.sm),
                  _BillLine(label: 'Base Maintenance', value: '₹${maintCharge.toStringAsFixed(0)}', white: true),
                  if (waterCharge > 0)
                    _BillLine(label: 'Water Supply', value: '₹${waterCharge.toStringAsFixed(0)}', white: true),
                  if (parkingCharge > 0)
                    _BillLine(label: 'Parking Slot', value: '₹${parkingCharge.toStringAsFixed(0)}', white: true),
                  if (sinkingFund > 0)
                    _BillLine(label: 'Sinking Fund', value: '₹${sinkingFund.toStringAsFixed(0)}', white: true),
                  if (penaltyFee > 0)
                    _BillLine(label: 'Late Penalty', value: '₹${penaltyFee.toStringAsFixed(0)}', isRed: true),
                  const Divider(color: Colors.white24, height: AppSpacing.lg),
                  Row(
                    children: [
                      const Text('Total Payable', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
                      const Spacer(),
                      Text(
                        '₹${totalAmount.toStringAsFixed(0)}',
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
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
              child: Row(
                children: [
                  const Icon(Icons.calendar_today_rounded, color: AppColors.warning, size: 18),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Due date: $displayDueDate${penaltyFee > 0 ? ' · Late penalty has been applied.' : ''}',
                      style: const TextStyle(fontSize: 12, color: AppColors.warning, fontWeight: FontWeight.w500, height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // UTR Verification Card (Visible after UPI App Launched)
            if (_upiAppLaunched && _selectedMethod == 0) ...[
              Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.successSurface,
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                  border: Border.all(color: AppColors.success),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.mark_email_read_rounded, color: AppColors.success, size: 20),
                        SizedBox(width: 8),
                        Text('UPI App Launched!', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.success)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Complete your payment in PhonePe/GPay, then enter the 12-Digit UTR / Ref Number from your receipt below to verify:',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    TextField(
                      controller: _utrController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        hintText: 'Enter 12-Digit UTR (e.g. 423456789012)',
                        prefixIcon: const Icon(Icons.pin_rounded, color: AppColors.success),
                        fillColor: Colors.white,
                        filled: true,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg), borderSide: const BorderSide(color: AppColors.success)),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _upiAppLaunched = false;
                                _utrController.clear();
                              });
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Payment cancelled. Bill remains unpaid.'), backgroundColor: AppColors.warning),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.error,
                              side: const BorderSide(color: AppColors.error),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                            ),
                            child: const Text('Payment Declined / Cancelled', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _isProcessing ? null : _verifyAndCompletePayment,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.success,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                            ),
                            child: const Text('Verify & Submit UTR', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
            ],

            // Payment Methods Selection
            const Text('Select Payment Method',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
            const SizedBox(height: AppSpacing.md),
            ...List.generate(_methods.length, (i) {
              final m = _methods[i];
              final isSelected = _selectedMethod == i;
              return GestureDetector(
                onTap: () => setState(() {
                  _selectedMethod = i;
                  _upiAppLaunched = false;
                }),
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
            if (!_upiAppLaunched)
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isProcessing
                      ? null
                      : (_selectedMethod == 0 ? _launchUpiApp : _verifyAndCompletePayment),
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
                            Text('Processing...', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                          ],
                        )
                      : Text(
                          _selectedMethod == 0
                              ? 'Launch PhonePe / GPay (₹${totalAmount.toStringAsFixed(0)})'
                              : 'Pay ₹${totalAmount.toStringAsFixed(0)} Now',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                        ),
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
