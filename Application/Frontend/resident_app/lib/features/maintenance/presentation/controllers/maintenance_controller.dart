import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/maintenance_repository.dart';
import 'maintenance_state.dart';

class MaintenanceController extends StateNotifier<MaintenanceState> {
  final MaintenanceRepository _repository;

  MaintenanceController(this._repository) : super(MaintenanceState.initial());

  /// Reset state back to initial.
  void resetState() {
    state = MaintenanceState.initial();
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
    // Duplicate submission prevention
    if (state.isSubmitting) return false;

    final refNum = referenceNumber.trim();
    if (refNum.isEmpty) {
      state = state.copyWith(
        status: MaintenanceActionStatus.error,
        errorMessage: 'Transaction reference number (UTR / Cheque) is required.',
      );
      return false;
    }

    if (refNum.length < 4) {
      state = state.copyWith(
        status: MaintenanceActionStatus.error,
        errorMessage: 'Please enter a valid reference number (at least 4 characters).',
      );
      return false;
    }

    state = state.copyWith(status: MaintenanceActionStatus.loading);

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

      state = state.copyWith(
        status: MaintenanceActionStatus.success,
        successMessage: 'Offline payment reference submitted successfully for Treasurer verification.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: MaintenanceActionStatus.error,
        errorMessage: 'Failed to submit offline payment reference. Please try again.',
      );
      return false;
    }
  }

  /// Create a pending payment session record in Firestore for Cashfree tracking.
  Future<bool> createPendingPaymentRecord({
    required String internalPaymentId,
    required String orderId,
    required String societyId,
    required String billId,
    required String residentUid,
    required String flatNumber,
    required double amount,
  }) async {
    // Duplicate submission prevention
    if (state.isSubmitting) return false;

    state = state.copyWith(status: MaintenanceActionStatus.loading);

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

      state = state.copyWith(
        status: MaintenanceActionStatus.success,
        successMessage: 'Payment session initiated successfully.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: MaintenanceActionStatus.error,
        errorMessage: 'Failed to initiate payment session. Please try again.',
      );
      return false;
    }
  }

  /// Seed demo maintenance bills for initial setup or development testing.
  Future<bool> seedDemoBills({
    required String societyId,
    required String residentUid,
    required String flatNumber,
  }) async {
    if (!kDebugMode) {
      state = state.copyWith(
        status: MaintenanceActionStatus.error,
        errorMessage: 'Seed operations are disabled in release builds.',
      );
      return false;
    }
    // Duplicate submission prevention
    if (state.isSubmitting) return false;

    state = state.copyWith(status: MaintenanceActionStatus.loading);

    try {
      await _repository.seedDemoBills(
        societyId: societyId,
        residentUid: residentUid,
        flatNumber: flatNumber,
      );

      state = state.copyWith(
        status: MaintenanceActionStatus.success,
        successMessage: 'Demo maintenance bills created.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: MaintenanceActionStatus.error,
        errorMessage: 'Failed to generate demo bills. Please try again.',
      );
      return false;
    }
  }
}
