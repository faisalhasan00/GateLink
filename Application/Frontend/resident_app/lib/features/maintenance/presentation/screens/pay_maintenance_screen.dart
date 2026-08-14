import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_cashfree_pg_sdk/utils/cfenums.dart';

import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../payment/providers/payment_providers.dart';
import '../../../payment/services/cashfree_native_service.dart';
import '../../providers/maintenance_providers.dart';
import '../widgets/bill_summary_card.dart';
import '../widgets/cashfree_payment_card.dart';
import '../widgets/due_date_warning_card.dart';
import '../widgets/offline_payment_card.dart';
import '../widgets/offline_submitted_bottom_sheet.dart';
import '../widgets/payment_method_selector.dart';
import '../widgets/payment_success_bottom_sheet.dart';

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
  ConsumerState<PayMaintenanceScreen> createState() =>
      _PayMaintenanceScreenState();
}

class _PayMaintenanceScreenState extends ConsumerState<PayMaintenanceScreen> {
  int _selectedMethod = 0;
  bool _isProcessing = false;
  bool _isLoadingBill = false;
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
      final activeSocId =
          ref.read(userProfileProvider).value?['societyId'] as String? ??
              'SOC-001';

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
      debugPrint('Error fetching latest bill for pay screen: $e');
    } finally {
      if (mounted) setState(() => _isLoadingBill = false);
    }
  }

  String? _activeOrderId;

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
      final invNum =
          _effectiveInvoiceNumber ?? widget.invoiceNumber ?? 'INV-2026-9305';

      if (user == null) throw Exception('User not logged in');

      // Call Clean Architecture PaymentController to get official Cashfree session
      final order = await ref
          .read(paymentControllerProvider.notifier)
          .initiateCashfreeOrder(
            societyId: activeSocId,
            maintenanceBillId: targetBillId,
            residentUid: user.uid,
          );

      if (order == null || order.cashfreePaymentSessionId == null) {
        final err = ref.read(paymentControllerProvider).errorMessage ??
            'Could not create Cashfree payment order';
        throw Exception(err);
      }

      setState(() => _activeOrderId = order.orderId);

      debugPrint(
          '[PaymentFlow] Initiating Native Cashfree Checkout for billId: $targetBillId, societyId: $activeSocId, orderId: ${order.orderId}');

      // Start listening for real-time Firestore webhook confirmation
      _listenForPaymentCompletion(
          activeSocId, targetBillId, invNum, order.amount);

      // Launch Native Cashfree SDK Checkout
      await CashfreeNativeService().startCheckout(
        orderId: order.orderId,
        paymentSessionId: order.cashfreePaymentSessionId!,
        environment: CFEnvironment.SANDBOX,
        onSuccess: (orderId) {
          debugPrint('[PaymentFlow] Native SDK reported success for order: $orderId');
          if (mounted) {
            setState(() => _isProcessing = false);
            _verifyPaymentStatusManually();
          }
        },
        onError: (errorMessage, orderId) {
          debugPrint('[PaymentFlow] Native SDK reported error/cancel: $errorMessage');
          if (mounted) {
            setState(() => _isProcessing = false);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(errorMessage),
                backgroundColor: AppColors.error,
              ),
            );
          }
        },
      );
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Cashfree Payment Error: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  void _listenForPaymentCompletion(
      String societyId, String billId, String invNum, double amount) {
    final user = ref.read(currentUserProvider);
    if (user == null) return;

    ref
        .read(maintenanceRepositoryProvider)
        .watchMaintenanceBills(user.uid)
        .listen((bills) {
      final bill = bills.where((b) => b.id == billId).firstOrNull;
      if (bill != null && bill.isPaid && mounted) {
        final txnId =
            (bill.transactionId != null && bill.transactionId!.isNotEmpty)
                ? bill.transactionId!
                : 'CF-PAID-OK';
        PaymentSuccessBottomSheet.show(
          context,
          amount: amount,
          transactionId: txnId,
          invoiceNumber: invNum,
        );
      }
    });
  }

  Future<void> _verifyPaymentStatusManually() async {
    if (_activeOrderId == null || _activeOrderId!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
              'No active payment session to verify. Please proceed to checkout first.'),
        ),
      );
      return;
    }

    setState(() => _isProcessing = true);
    try {
      final userProfile = ref.read(userProfileProvider).value;
      final activeSocId = userProfile?['societyId'] as String? ?? 'SOC-001';
      final invNum =
          _effectiveInvoiceNumber ?? widget.invoiceNumber ?? 'INV-2026-9305';

      final verifiedOrder = await ref
          .read(paymentControllerProvider.notifier)
          .verifyPaymentStatus(
            societyId: activeSocId,
            orderId: _activeOrderId!,
          );

      setState(() => _isProcessing = false);

      if (mounted) {
        if (verifiedOrder?.status == 'SUCCESS') {
          final targetBillId = _effectiveBillId ?? widget.billId;
          if (targetBillId != null && targetBillId.isNotEmpty) {
            final nowStr = DateTime.now().toIso8601String();
            final txnId = _activeOrderId ?? 'CF-PAID-SUCCESS';
            try {
              await FirebaseFirestore.instance
                  .doc('societies/$activeSocId/maintenance_bills/$targetBillId')
                  .set({
                'status': 'paid',
                'paymentMethod': 'Cashfree Online',
                'transactionId': txnId,
                'paidAt': nowStr,
                'updatedAt': nowStr,
              }, SetOptions(merge: true));
            } catch (fsErr) {
              debugPrint(
                  '[PaymentFlow] Error updating bill status in Firestore: $fsErr');
            }
          }

          PaymentSuccessBottomSheet.show(
            context,
            amount: verifiedOrder?.amount ?? _effectiveAmount ?? 1.0,
            transactionId: _activeOrderId ?? 'CF-PAID-SUCCESS',
            invoiceNumber: invNum,
          );
        } else {
          final msg = ref.read(paymentControllerProvider).successMessage ??
              ref.read(paymentControllerProvider).errorMessage ??
              'Status: ${verifiedOrder?.status ?? "Unknown"}';
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(msg),
              backgroundColor: (verifiedOrder?.status == 'OVERPAYMENT_RECORDED')
                  ? AppColors.success
                  : AppColors.primary,
            ),
          );
        }
      }
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Verification error: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
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
          content: Text(
              'Please enter UTR / Transaction Reference Number from your receipt.'),
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
      final invNum =
          _effectiveInvoiceNumber ?? widget.invoiceNumber ?? 'INV-2026-9305';
      final activeSocId = userProfile?['societyId'] as String? ?? 'SOC-001';
      final residentName =
          userProfile?['name'] ?? user?.displayName ?? 'Flat Owner';
      final flatNumber = userProfile?['flatNumber'] ?? 'A-101';

      if (user != null) {
        final success = await ref
            .read(paymentControllerProvider.notifier)
            .submitOfflinePayment(
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
            final errorMsg = ref.read(paymentControllerProvider).errorMessage ??
                'Offline payment submission failed.';
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                  content: Text(errorMsg), backgroundColor: AppColors.error),
            );
          }
          return;
        }
      }

      setState(() => _isProcessing = false);
      if (!mounted) return;

      OfflineSubmittedBottomSheet.show(
        context,
        utrText: utrText,
        invoiceNumber: invNum,
      );
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Submission Error: $e'),
              backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoadingBill) {
      return Scaffold(
        appBar: AppBar(
            title: const Text('Pay Maintenance'),
            backgroundColor: Colors.white,
            foregroundColor: AppColors.textPrimary),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final displayMonth = _effectiveMonth ?? widget.month ?? 'August 2026';
    final totalAmount = _effectiveAmount ?? widget.amount ?? 3500.0;
    final displayDueDate = _effectiveDueDate ?? widget.dueDate ?? '10 Aug 2026';
    final invNumber =
        _effectiveInvoiceNumber ?? widget.invoiceNumber ?? 'Invoice';
    final maintCharge =
        _effectiveMaintCharge ?? widget.maintenanceCharge ?? 2500.0;
    final waterCharge = _effectiveWaterCharge ?? widget.waterCharge ?? 400.0;
    final parkingCharge =
        _effectiveParkingCharge ?? widget.parkingCharge ?? 0.0;
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
            BillSummaryCard(
              month: displayMonth,
              totalAmount: totalAmount,
              maintenanceCharge: maintCharge,
              waterCharge: waterCharge,
              parkingCharge: parkingCharge,
              sinkingFund: sinkingFund,
              penaltyFee: penaltyFee,
            ),
            const SizedBox(height: AppSpacing.xl),
            DueDateWarningCard(
              dueDate: displayDueDate,
              penaltyFee: penaltyFee,
            ),
            const SizedBox(height: AppSpacing.xl),
            PaymentMethodSelector(
              selectedMethod: _selectedMethod,
              onMethodSelected: (index) =>
                  setState(() => _selectedMethod = index),
            ),
            const SizedBox(height: AppSpacing.lg),
            if (_selectedMethod == 0) ...[
              CashfreePaymentCard(
                totalAmount: totalAmount,
                isProcessing: _isProcessing,
                onPayPressed: _verifyAndCompletePayment,
                onVerifyPressed: _verifyPaymentStatusManually,
                activeOrderId: _activeOrderId,
              ),
              const SizedBox(height: AppSpacing.xl),
            ],
            if (_selectedMethod == 1) ...[
              OfflinePaymentCard(
                utrController: _utrController,
                isProcessing: _isProcessing,
                onSubmitPressed: _verifyAndCompletePayment,
              ),
              const SizedBox(height: AppSpacing.xl),
            ],
            const Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.lock_rounded,
                      size: 14, color: AppColors.textSecondary),
                  SizedBox(width: 4),
                  Text(
                    'Secured by 256-bit SSL encryption',
                    style:
                        TextStyle(fontSize: 12, color: AppColors.textSecondary),
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
