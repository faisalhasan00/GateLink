import '../../../../core/services/firestore_service.dart';
import '../../domain/models/visitor_action_result.dart';
import '../../domain/models/visitor_model.dart';
import '../../domain/repositories/visitor_repository.dart';

class VisitorRepositoryImpl implements VisitorRepository {
  final FirestoreService _firestoreService;

  VisitorRepositoryImpl(this._firestoreService);

  @override
  Stream<List<VisitorModel>> watchVisitors() {
    return _firestoreService.visitorsStream().map((snapshot) {
      return snapshot.docs
          .map((doc) => VisitorModel.fromFirestore(doc))
          .toList();
    });
  }

  @override
  Stream<List<VisitorModel>> watchPendingVisitorsForFlat(String hostFlat) {
    return _firestoreService
        .pendingVisitorsForFlatStream(hostFlat)
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => VisitorModel.fromFirestore(doc))
          .toList();
    });
  }

  @override
  Future<FlatValidationResult> validateFlat(String hostFlat) {
    return _firestoreService.validateFlat(hostFlat);
  }

  @override
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
  }) {
    return _firestoreService.logVisitorEntry(
      name: name,
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
  }

  @override
  Future<VisitorInviteResult> inviteVisitor({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
  }) async {
    final map = await _firestoreService.inviteVisitor(
      name: name,
      phone: phone,
      purpose: purpose,
      hostFlat: hostFlat,
      invitedBy: invitedBy,
      expectedDate: expectedDate,
      expectedTime: expectedTime,
    );
    return VisitorInviteResult(
      visitorId: map['visitorId'] ?? '',
      passCode: map['passCode'] ?? '100000',
    );
  }

  @override
  Future<void> markVisitorExit(String visitorId) {
    return _firestoreService.markVisitorExit(visitorId);
  }

  @override
  Future<void> updateVisitorStatus(String visitorId, String status) {
    return _firestoreService.updateVisitorStatus(visitorId, status);
  }

  @override
  Future<void> updateVisitorApproval({
    required String visitorId,
    required String status,
    required String residentUid,
    String? rejectionReason,
  }) {
    return _firestoreService.updateVisitorApproval(
      visitorId: visitorId,
      status: status,
      residentUid: residentUid,
      rejectionReason: rejectionReason,
    );
  }

  @override
  Future<VisitorScanResult> validateAndProcessQrScan(String code) async {
    final rawMap = await _firestoreService.validateAndProcessQrScan(code);
    return VisitorScanResult.fromMap(rawMap);
  }
}
