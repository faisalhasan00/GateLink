import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/payment_order_model.dart';
import '../../domain/repositories/payment_repository.dart';
import 'payment_state.dart';

class PaymentController extends StateNotifier<PaymentState> {
  final PaymentRepository _repository;

  PaymentController(this._repository) : super(const PaymentState());

  /// Initiate an official Cashfree payment order via Cloud Function
  Future<PaymentOrderModel?> initiateCashfreeOrder({
    required String societyId,
    required String maintenanceBillId,
    required String residentUid,
  }) async {
    if (state.isLoading) return null;

    state = state.copyWith(status: PaymentActionStatus.loading);

    try {
      final order = await _repository.createCashfreeOrder(
        societyId: societyId,
        maintenanceBillId: maintenanceBillId,
        residentUid: residentUid,
      );

      state = state.copyWith(
        status: PaymentActionStatus.success,
        activeOrder: order,
        successMessage: 'Cashfree payment session created successfully.',
      );
      return order;
    } catch (e) {
      state = state.copyWith(
        status: PaymentActionStatus.error,
        errorMessage: e.toString().replaceAll('Exception: ', ''),
      );
      return null;
    }
  }

  /// Manually verify on-demand payment status with Cashfree via S2S backend endpoint
  Future<PaymentOrderModel?> verifyPaymentStatus({
    required String societyId,
    required String orderId,
  }) async {
    if (state.isLoading) return null;

    state = state.copyWith(status: PaymentActionStatus.loading);

    try {
      final order = await _repository.verifyPaymentStatus(
        societyId: societyId,
        orderId: orderId,
      );

      if (order?.status == 'SUCCESS') {
        state = state.copyWith(
          status: PaymentActionStatus.success,
          activeOrder: order,
          successMessage: 'Payment verified successfully.',
        );
      } else if (order?.status == 'OVERPAYMENT_RECORDED') {
        state = state.copyWith(
          status: PaymentActionStatus.success,
          activeOrder: order,
          successMessage:
              'Payment received as duplicate/overpayment and logged for review.',
        );
      } else if (order?.status == 'FLAGGED_AMOUNT_MISMATCH') {
        state = state.copyWith(
          status: PaymentActionStatus.error,
          activeOrder: order,
          errorMessage: 'Payment amount mismatch flagged. Contact admin.',
        );
      } else if (order?.status == 'FAILED') {
        state = state.copyWith(
          status: PaymentActionStatus.error,
          activeOrder: order,
          errorMessage: 'Cashfree reported payment failure.',
        );
      } else {
        state = state.copyWith(
          status: PaymentActionStatus.initial,
          activeOrder: order,
          successMessage: 'Payment status is still pending.',
        );
      }
      return order;
    } catch (e) {
      state = state.copyWith(
        status: PaymentActionStatus.error,
        errorMessage: 'Unable to verify payment status. Please try again.',
      );
      return null;
    }
  }

  /// Submit an offline UTR payment reference for Treasurer verification
  Future<bool> submitOfflinePayment({
    required String societyId,
    required String billId,
    required String residentUid,
    required String referenceNumber,
    required String residentName,
    required String flatNumber,
    required String invoiceNumber,
  }) async {
    if (state.isLoading) return false;

    state = state.copyWith(status: PaymentActionStatus.loading);

    try {
      await _repository.submitOfflinePayment(
        societyId: societyId,
        billId: billId,
        residentUid: residentUid,
        referenceNumber: referenceNumber,
        residentName: residentName,
        flatNumber: flatNumber,
        invoiceNumber: invoiceNumber,
      );

      state = state.copyWith(
        status: PaymentActionStatus.success,
        successMessage: 'Offline payment reference submitted for verification.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: PaymentActionStatus.error,
        errorMessage: 'Failed to submit offline reference. Please try again.',
      );
      return false;
    }
  }
}
