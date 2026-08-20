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
  Stream<List<VisitorModel>> watchVisitorsForResident({
    required String residentUid,
    required String flatNumber,
    String? tower,
  }) {
    String normalize(String s) {
      return s
          .toLowerCase()
          .replaceAll('block', '')
          .replaceAll('tower', '')
          .replaceAll('flat', '')
          .replaceAll('unit', '')
          .replaceAll('apt', '')
          .replaceAll('apartment', '')
          .replaceAll(RegExp(r'[^a-z0-9]'), '');
    }

    final cleanFlat = normalize(flatNumber);
    final cleanTowerFlat = normalize('${tower ?? ""}$flatNumber');

    return _firestoreService.visitorsStream().map((snapshot) {
      return snapshot.docs
          .map((doc) => VisitorModel.fromFirestore(doc))
          .where((v) {
            // 1. Direct UID match
            if (residentUid.isNotEmpty &&
                (v.hostResidentUid == residentUid ||
                 v.invitedBy == residentUid ||
                 v.approvedBy == residentUid)) {
              return true;
            }

            // 2. Normalized Flat match
            final vFlat = normalize(v.hostFlat);
            if (cleanFlat.isNotEmpty &&
                (vFlat == cleanFlat ||
                 vFlat == cleanTowerFlat ||
                 (cleanFlat.length >= 2 && vFlat.endsWith(cleanFlat)) ||
                 (vFlat.length >= 2 && cleanFlat.endsWith(vFlat)))) {
              return true;
            }

            return false;
          })
          .toList();
    });
  }

  @override
  Stream<List<VisitorModel>> watchPendingVisitorsForFlat(String hostFlat) {
    return watchPendingVisitorsForResident(
      residentUid: '',
      flatNumber: hostFlat,
    );
  }

  @override
  Stream<List<VisitorModel>> watchPendingVisitorsForResident({
    required String residentUid,
    required String flatNumber,
    String? tower,
  }) {
    String normalize(String s) {
      return s
          .toLowerCase()
          .replaceAll('block', '')
          .replaceAll('tower', '')
          .replaceAll('flat', '')
          .replaceAll('unit', '')
          .replaceAll('apt', '')
          .replaceAll('apartment', '')
          .replaceAll(RegExp(r'[^a-z0-9]'), '');
    }

    final cleanFlat = normalize(flatNumber);
    final cleanTowerFlat = normalize('${tower ?? ""}$flatNumber');

    return _firestoreService.pendingVisitorsStream().map((snapshot) {
      return snapshot.docs
          .map((doc) => VisitorModel.fromFirestore(doc))
          .where((v) {
            // 1. Direct UID match
            if (residentUid.isNotEmpty &&
                (v.hostResidentUid == residentUid || v.invitedBy == residentUid)) {
              return true;
            }

            // 2. Normalized Flat match
            final vFlat = normalize(v.hostFlat);
            if (cleanFlat.isNotEmpty &&
                (vFlat == cleanFlat ||
                 vFlat == cleanTowerFlat ||
                 (cleanFlat.length >= 2 && vFlat.endsWith(cleanFlat)) ||
                 (vFlat.length >= 2 && cleanFlat.endsWith(vFlat)))) {
              return true;
            }

            return false;
          })
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
