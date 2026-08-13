import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/visitor_action_result.dart';
import '../../domain/repositories/visitor_repository.dart';
import 'visitor_state.dart';

class VisitorController extends StateNotifier<VisitorState> {
  final VisitorRepository _repository;

  VisitorController(this._repository) : super(VisitorState.initial());

  /// Reset state to initial.
  void resetState() {
    state = VisitorState.initial();
  }

  /// Resident invites a visitor and generates a pre-approved gate pass.
  Future<VisitorInviteResult?> inviteVisitor({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
  }) async {
    // Duplicate submission prevention
    if (state.isSubmitting) return null;

    final trimmedName = name.trim();
    final trimmedPhone = phone.trim();

    if (trimmedName.isEmpty) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Visitor name is required.',
      );
      return null;
    }

    if (trimmedPhone.isEmpty) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Visitor phone number is required.',
      );
      return null;
    }

    state = state.copyWith(status: VisitorActionStatus.loading);

    try {
      final result = await _repository.inviteVisitor(
        name: trimmedName,
        phone: trimmedPhone,
        purpose: purpose,
        hostFlat: hostFlat,
        invitedBy: invitedBy,
        expectedDate: expectedDate,
        expectedTime: expectedTime,
      );

      state = state.copyWith(
        status: VisitorActionStatus.success,
        successMessage: 'Visitor pass created successfully.',
      );
      return result;
    } catch (e) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Failed to create visitor pass. Please try again.',
      );
      return null;
    }
  }

  /// Resident approves or denies a pending gate visitor request.
  Future<bool> updateVisitorApproval({
    required String visitorId,
    required String status,
    required String residentUid,
    String? rejectionReason,
  }) async {
    if (state.isSubmitting) return false;

    if (visitorId.isEmpty) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Invalid visitor ID.',
      );
      return false;
    }

    state = state.copyWith(status: VisitorActionStatus.loading);

    try {
      await _repository.updateVisitorApproval(
        visitorId: visitorId,
        status: status,
        residentUid: residentUid,
        rejectionReason: rejectionReason,
      );

      final isApproved = status.toLowerCase() == 'approved';
      state = state.copyWith(
        status: VisitorActionStatus.success,
        successMessage: isApproved ? 'Visitor entry approved.' : 'Visitor entry denied.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Failed to update visitor approval status.',
      );
      return false;
    }
  }

  /// Guard logs a walk-in visitor entry at the gate.
  Future<String?> logVisitorEntry({
    required String name,
    required String type,
    required String hostFlat,
    String? phone,
    String? vehicleNumber,
    String? vehicleType,
    String? company,
    String? gender,
    String? photoUrl,
    String? notes,
    String? guardUid,
    String? gateName,
  }) async {
    if (state.isSubmitting) return null;

    final trimmedName = name.trim();
    if (trimmedName.isEmpty) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Visitor name is required.',
      );
      return null;
    }

    state = state.copyWith(status: VisitorActionStatus.loading);

    try {
      final docId = await _repository.logVisitorEntry(
        name: trimmedName,
        type: type,
        hostFlat: hostFlat,
        phone: phone,
        vehicleNumber: vehicleNumber,
        vehicleType: vehicleType,
        company: company,
        gender: gender,
        photoUrl: photoUrl,
        notes: notes,
        guardUid: guardUid,
        gateName: gateName,
      );

      state = state.copyWith(
        status: VisitorActionStatus.success,
        successMessage: 'Visitor entry logged successfully.',
      );
      return docId;
    } catch (e) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Failed to log visitor entry.',
      );
      return null;
    }
  }

  /// Guard or system marks visitor checkout/exit.
  Future<bool> markVisitorExit(String visitorId) async {
    if (state.isSubmitting) return false;

    if (visitorId.isEmpty) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Invalid visitor ID.',
      );
      return false;
    }

    state = state.copyWith(status: VisitorActionStatus.loading);

    try {
      await _repository.markVisitorExit(visitorId);

      state = state.copyWith(
        status: VisitorActionStatus.success,
        successMessage: 'Visitor marked as checked out.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Failed to mark visitor exit.',
      );
      return false;
    }
  }

  /// Validate and process QR / pass code scan at gate.
  Future<VisitorScanResult?> validateAndProcessQrScan(String code) async {
    if (state.isSubmitting) return null;

    if (code.trim().isEmpty) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Invalid pass code.',
      );
      return null;
    }

    state = state.copyWith(status: VisitorActionStatus.loading);

    try {
      final result = await _repository.validateAndProcessQrScan(code.trim());

      state = state.copyWith(
        status: VisitorActionStatus.success,
      );
      return result;
    } catch (e) {
      state = state.copyWith(
        status: VisitorActionStatus.error,
        errorMessage: 'Failed to validate QR pass code.',
      );
      return null;
    }
  }
}
