import 'package:flutter/material.dart';
import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../providers/maintenance_providers.dart';

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
  bool _isLoadingBill = false;
  bool _upiAppLaunched = false;
  final TextEditingController _utrController = TextEditingController();

  String? _effectiveBillId;
  double? _effectiveAmount;
  String? _effectiveMonth;
  String? _effectiveInvoiceNumber;
  String? _effectiveDueDate;
  double? _effectiveMaintCharge;
  double? _effectiveWaterCharge;
  double? _effectiveParkingCharge;
  double? _effectiveSinkingFund;
  double? _effectivePenaltyFee;

  final _methods = const [
    _PayMethod(
      icon: Icons.payments_rounded,
      label: 'Option 1: Pay Online with Cashfree',
      subtitle: 'UPI, Cards, NetBanking, Wallets · Automated Instant Verification',
      color: AppColors.primary,
    ),
    _PayMethod(
      icon: Icons.account_balance_wallet_rounded,
      label: 'Option 2: Offline Payment',
      subtitle: 'Bank Transfer, Cash, or Cheque · Treasurer Verification',
      color: AppColors.success,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _initBillData();
  }

  Future<void> _initBillData() async {
    if (widget.billId != null) {
      setState(() {
        _effectiveBillId = widget.billId;
        _effectiveAmount = widget.amount ?? 3500.0;
        _effectiveMonth = widget.month ?? 'August 2026';
        _effectiveInvoiceNumber = widget.invoiceNumber ?? 'INV-2026-9305';
        _effectiveDueDate = widget.dueDate ?? '10 Aug 2026';
        _effectiveMaintCharge = widget.maintenanceCharge ?? 2500.0;
        _effectiveWaterCharge = widget.waterCharge ?? 400.0;
        _effectiveParkingCharge = widget.parkingCharge ?? 400.0;
        _effectiveSinkingFund = widget.sinkingFund ?? 200.0;
        _effectivePenaltyFee = widget.penaltyFee ?? 0.0;
      });
      return;
    }

    setState(() => _isLoadingBill = true);

    try {
      final user = ref.read(currentUserProvider);
      final activeSocId = ref.read(userProfileProvider).value?['societyId'] as String? ?? 'SOC-001';

      if (user != null) {
        final repo = ref.read(maintenanceRepositoryProvider);
        final pendingBill = await repo.getPendingBill(user.uid);

        if (pendingBill != null) {
          setState(() {
            _effectiveBillId = pendingBill.id;
            _effectiveAmount = pendingBill.amount;
            _effectiveMonth = pendingBill.month;
            _effectiveInvoiceNumber = pendingBill.invoiceNumber;
            _effectiveDueDate = pendingBill.dueDate;
            _effectiveMaintCharge = pendingBill.maintenanceCharge;
            _effectiveWaterCharge = pendingBill.waterCharge;
            _effectiveParkingCharge = pendingBill.parkingCharge;
            _effectiveSinkingFund = pendingBill.sinkingFund;
            _effectivePenaltyFee = pendingBill.penaltyFee;
          });
        } else {
          // Seed initial bill via controller if none found
          final userProfile = ref.read(userProfileProvider).value;
          final flatNum = userProfile?['flatNumber'] ?? 'A-101';
          await ref.read(maintenanceControllerProvider.notifier).seedDemoBills(
            societyId: activeSocId,
            residentUid: user.uid,
            flatNumber: flatNum,
          );
          final newlyCreated = await repo.getPendingBill(user.uid);
          if (newlyCreated != null) {
            setState(() {
              _effectiveBillId = newlyCreated.id;
              _effectiveAmount = newlyCreated.amount;
              _effectiveMonth = newlyCreated.month;
              _effectiveInvoiceNumber = newlyCreated.invoiceNumber;
              _effectiveDueDate = newlyCreated.dueDate;
              _effectiveMaintCharge = newlyCreated.maintenanceCharge;
              _effectiveWaterCharge = newlyCreated.waterCharge;
              _effectiveParkingCharge = newlyCreated.parkingCharge;
              _effectiveSinkingFund = newlyCreated.sinkingFund;
              _effectivePenaltyFee = newlyCreated.penaltyFee;
            });
          }
        }
      }
    } catch (e) {
      debugPrint('Auto-fetch bill error: $e');
    } finally {
      if (mounted) setState(() => _isLoadingBill = false);
    }
  }

  @override
  void dispose() {
    _utrController.dispose();
    super.dispose();
  }

  Future<void> _payWithCashfree() async {
    setState(() => _isProcessing = true);
    try {
      final user = ref.read(currentUserProvider);
      final userProfile = ref.read(userProfileProvider).value;
      final activeSocId = userProfile?['societyId'] as String? ?? 'SOC-001';
      final targetBillId = _effectiveBillId ?? widget.billId ?? 'bill_latest';
      final payAmount = _effectiveAmount ?? widget.amount ?? 3500.0;
      final invNum = _effectiveInvoiceNumber ?? widget.invoiceNumber ?? 'INV-2026-9305';

      if (user == null) throw Exception('User not logged in');

      final internalPaymentId = 'PAY-${DateTime.now().millisecondsSinceEpoch}-${Random().nextInt(9000) + 1000}';
      final orderId = 'order_${DateTime.now().millisecondsSinceEpoch}_${targetBillId.substring(0, 6)}';

      await ref.read(maintenanceRepositoryProvider).createPendingPaymentRecord(
        internalPaymentId: internalPaymentId,
        orderId: orderId,
        societyId: activeSocId,
        billId: targetBillId,
        residentUid: user.uid,
        flatNumber: userProfile?['flatNumber'] ?? 'A-101',
        amount: payAmount,
      );

      // Launch Cashfree Web Checkout Session
      final cfCheckoutUrl = Uri.parse('https://payments-sandbox.cashfree.com/order/#$orderId');
      try {
        await launchUrl(cfCheckoutUrl, mode: LaunchMode.externalApplication);
      } catch (launchErr) {
        debugPrint('Direct URL launch fallback error: $launchErr');
      }

      setState(() => _isProcessing = false);
      if (!mounted) return;

      // Listen for Real-Time Payment Success from Webhook
      _listenForPaymentCompletion(activeSocId, targetBillId, invNum, payAmount);
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Cashfree Payment Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  void _listenForPaymentCompletion(String societyId, String billId, String invNum, double amount) {
    FirebaseFirestore.instance
        .doc('societies/$societyId/maintenance_bills/$billId')
        .snapshots()
        .listen((snapshot) {
      if (snapshot.exists && snapshot.data()?['status'] == 'paid' && mounted) {
        final txnId = snapshot.data()?['transactionId'] ?? 'CF-PAID-OK';
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
                const Text('Payment Verified & Paid!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                const SizedBox(height: 8),
                Text('₹${amount.toStringAsFixed(0)} verified via Cashfree Online Gateway', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13), textAlign: TextAlign.center),
                const SizedBox(height: 4),
                Text('Cashfree Ref: $txnId', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary)),
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
                    child: const Text('Done & View Receipt', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                  ),
                ),
              ],
            ),
          ),
        );
      }
    });
  }

  Future<void> _verifyAndCompletePayment() async {
    if (_selectedMethod == 0) {
      await _payWithCashfree();
      return;
    }

    final utrText = _utrController.text.trim();
    if (utrText.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter UTR / Transaction Reference Number from your receipt.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isProcessing = true);

    try {
      final user = ref.read(currentUserProvider);
      final userProfile = ref.read(userProfileProvider).value;

      final targetBillId = _effectiveBillId ?? widget.billId ?? 'bill_latest';
      final invNum = _effectiveInvoiceNumber ?? widget.invoiceNumber ?? 'INV-2026-9305';
      final activeSocId = userProfile?['societyId'] as String? ?? 'SOC-001';
      final residentName = userProfile?['name'] ?? user?.displayName ?? 'Flat Owner';
      final flatNumber = userProfile?['flatNumber'] ?? 'A-101';

      if (user != null) {
        final success = await ref.read(maintenanceControllerProvider.notifier).submitOfflinePayment(
          societyId: activeSocId,
          billId: targetBillId,
          residentUid: user.uid,
          referenceNumber: utrText,
          residentName: residentName,
          flatNumber: flatNumber,
          invoiceNumber: invNum,
        );
        if (!success) {
          setState(() => _isProcessing = false);
          if (mounted) {
            final errorMsg = ref.read(maintenanceControllerProvider).errorMessage ?? 'Offline payment submission failed.';
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(errorMsg), backgroundColor: AppColors.error),
            );
          }
          return;
        }
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
                backgroundColor: Color(0xFFFEF3C7),
                child: Icon(Icons.hourglass_top_rounded, color: AppColors.warning, size: 40),
              ),
              const SizedBox(height: 16),
              const Text('Submitted for Treasurer Verification!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary), textAlign: TextAlign.center),
              const SizedBox(height: 8),
              Text(
                'Your reference: $utrText for $invNum has been sent to Society Management.',
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: AppColors.warningSurface, borderRadius: BorderRadius.circular(AppRadius.full)),
                child: const Text('Status: Pending Admin Approval', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.warning)),
              ),
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
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
                  ),
                  child: const Text('Understand & Close', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
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
          SnackBar(content: Text('Submission Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoadingBill) {
      return Scaffold(
        appBar: AppBar(title: const Text('Pay Maintenance'), backgroundColor: Colors.white, foregroundColor: AppColors.textPrimary),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final displayMonth = _effectiveMonth ?? widget.month ?? 'August 2026';
    final totalAmount = _effectiveAmount ?? widget.amount ?? 3500.0;
    final displayDueDate = _effectiveDueDate ?? widget.dueDate ?? '10 Aug 2026';
    final invNumber = _effectiveInvoiceNumber ?? widget.invoiceNumber ?? 'Invoice';
    final maintCharge = _effectiveMaintCharge ?? widget.maintenanceCharge ?? 2500.0;
    final waterCharge = _effectiveWaterCharge ?? widget.waterCharge ?? 400.0;
    final parkingCharge = _effectiveParkingCharge ?? widget.parkingCharge ?? 0.0;
    final sinkingFund = _effectiveSinkingFund ?? widget.sinkingFund ?? 0.0;
    final penaltyFee = _effectivePenaltyFee ?? widget.penaltyFee ?? 0.0;

    return Scaffold(
      appBar: AppBar(
        title: Text('Pay Bill: $invNumber'),
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
                            Text(m.label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                            Text(m.subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
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
            const SizedBox(height: AppSpacing.lg),

            // Method 0: Option 1 (Pay Online with Cashfree)
            if (_selectedMethod == 0) ...[
              Container(
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
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Pay 100% securely using UPI (PhonePe/GPay/Paytm), Credit/Debit Cards, NetBanking, or Digital Wallets.',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        onPressed: _isProcessing ? null : _verifyAndCompletePayment,
                        icon: _isProcessing ? const SizedBox() : const Icon(Icons.lock_outline_rounded, size: 18),
                        label: _isProcessing
                            ? const CircularProgressIndicator(color: Colors.white)
                            : Text('Proceed to Cashfree Checkout (₹${totalAmount.toStringAsFixed(0)})', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
            ],

            // Method 1: Option 2 (Offline Payment - Bank Transfer / Cash / Cheque)
            if (_selectedMethod == 1) ...[
              Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                  border: Border.all(color: AppColors.success.withValues(alpha: 0.3)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.success.withValues(alpha: 0.05),
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
                        Icon(Icons.account_balance_rounded, color: AppColors.success, size: 22),
                        SizedBox(width: 8),
                        Text(
                          'Offline Payment Submission',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Enter your payment reference details (UTR / Cheque / Bank Ref) for Treasurer verification:',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    TextField(
                      controller: _utrController,
                      keyboardType: TextInputType.text,
                      decoration: InputDecoration(
                        hintText: 'UTR / Transaction Reference Number',
                        prefixIcon: const Icon(Icons.pin_rounded, color: AppColors.success),
                        fillColor: AppColors.background,
                        filled: true,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg), borderSide: const BorderSide(color: AppColors.border)),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _isProcessing ? null : _verifyAndCompletePayment,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.success,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
                        ),
                        child: _isProcessing
                            ? const CircularProgressIndicator(color: Colors.white)
                            : const Text('Submit Reference for Treasurer Verification', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
            ],

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
