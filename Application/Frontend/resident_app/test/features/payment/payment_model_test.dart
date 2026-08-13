import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/payment/domain/models/payment_order_model.dart';

void main() {
  group('PaymentOrderModel Tests', () {
    test('fromMap parses valid map correctly', () {
      final map = {
        'cashfreeOrderId': 'CF_SOC_001_123',
        'cashfreePaymentId': 'CF_PAY_999',
        'cashfreePaymentSessionId': 'session_abc123',
        'societyId': 'SOC-001',
        'maintenanceBillId': 'bill_777',
        'residentUid': 'user_888',
        'flatNumber': 'A-101',
        'amount': 3500.0,
        'currency': 'INR',
        'status': 'SUCCESS',
        'paymentMethod': 'UPI',
        'webhookVerified': true,
        'apiVerified': true,
      };

      final model = PaymentOrderModel.fromMap(map, 'CF_SOC_001_123');

      expect(model.orderId, equals('CF_SOC_001_123'));
      expect(model.cashfreePaymentId, equals('CF_PAY_999'));
      expect(model.cashfreePaymentSessionId, equals('session_abc123'));
      expect(model.societyId, equals('SOC-001'));
      expect(model.amount, equals(3500.0));
      expect(model.status, equals('SUCCESS'));
      expect(model.webhookVerified, isTrue);
      expect(model.apiVerified, isTrue);
    });

    test('toMap converts model to Map correctly', () {
      const model = PaymentOrderModel(
        orderId: 'CF_001',
        societyId: 'SOC-001',
        maintenanceBillId: 'bill_1',
        residentUid: 'user_1',
        flatNumber: 'B-202',
        amount: 2500.0,
        status: 'PENDING',
      );

      final map = model.toMap();

      expect(map['cashfreeOrderId'], equals('CF_001'));
      expect(map['societyId'], equals('SOC-001'));
      expect(map['amount'], equals(2500.0));
      expect(map['status'], equals('PENDING'));
    });

    test('copyWith updates specified fields', () {
      const model = PaymentOrderModel(
        orderId: 'CF_001',
        societyId: 'SOC-001',
        maintenanceBillId: 'bill_1',
        residentUid: 'user_1',
        flatNumber: 'B-202',
        amount: 2500.0,
        status: 'PENDING',
      );

      final updated = model.copyWith(status: 'SUCCESS', webhookVerified: true);

      expect(updated.orderId, equals('CF_001'));
      expect(updated.status, equals('SUCCESS'));
      expect(updated.webhookVerified, isTrue);
    });
  });
}
