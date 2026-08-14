import '../models/payment_order_model.dart';

abstract class PaymentRepository {
  /// Calls the authenticated backend Cloud Function `createCashfreeOrder`
  /// returns a PaymentOrderModel containing valid `orderId` and `paymentSessionId`
  Future<PaymentOrderModel> createCashfreeOrder({
    required String societyId,
    required String maintenanceBillId,
    required String residentUid,
  });

  /// Streams real-time updates for a payment document
  Stream<PaymentOrderModel?> watchPaymentStatus(String orderId);

  /// Calls the authenticated backend Cloud Function `verifyCashfreePaymentStatus`
  /// to perform an on-demand S2S query against Cashfree PG and reconcile state.
  Future<PaymentOrderModel?> verifyPaymentStatus({
    required String societyId,
    required String orderId,
  });

  /// Submits an offline UTR payment reference for Treasurer verification
  Future<void> submitOfflinePayment({
    required String societyId,
    required String billId,
    required String residentUid,
    required String referenceNumber,
    required String residentName,
    required String flatNumber,
    required String invoiceNumber,
  });
}
