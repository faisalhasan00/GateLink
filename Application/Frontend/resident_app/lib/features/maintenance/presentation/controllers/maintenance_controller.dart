import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/maintenance_bill_model.dart';
import '../../domain/repositories/maintenance_repository.dart';

class MaintenanceController extends StateNotifier<AsyncValue<void>> {
  final MaintenanceRepository _repository;

  MaintenanceController(this._repository) : super(const AsyncValue.data(null));

  /// Fetch active pending maintenance bill for a resident.
  Future<MaintenanceBillModel?> getPendingBill(String residentUid) async {
    state = const AsyncValue.loading();
    try {
      final bill = await _repository.getPendingBill(residentUid);
      state = const AsyncValue.data(null);
      return bill;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  /// Submit an offline payment reference (UTR / Cheque / Bank Transfer) for Treasurer verification.
  Future<bool> submitOfflinePayment({
    required String societyId,
    required String billId,
    required String residentUid,
    required String referenceNumber,
    required String residentName,
    required String flatNumber,
    required String invoiceNumber,
  }) async {
    final refNum = referenceNumber.trim();
    if (refNum.isEmpty) {
      state = AsyncValue.error(
        ArgumentError('UTR / Reference number is required for offline payments.'),
        StackTrace.current,
      );
      return false;
    }

    state = const AsyncValue.loading();
    try {
      await _repository.submitOfflinePayment(
        societyId: societyId,
        billId: billId,
        residentUid: residentUid,
        referenceNumber: refNum,
        residentName: residentName,
        flatNumber: flatNumber,
        invoiceNumber: invoiceNumber,
      );
      state = const AsyncValue.data(null);
      return true;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  /// Create a pending payment session record in Firestore for Cashfree tracking.
  Future<void> createPendingPaymentRecord({
    required String internalPaymentId,
    required String orderId,
    required String societyId,
    required String billId,
    required String residentUid,
    required String flatNumber,
    required double amount,
  }) async {
    state = const AsyncValue.loading();
    try {
      await _repository.createPendingPaymentRecord(
        internalPaymentId: internalPaymentId,
        orderId: orderId,
        societyId: societyId,
        billId: billId,
        residentUid: residentUid,
        flatNumber: flatNumber,
        amount: amount,
      );
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  /// Seed demo maintenance bills for initial setup or testing.
  Future<void> seedDemoBills({
    required String societyId,
    required String residentUid,
    required String flatNumber,
  }) async {
    state = const AsyncValue.loading();
    try {
      await _repository.seedDemoBills(
        societyId: societyId,
        residentUid: residentUid,
        flatNumber: flatNumber,
      );
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}
