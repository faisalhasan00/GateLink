import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/maintenance/domain/models/maintenance_bill_model.dart';
import 'package:societysphere/features/maintenance/domain/models/payment_receipt_model.dart';
import 'package:societysphere/features/maintenance/domain/repositories/maintenance_repository.dart';
import 'package:societysphere/features/maintenance/presentation/controllers/maintenance_controller.dart';
import 'package:societysphere/features/maintenance/presentation/controllers/maintenance_state.dart';

class MockMaintenanceRepository implements MaintenanceRepository {
  bool shouldFail = false;
  int submitOfflinePaymentCalls = 0;
  int createPendingPaymentRecordCalls = 0;
  int seedDemoBillsCalls = 0;

  @override
  Future<void> submitOfflinePayment({
    required String societyId,
    required String billId,
    required String residentUid,
    required String referenceNumber,
    required String residentName,
    required String flatNumber,
    required String invoiceNumber,
  }) async {
    submitOfflinePaymentCalls++;
    if (shouldFail) {
      throw Exception('Firestore write error');
    }
  }

  @override
  Future<void> createPendingPaymentRecord({
    required String internalPaymentId,
    required String orderId,
    required String societyId,
    required String billId,
    required String residentUid,
    required String flatNumber,
    required double amount,
  }) async {
    createPendingPaymentRecordCalls++;
    if (shouldFail) {
      throw Exception('Payment record write error');
    }
  }

  @override
  Future<void> seedDemoBills({
    required String societyId,
    required String residentUid,
    required String flatNumber,
  }) async {
    seedDemoBillsCalls++;
    if (shouldFail) {
      throw Exception('Seed error');
    }
  }

  @override
  Future<MaintenanceBillModel?> getPendingBill(String residentUid) async => null;

  @override
  Stream<List<MaintenanceBillModel>> watchMaintenanceBills(String residentUid) => const Stream.empty();

  @override
  Stream<List<PaymentReceiptModel>> watchPaymentReceipts(String residentUid) => const Stream.empty();
}

void main() {
  late MockMaintenanceRepository mockRepository;
  late MaintenanceController controller;

  setUp(() {
    mockRepository = MockMaintenanceRepository();
    controller = MaintenanceController(mockRepository);
  });

  group('MaintenanceController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, MaintenanceActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
      expect(controller.state.isSubmitting, false);
    });

    test('submitOfflinePayment fails validation if reference number is empty', () async {
      final success = await controller.submitOfflinePayment(
        societyId: 'SOC-001',
        billId: 'bill-123',
        residentUid: 'user-123',
        referenceNumber: '   ',
        residentName: 'Test Owner',
        flatNumber: 'A-101',
        invoiceNumber: 'INV-1001',
      );

      expect(success, false);
      expect(controller.state.status, MaintenanceActionStatus.error);
      expect(controller.state.errorMessage, contains('required'));
      expect(mockRepository.submitOfflinePaymentCalls, 0);
    });

    test('submitOfflinePayment fails validation if reference number is too short (< 4 chars)', () async {
      final success = await controller.submitOfflinePayment(
        societyId: 'SOC-001',
        billId: 'bill-123',
        residentUid: 'user-123',
        referenceNumber: '123',
        residentName: 'Test Owner',
        flatNumber: 'A-101',
        invoiceNumber: 'INV-1001',
      );

      expect(success, false);
      expect(controller.state.status, MaintenanceActionStatus.error);
      expect(controller.state.errorMessage, contains('at least 4 characters'));
      expect(mockRepository.submitOfflinePaymentCalls, 0);
    });

    test('submitOfflinePayment succeeds with valid input', () async {
      final success = await controller.submitOfflinePayment(
        societyId: 'SOC-001',
        billId: 'bill-123',
        residentUid: 'user-123',
        referenceNumber: 'UTR987654321',
        residentName: 'Test Owner',
        flatNumber: 'A-101',
        invoiceNumber: 'INV-1001',
      );

      expect(success, true);
      expect(controller.state.status, MaintenanceActionStatus.success);
      expect(controller.state.successMessage, contains('submitted successfully'));
      expect(mockRepository.submitOfflinePaymentCalls, 1);
    });

    test('submitOfflinePayment sets error state on repository failure', () async {
      mockRepository.shouldFail = true;

      final success = await controller.submitOfflinePayment(
        societyId: 'SOC-001',
        billId: 'bill-123',
        residentUid: 'user-123',
        referenceNumber: 'UTR987654321',
        residentName: 'Test Owner',
        flatNumber: 'A-101',
        invoiceNumber: 'INV-1001',
      );

      expect(success, false);
      expect(controller.state.status, MaintenanceActionStatus.error);
      expect(controller.state.errorMessage, contains('Failed to submit'));
      expect(mockRepository.submitOfflinePaymentCalls, 1);
    });

    test('createPendingPaymentRecord succeeds when repository succeeds', () async {
      final success = await controller.createPendingPaymentRecord(
        internalPaymentId: 'pay-001',
        orderId: 'cf-order-001',
        societyId: 'SOC-001',
        billId: 'bill-123',
        residentUid: 'user-123',
        flatNumber: 'A-101',
        amount: 3500.0,
      );

      expect(success, true);
      expect(controller.state.status, MaintenanceActionStatus.success);
      expect(mockRepository.createPendingPaymentRecordCalls, 1);
    });

    test('createPendingPaymentRecord sets error state on repository failure', () async {
      mockRepository.shouldFail = true;

      final success = await controller.createPendingPaymentRecord(
        internalPaymentId: 'pay-001',
        orderId: 'cf-order-001',
        societyId: 'SOC-001',
        billId: 'bill-123',
        residentUid: 'user-123',
        flatNumber: 'A-101',
        amount: 3500.0,
      );

      expect(success, false);
      expect(controller.state.status, MaintenanceActionStatus.error);
      expect(mockRepository.createPendingPaymentRecordCalls, 1);
    });

    test('seedDemoBills succeeds when repository succeeds', () async {
      final success = await controller.seedDemoBills(
        societyId: 'SOC-001',
        residentUid: 'user-123',
        flatNumber: 'A-101',
      );

      expect(success, true);
      expect(controller.state.status, MaintenanceActionStatus.success);
      expect(mockRepository.seedDemoBillsCalls, 1);
    });
  });
}
