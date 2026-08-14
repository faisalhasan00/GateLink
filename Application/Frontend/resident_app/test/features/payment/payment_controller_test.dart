import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/payment/domain/models/payment_order_model.dart';
import 'package:societysphere/features/payment/domain/repositories/payment_repository.dart';
import 'package:societysphere/features/payment/presentation/controllers/payment_controller.dart';
import 'package:societysphere/features/payment/presentation/controllers/payment_state.dart';

class MockPaymentRepository implements PaymentRepository {
  bool shouldThrow = false;

  @override
  Future<PaymentOrderModel> createCashfreeOrder({
    required String societyId,
    required String maintenanceBillId,
    required String residentUid,
  }) async {
    if (shouldThrow) {
      throw Exception('Failed to create payment order');
    }
    return PaymentOrderModel(
      orderId: 'CF_SOC_001_bill_1_100',
      cashfreePaymentSessionId: 'session_mock_123',
      societyId: societyId,
      maintenanceBillId: maintenanceBillId,
      residentUid: residentUid,
      flatNumber: 'A-101',
      amount: 3500.0,
      status: 'PENDING',
    );
  }

  @override
  Stream<PaymentOrderModel?> watchPaymentStatus(String orderId) {
    return Stream.value(
      PaymentOrderModel(
        orderId: orderId,
        societyId: 'SOC-001',
        maintenanceBillId: 'bill_1',
        residentUid: 'user_1',
        flatNumber: 'A-101',
        amount: 3500.0,
        status: 'SUCCESS',
      ),
    );
  }

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
    if (shouldThrow) {
      throw Exception('Failed to submit offline payment');
    }
  }
}

void main() {
  group('PaymentController Unit Tests', () {
    late MockPaymentRepository repository;
    late PaymentController controller;

    setUp(() {
      repository = MockPaymentRepository();
      controller = PaymentController(repository);
    });

    test('Initial state is PaymentActionStatus.initial', () {
      expect(controller.state.status, equals(PaymentActionStatus.initial));
      expect(controller.state.activeOrder, isNull);
    });

    test(
        'initiateCashfreeOrder updates state to success on valid repository response',
        () async {
      final order = await controller.initiateCashfreeOrder(
        societyId: 'SOC-001',
        maintenanceBillId: 'bill_1',
        residentUid: 'user_1',
      );

      expect(order, isNotNull);
      expect(order?.orderId, equals('CF_SOC_001_bill_1_100'));
      expect(order?.cashfreePaymentSessionId, equals('session_mock_123'));
      expect(controller.state.status, equals(PaymentActionStatus.success));
      expect(controller.state.activeOrder, equals(order));
    });

    test('initiateCashfreeOrder sets state to error when repository fails',
        () async {
      repository.shouldThrow = true;

      final order = await controller.initiateCashfreeOrder(
        societyId: 'SOC-001',
        maintenanceBillId: 'bill_1',
        residentUid: 'user_1',
      );

      expect(order, isNull);
      expect(controller.state.status, equals(PaymentActionStatus.error));
      expect(controller.state.errorMessage,
          contains('Failed to create payment order'));
    });

    test('submitOfflinePayment updates state to success on valid submission',
        () async {
      final success = await controller.submitOfflinePayment(
        societyId: 'SOC-001',
        billId: 'bill_1',
        residentUid: 'user_1',
        referenceNumber: 'UTR12345678',
        residentName: 'John Doe',
        flatNumber: 'A-101',
        invoiceNumber: 'INV-2026-001',
      );

      expect(success, isTrue);
      expect(controller.state.status, equals(PaymentActionStatus.success));
      expect(controller.state.successMessage,
          contains('submitted for verification'));
    });

    test('submitOfflinePayment sets state to error when repository fails',
        () async {
      repository.shouldThrow = true;

      final success = await controller.submitOfflinePayment(
        societyId: 'SOC-001',
        billId: 'bill_1',
        residentUid: 'user_1',
        referenceNumber: 'UTR12345678',
        residentName: 'John Doe',
        flatNumber: 'A-101',
        invoiceNumber: 'INV-2026-001',
      );

      expect(success, isFalse);
      expect(controller.state.status, equals(PaymentActionStatus.error));
    });
  });
}
