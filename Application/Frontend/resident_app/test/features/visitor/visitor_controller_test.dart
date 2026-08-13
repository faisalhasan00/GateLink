import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/core/services/firestore_service.dart';
import 'package:societysphere/features/visitor/domain/models/visitor_action_result.dart';
import 'package:societysphere/features/visitor/domain/models/visitor_model.dart';
import 'package:societysphere/features/visitor/domain/repositories/visitor_repository.dart';
import 'package:societysphere/features/visitor/presentation/controllers/visitor_controller.dart';
import 'package:societysphere/features/visitor/presentation/controllers/visitor_state.dart';

class MockVisitorRepository implements VisitorRepository {
  bool shouldFail = false;
  int inviteVisitorCalls = 0;
  int updateVisitorApprovalCalls = 0;
  int logVisitorEntryCalls = 0;
  int markVisitorExitCalls = 0;
  int validateAndProcessQrScanCalls = 0;

  @override
  Stream<List<VisitorModel>> watchVisitors() => const Stream.empty();

  @override
  Stream<List<VisitorModel>> watchPendingVisitorsForFlat(String hostFlat) => const Stream.empty();

  @override
  Future<FlatValidationResult> validateFlat(String hostFlat) async {
    return FlatValidationResult(isValid: true, residentName: 'Test Owner');
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
    inviteVisitorCalls++;
    if (shouldFail) throw Exception('Invite error');
    return const VisitorInviteResult(visitorId: 'vis-101', passCode: '654321');
  }

  @override
  Future<void> updateVisitorApproval({
    required String visitorId,
    required String status,
    required String residentUid,
    String? rejectionReason,
  }) async {
    updateVisitorApprovalCalls++;
    if (shouldFail) throw Exception('Approval error');
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
  }) async {
    logVisitorEntryCalls++;
    if (shouldFail) throw Exception('Log entry error');
    return 'vis-999';
  }

  @override
  Future<void> markVisitorExit(String visitorId) async {
    markVisitorExitCalls++;
    if (shouldFail) throw Exception('Exit error');
  }

  @override
  Future<void> updateVisitorStatus(String visitorId, String status) async {}

  @override
  Future<VisitorScanResult> validateAndProcessQrScan(String code) async {
    validateAndProcessQrScanCalls++;
    if (shouldFail) throw Exception('QR scan error');
    return const VisitorScanResult(isValid: true, visitorName: 'John Doe');
  }
}

void main() {
  late MockVisitorRepository mockRepository;
  late VisitorController controller;

  setUp(() {
    mockRepository = MockVisitorRepository();
    controller = VisitorController(mockRepository);
  });

  group('VisitorController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, VisitorActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
      expect(controller.state.isSubmitting, false);
    });

    test('inviteVisitor fails validation when name is empty', () async {
      final result = await controller.inviteVisitor(
        name: '   ',
        phone: '9876543210',
        purpose: 'Guest',
        hostFlat: 'A-101',
        invitedBy: 'user-123',
        expectedDate: 'Today',
        expectedTime: 'Anytime',
      );

      expect(result, isNull);
      expect(controller.state.status, VisitorActionStatus.error);
      expect(controller.state.errorMessage, contains('name is required'));
      expect(mockRepository.inviteVisitorCalls, 0);
    });

    test('inviteVisitor fails validation when phone is empty', () async {
      final result = await controller.inviteVisitor(
        name: 'John Doe',
        phone: '',
        purpose: 'Guest',
        hostFlat: 'A-101',
        invitedBy: 'user-123',
        expectedDate: 'Today',
        expectedTime: 'Anytime',
      );

      expect(result, isNull);
      expect(controller.state.status, VisitorActionStatus.error);
      expect(controller.state.errorMessage, contains('phone number is required'));
      expect(mockRepository.inviteVisitorCalls, 0);
    });

    test('inviteVisitor succeeds with valid input returning VisitorInviteResult', () async {
      final result = await controller.inviteVisitor(
        name: 'John Doe',
        phone: '9876543210',
        purpose: 'Guest',
        hostFlat: 'A-101',
        invitedBy: 'user-123',
        expectedDate: 'Today',
        expectedTime: 'Anytime',
      );

      expect(result, isNotNull);
      expect(result!.passCode, '654321');
      expect(result.visitorId, 'vis-101');
      expect(controller.state.status, VisitorActionStatus.success);
      expect(mockRepository.inviteVisitorCalls, 1);
    });

    test('inviteVisitor sets error state on repository failure', () async {
      mockRepository.shouldFail = true;

      final result = await controller.inviteVisitor(
        name: 'John Doe',
        phone: '9876543210',
        purpose: 'Guest',
        hostFlat: 'A-101',
        invitedBy: 'user-123',
        expectedDate: 'Today',
        expectedTime: 'Anytime',
      );

      expect(result, isNull);
      expect(controller.state.status, VisitorActionStatus.error);
      expect(controller.state.errorMessage, contains('Failed to create visitor pass'));
      expect(mockRepository.inviteVisitorCalls, 1);
    });

    test('updateVisitorApproval succeeds when approving visitor', () async {
      final success = await controller.updateVisitorApproval(
        visitorId: 'vis-101',
        status: 'approved',
        residentUid: 'user-123',
      );

      expect(success, true);
      expect(controller.state.status, VisitorActionStatus.success);
      expect(controller.state.successMessage, contains('approved'));
      expect(mockRepository.updateVisitorApprovalCalls, 1);
    });

    test('updateVisitorApproval fails when visitorId is empty', () async {
      final success = await controller.updateVisitorApproval(
        visitorId: '',
        status: 'approved',
        residentUid: 'user-123',
      );

      expect(success, false);
      expect(controller.state.status, VisitorActionStatus.error);
      expect(mockRepository.updateVisitorApprovalCalls, 0);
    });

    test('logVisitorEntry succeeds with valid input', () async {
      final docId = await controller.logVisitorEntry(
        name: 'Delivery Agent',
        type: 'Delivery',
        hostFlat: 'A-101',
      );

      expect(docId, 'vis-999');
      expect(controller.state.status, VisitorActionStatus.success);
      expect(mockRepository.logVisitorEntryCalls, 1);
    });

    test('markVisitorExit succeeds with valid visitor ID', () async {
      final success = await controller.markVisitorExit('vis-101');

      expect(success, true);
      expect(controller.state.status, VisitorActionStatus.success);
      expect(mockRepository.markVisitorExitCalls, 1);
    });

    test('validateAndProcessQrScan succeeds returning VisitorScanResult', () async {
      final result = await controller.validateAndProcessQrScan('654321');

      expect(result, isNotNull);
      expect(result!.isValid, true);
      expect(result.visitorName, 'John Doe');
      expect(controller.state.status, VisitorActionStatus.success);
      expect(mockRepository.validateAndProcessQrScanCalls, 1);
    });
  });
}
