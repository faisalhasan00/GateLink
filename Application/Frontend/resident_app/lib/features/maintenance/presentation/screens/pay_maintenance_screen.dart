import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
    _PayMethod(icon: Icons.smartphone_rounded, label: 'Direct UPI (PhonePe / GPay / Paytm)', subtitle: 'Instant 0% Fee · Verified via UTR', color: AppColors.success),
    _PayMethod(icon: Icons.account_balance_rounded, label: 'Net Banking', subtitle: 'All major banks', color: AppColors.primary),
    _PayMethod(icon: Icons.credit_card_rounded, label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay', color: AppColors.visitor),
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
        final snap = await FirebaseFirestore.instance
            .collection('societies/$activeSocId/maintenance_bills')
            .where('residentUid', isEqualTo: user.uid)
            .get();

        final pendingDocs = snap.docs.where((d) => (d.data()['status'] ?? '') != 'paid').toList();

        if (pendingDocs.isNotEmpty) {
          final first = pendingDocs.first;
          final d = first.data();
          setState(() {
            _effectiveBillId = first.id;
            _effectiveAmount = (d['amount'] ?? 3500.0).toDouble();
            _effectiveMonth = d['month'] ?? 'August 2026';
            _effectiveInvoiceNumber = d['invoiceNumber'] ?? d['billNumber'] ?? 'INV-${first.id.substring(0, 6)}';
            _effectiveDueDate = d['dueDate'] ?? '10 Aug 2026';
            _effectiveMaintCharge = (d['maintenanceCharge'] ?? d['maintenanceCharges'] ?? 2500.0).toDouble();
            _effectiveWaterCharge = (d['waterCharge'] ?? d['waterCharges'] ?? 400.0).toDouble();
            _effectiveParkingCharge = (d['parkingCharge'] ?? 400.0).toDouble();
            _effectiveSinkingFund = (d['sinkingFund'] ?? 200.0).toDouble();
            _effectivePenaltyFee = (d['penaltyFee'] ?? d['lateFee'] ?? 0.0).toDouble();
          });
        } else {
          // Auto-generate a pending bill doc in Firestore if none found
          final newRef = FirebaseFirestore.instance.collection('societies/$activeSocId/maintenance_bills').doc();
          final invNum = 'INV-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
          final newBill = {
            'month': 'August 2026',
            'invoiceNumber': invNum,
            'amount': 3500.0,
            'maintenanceCharge': 2500.0,
            'waterCharge': 400.0,
            'parkingCharge': 400.0,
            'sinkingFund': 200.0,
            'penaltyFee': 0.0,
            'dueDate': '10 Aug 2026',
            'status': 'pending',
            'residentUid': user.uid,
            'societyId': activeSocId,
            'createdAt': DateTime.now().toIso8601String(),
          };

          await newRef.set(newBill);

          setState(() {
            _effectiveBillId = newRef.id;
            _effectiveAmount = 3500.0;
            _effectiveMonth = 'August 2026';
            _effectiveInvoiceNumber = invNum;
            _effectiveDueDate = '10 Aug 2026';
            _effectiveMaintCharge = 2500.0;
            _effectiveWaterCharge = 400.0;
            _effectiveParkingCharge = 400.0;
            _effectiveSinkingFund = 200.0;
            _effectivePenaltyFee = 0.0;
          });
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

  Future<void> _launchUpiApp() async {
    final activeSocId = ref.read(userProfileProvider).value?['societyId'] as String? ?? 'SOC-001';
    final payAmount = _effectiveAmount ?? widget.amount ?? 3500.0;

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

    // Standard NPCI Intent Format without custom transaction notes that trigger bank risk blocks
    final upiUri = Uri.parse(
      'upi://pay?pa=$upiVpa&pn=${Uri.encodeComponent(payeeName)}&am=${payAmount.toStringAsFixed(2)}&cu=INR'
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
          content: Text('Please enter valid 12-digit UPI UTR / Reference Number from your receipt.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isProcessing = true);

    try {
      final user = ref.read(currentUserProvider);
      final userProfile = ref.read(userProfileProvider).value;

      final payMethodName = _methods[_selectedMethod].label;
      final targetBillId = _effectiveBillId ?? widget.billId ?? 'bill_latest';
      final payAmount = _effectiveAmount ?? widget.amount ?? 3500.0;
      final invNum = _effectiveInvoiceNumber ?? widget.invoiceNumber ?? 'INV-2026-9305';
      final period = _effectiveMonth ?? widget.month ?? 'August 2026';
      final txnId = utrText.isNotEmpty ? utrText : 'TXN-${DateTime.now().millisecondsSinceEpoch}';
      final activeSocId = userProfile?['societyId'] as String? ?? 'SOC-001';
      final residentName = userProfile?['name'] ?? user?.displayName ?? 'Flat Owner';
      final flatNumber = userProfile?['flatNumber'] ?? 'A-101';

      if (user != null) {
        // Update bill status to pending_verification (Requires Treasurer Approval)
        await FirebaseFirestore.instance
            .doc('societies/$activeSocId/maintenance_bills/$targetBillId')
            .set({
          'status': 'pending_verification',
          'utrNumber': txnId,
          'transactionId': txnId,
          'paymentMethod': payMethodName,
          'submittedAt': DateTime.now().toIso8601String(),
          'amount': payAmount,
          'invoiceNumber': invNum,
          'billingPeriod': period,
          'residentUid': user.uid,
          'residentName': residentName,
          'flatNumber': flatNumber,
        }, SetOptions(merge: true));

        // Create Admin Pending Verification Alert Notification
        await FirebaseFirestore.instance
            .collection('societies/$activeSocId/notifications')
            .add({
          'title': 'New UTR Payment Submitted',
          'body': 'Flat $flatNumber ($residentName) submitted UTR $txnId for Bill $invNum (₹$payAmount). Verification required.',
          'type': 'billing_verification',
          'billId': targetBillId,
          'utrNumber': txnId,
          'createdAt': DateTime.now().toIso8601String(),
          'isRead': false,
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
                backgroundColor: Color(0xFFFEF3C7),
                child: Icon(Icons.hourglass_top_rounded, color: AppColors.warning, size: 40),
              ),
              const SizedBox(height: 16),
              const Text('UTR Submitted for Verification!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary), textAlign: TextAlign.center),
              const SizedBox(height: 8),
              Text(
                'Your reference UTR: $txnId for $invNum has been sent to Society Management.',
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

            // 3-Step Direct UPI Payment Guide & UTR Submission Card
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
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.touch_app_rounded, color: AppColors.primary, size: 20),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'Direct UPI Payment Guide',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    
                    // Step 1: Copy UPI VPA
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Step 1: Copy Society UPI ID', style: TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
                                Text('8106342858@ybl', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primary)),
                              ],
                            ),
                          ),
                          ElevatedButton.icon(
                            onPressed: () {
                              Clipboard.setData(const ClipboardData(text: '8106342858@ybl'));
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('📋 UPI VPA (8106342858@ybl) copied! Paste in PhonePe/GPay.'), backgroundColor: AppColors.success),
                              );
                            },
                            icon: const Icon(Icons.copy_rounded, size: 14),
                            label: const Text('Copy ID', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),

                    // Step 2: Open App Button
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: _launchUpiApp,
                        icon: const Icon(Icons.launch_rounded, size: 16),
                        label: Text('Open PhonePe / GPay (₹${totalAmount.toStringAsFixed(0)})', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.success,
                          side: const BorderSide(color: AppColors.success),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),

                    // Step 3: Enter UTR Box
                    const Text('Step 2: Enter 12-Digit UTR from Receipt', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _utrController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        hintText: 'Enter 12-Digit UTR (e.g. 423456789012)',
                        prefixIcon: const Icon(Icons.pin_rounded, color: AppColors.primary),
                        fillColor: AppColors.background,
                        filled: true,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg), borderSide: const BorderSide(color: AppColors.border)),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: _isProcessing ? null : _verifyAndCompletePayment,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.success,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                        ),
                        child: _isProcessing
                            ? const CircularProgressIndicator(color: Colors.white)
                            : const Text('Submit UTR for Treasurer Verification', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                      ),
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
            const SizedBox(height: AppSpacing.md),

            // Quick Copy Official Society UPI VPA Card
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.qr_code_2_rounded, color: AppColors.primary, size: 28),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Official Society UPI VPA', style: TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w500)),
                        Text('8106342858@ybl', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                      ],
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: () {
                      Clipboard.setData(const ClipboardData(text: '8106342858@ybl'));
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('📋 UPI VPA (8106342858@ybl) copied to clipboard!'), backgroundColor: AppColors.success),
                      );
                    },
                    icon: const Icon(Icons.copy_rounded, size: 14),
                    label: const Text('Copy VPA', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      side: const BorderSide(color: AppColors.primary),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    ),
                  ),
                ],
              ),
            ),
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
