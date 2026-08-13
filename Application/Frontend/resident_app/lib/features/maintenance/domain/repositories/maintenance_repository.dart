import '../models/maintenance_bill_model.dart';
import '../models/payment_receipt_model.dart';

abstract class MaintenanceRepository {
  /// Stream of strongly typed maintenance bills for a specific resident.
  Stream<List<MaintenanceBillModel>> watchMaintenanceBills(String residentUid);

  /// Stream of strongly typed payment receipts for a specific resident.
  Stream<List<PaymentReceiptModel>> watchPaymentReceipts(String residentUid);

  /// Get the active pending maintenance bill for a resident as a typed model.
  Future<MaintenanceBillModel?> getPendingBill(String residentUid);

  /// Submit an offline payment reference (UTR / Cheque / Bank Transfer) for Treasurer verification.
  Future<void> submitOfflinePayment({
    required String societyId,
    required String billId,
    required String residentUid,
    required String referenceNumber,
    required String residentName,
    required String flatNumber,
    required String invoiceNumber,
  });

  /// Create a pending payment session record in Firestore.
  Future<void> createPendingPaymentRecord({
    required String internalPaymentId,
    required String orderId,
    required String societyId,
    required String billId,
    required String residentUid,
    required String flatNumber,
    required double amount,
  });

  /// Seed demo maintenance bills for testing / initial setup.
  Future<void> seedDemoBills({
    required String societyId,
    required String residentUid,
    required String flatNumber,
  });
}
