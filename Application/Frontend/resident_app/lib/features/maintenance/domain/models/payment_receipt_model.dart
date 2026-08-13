import 'package:cloud_firestore/cloud_firestore.dart';

class PaymentReceiptModel {
  final String id;
  final String billId;
  final String residentUid;
  final String societyId;
  final double amount;
  final String paymentMethod;
  final String transactionId;
  final String invoiceNumber;
  final String billingPeriod;
  final String status;
  final String paidAt;
  final String createdAt;

  const PaymentReceiptModel({
    required this.id,
    required this.billId,
    required this.residentUid,
    required this.societyId,
    required this.amount,
    required this.paymentMethod,
    required this.transactionId,
    required this.invoiceNumber,
    required this.billingPeriod,
    required this.status,
    required this.paidAt,
    required this.createdAt,
  });

  factory PaymentReceiptModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return PaymentReceiptModel.fromMap(doc.id, data);
  }

  factory PaymentReceiptModel.fromMap(String docId, Map<String, dynamic> map) {
    final paidTime = map['paidAt'] as String? ?? map['createdAt'] as String? ?? '';
    return PaymentReceiptModel(
      id: docId,
      billId: map['billId'] as String? ?? '',
      residentUid: map['residentUid'] as String? ?? '',
      societyId: map['societyId'] as String? ?? '',
      amount: (map['amount'] as num?)?.toDouble() ?? 0.0,
      paymentMethod: map['paymentMethod'] as String? ?? 'UPI',
      transactionId: map['transactionId'] as String? ?? 'TXN000000',
      invoiceNumber: map['invoiceNumber'] as String? ?? 'INV-001',
      billingPeriod: map['billingPeriod'] as String? ?? 'Monthly Maintenance',
      status: map['status'] as String? ?? 'success',
      paidAt: paidTime,
      createdAt: map['createdAt'] as String? ?? paidTime,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'billId': billId,
      'residentUid': residentUid,
      'societyId': societyId,
      'amount': amount,
      'paymentMethod': paymentMethod,
      'transactionId': transactionId,
      'invoiceNumber': invoiceNumber,
      'billingPeriod': billingPeriod,
      'status': status,
      'paidAt': paidAt,
      'createdAt': createdAt,
    };
  }

  String get formattedDate {
    if (paidAt.length >= 10) return paidAt.substring(0, 10);
    return paidAt;
  }
}
