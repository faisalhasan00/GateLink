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
