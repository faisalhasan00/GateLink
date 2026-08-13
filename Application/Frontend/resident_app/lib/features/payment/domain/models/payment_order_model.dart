import 'package:flutter/foundation.dart';

@immutable
class PaymentOrderModel {
  final String orderId;
  final String? cashfreePaymentId;
  final String? cashfreePaymentSessionId;
  final String societyId;
  final String maintenanceBillId;
  final String residentUid;
  final String flatNumber;
  final double amount;
  final String currency;
  final String status; // PENDING, SUCCESS, FAILED, FLAGGED_AMOUNT_MISMATCH
  final String? paymentMethod;
  final bool webhookVerified;
  final bool apiVerified;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? paidAt;

  const PaymentOrderModel({
    required this.orderId,
    this.cashfreePaymentId,
    this.cashfreePaymentSessionId,
    required this.societyId,
    required this.maintenanceBillId,
    required this.residentUid,
    required this.flatNumber,
    required this.amount,
    this.currency = 'INR',
    this.status = 'PENDING',
    this.paymentMethod,
    this.webhookVerified = false,
    this.apiVerified = false,
    this.createdAt,
    this.updatedAt,
    this.paidAt,
  });

  factory PaymentOrderModel.fromMap(Map<String, dynamic> map, String documentId) {
    DateTime? parseDate(dynamic value) {
      if (value == null) return null;
      if (value is DateTime) return value;
      if (value is String) return DateTime.tryParse(value);
      if (value.runtimeType.toString().contains('Timestamp')) {
        try {
          return (value as dynamic).toDate() as DateTime;
        } catch (_) {}
      }
      return null;
    }

    return PaymentOrderModel(
      orderId: map['cashfreeOrderId'] as String? ?? documentId,
      cashfreePaymentId: map['cashfreePaymentId'] as String?,
      cashfreePaymentSessionId: map['cashfreePaymentSessionId'] as String?,
      societyId: map['societyId'] as String? ?? '',
      maintenanceBillId: map['maintenanceBillId'] as String? ?? '',
      residentUid: map['residentUid'] as String? ?? '',
      flatNumber: map['flatNumber'] as String? ?? '',
      amount: (map['amount'] as num?)?.toDouble() ?? 0.0,
      currency: map['currency'] as String? ?? 'INR',
      status: map['status'] as String? ?? 'PENDING',
      paymentMethod: map['paymentMethod'] as String?,
      webhookVerified: map['webhookVerified'] as bool? ?? false,
      apiVerified: map['apiVerified'] as bool? ?? false,
      createdAt: parseDate(map['createdAt']),
      updatedAt: parseDate(map['updatedAt']),
      paidAt: parseDate(map['paidAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'cashfreeOrderId': orderId,
      'cashfreePaymentId': cashfreePaymentId,
      'cashfreePaymentSessionId': cashfreePaymentSessionId,
      'societyId': societyId,
      'maintenanceBillId': maintenanceBillId,
      'residentUid': residentUid,
      'flatNumber': flatNumber,
      'amount': amount,
      'currency': currency,
      'status': status,
      'paymentMethod': paymentMethod,
      'webhookVerified': webhookVerified,
      'apiVerified': apiVerified,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'paidAt': paidAt?.toIso8601String(),
    };
  }

  PaymentOrderModel copyWith({
    String? orderId,
    String? cashfreePaymentId,
    String? cashfreePaymentSessionId,
    String? societyId,
    String? maintenanceBillId,
    String? residentUid,
    String? flatNumber,
    double? amount,
    String? currency,
    String? status,
    String? paymentMethod,
    bool? webhookVerified,
    bool? apiVerified,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? paidAt,
  }) {
    return PaymentOrderModel(
      orderId: orderId ?? this.orderId,
      cashfreePaymentId: cashfreePaymentId ?? this.cashfreePaymentId,
      cashfreePaymentSessionId: cashfreePaymentSessionId ?? this.cashfreePaymentSessionId,
      societyId: societyId ?? this.societyId,
      maintenanceBillId: maintenanceBillId ?? this.maintenanceBillId,
      residentUid: residentUid ?? this.residentUid,
      flatNumber: flatNumber ?? this.flatNumber,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      status: status ?? this.status,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      webhookVerified: webhookVerified ?? this.webhookVerified,
      apiVerified: apiVerified ?? this.apiVerified,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      paidAt: paidAt ?? this.paidAt,
    );
  }
}
