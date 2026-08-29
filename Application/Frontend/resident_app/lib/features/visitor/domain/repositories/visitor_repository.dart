import '../../../../core/services/firestore_service.dart';
import '../models/visitor_action_result.dart';
import '../models/visitor_model.dart';

abstract class VisitorRepository {
  /// Stream of strongly typed visitors in the current society.
  Stream<List<VisitorModel>> watchVisitors();

  /// Stream of strongly typed visitors for a specific resident.
  Stream<List<VisitorModel>> watchVisitorsForResident({
    required String residentUid,
    required String flatNumber,
    String? tower,
  });

  /// Stream of strongly typed pending visitors for a specific flat.
  Stream<List<VisitorModel>> watchPendingVisitorsForFlat(String hostFlat);

  /// Stream of strongly typed pending visitors for a resident matching UID or flat number.
  Stream<List<VisitorModel>> watchPendingVisitorsForResident({
    required String residentUid,
    required String flatNumber,
    String? tower,
  });

  /// Validates a flat number to ensure it belongs to a registered resident.
  Future<FlatValidationResult> validateFlat(String hostFlat);

  /// Log a visitor entry at gate (guard flow).
  Future<String> logVisitorEntry({
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
  });

  /// Invite a visitor and create a pre-approved pass code.
  Future<VisitorInviteResult> inviteVisitor({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
    String passType = 'one_time',
    String? validFrom,
    String? validUntil,
  });

  /// Mark visitor exit/checkout.
  Future<void> markVisitorExit(String visitorId);

  /// Update visitor status.
  Future<void> updateVisitorStatus(String visitorId, String status);

  /// Resident approval or rejection of pending visitor.
  Future<void> updateVisitorApproval({
    required String visitorId,
    required String status,
    required String residentUid,
    String? rejectionReason,
  });

  /// Validate and process a QR code or pass code scan.
  Future<VisitorScanResult> validateAndProcessQrScan(String code);
}
