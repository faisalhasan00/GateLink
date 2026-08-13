import 'package:cloud_firestore/cloud_firestore.dart';
import 'payment_status.dart';

class MaintenanceBillModel {
  final String id;
  final String invoiceNumber;
  final String billingPeriod;
  final String month;
  final String dueDate;
  final double amount;
  final double maintenanceCharge;
  final double waterCharge;
  final double parkingCharge;
  final double sinkingFund;
  final double penaltyFee;
  final PaymentStatus status;
  final String residentUid;
  final String flatNumber;
  final String societyId;
  final String? transactionId;
  final String? paymentMethod;
  final String? utrNumber;
  final String? createdAt;
  final String? paidAt;
  final String? submittedAt;

  const MaintenanceBillModel({
    required this.id,
    required this.invoiceNumber,
    required this.billingPeriod,
    required this.month,
    required this.dueDate,
    required this.amount,
    required this.maintenanceCharge,
    required this.waterCharge,
    required this.parkingCharge,
    required this.sinkingFund,
    required this.penaltyFee,
    required this.status,
    required this.residentUid,
    required this.flatNumber,
    required this.societyId,
    this.transactionId,
    this.paymentMethod,
    this.utrNumber,
    this.createdAt,
    this.paidAt,
    this.submittedAt,
  });

  factory MaintenanceBillModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return MaintenanceBillModel.fromMap(doc.id, data);
  }

  factory MaintenanceBillModel.fromMap(String docId, Map<String, dynamic> map) {
    final invNum = map['invoiceNumber'] as String? ??
        map['billNumber'] as String? ??
        'INV-${docId.length >= 6 ? docId.substring(0, 6) : docId}';

    final period = map['billingPeriod'] as String? ??
        map['month'] as String? ??
        'Monthly Maintenance';

    return MaintenanceBillModel(
      id: docId,
      invoiceNumber: invNum,
      billingPeriod: period,
      month: map['month'] as String? ?? period,
      dueDate: map['dueDate'] as String? ?? '28th of Month',
      amount: (map['amount'] as num?)?.toDouble() ?? 0.0,
      maintenanceCharge: (map['maintenanceCharge'] as num?)?.toDouble() ??
          (map['maintenanceCharges'] as num?)?.toDouble() ??
          2500.0,
      waterCharge: (map['waterCharge'] as num?)?.toDouble() ??
          (map['waterCharges'] as num?)?.toDouble() ??
          400.0,
      parkingCharge: (map['parkingCharge'] as num?)?.toDouble() ?? 400.0,
      sinkingFund: (map['sinkingFund'] as num?)?.toDouble() ?? 200.0,
      penaltyFee: (map['penaltyFee'] as num?)?.toDouble() ??
          (map['lateFee'] as num?)?.toDouble() ??
          0.0,
      status: PaymentStatus.fromString(map['status'] as String?),
      residentUid: map['residentUid'] as String? ?? '',
      flatNumber: map['flatNumber'] as String? ?? '',
      societyId: map['societyId'] as String? ?? '',
      transactionId: map['transactionId'] as String?,
      paymentMethod: map['paymentMethod'] as String?,
      utrNumber: map['utrNumber'] as String?,
      createdAt: map['createdAt'] as String?,
      paidAt: map['paidAt'] as String?,
      submittedAt: map['submittedAt'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'invoiceNumber': invoiceNumber,
      'billingPeriod': billingPeriod,
      'month': month,
      'dueDate': dueDate,
      'amount': amount,
      'maintenanceCharge': maintenanceCharge,
      'waterCharge': waterCharge,
      'parkingCharge': parkingCharge,
      'sinkingFund': sinkingFund,
      'penaltyFee': penaltyFee,
      'status': status.toFirestore(),
      'residentUid': residentUid,
      'flatNumber': flatNumber,
      'societyId': societyId,
      if (transactionId != null) 'transactionId': transactionId,
      if (paymentMethod != null) 'paymentMethod': paymentMethod,
      if (utrNumber != null) 'utrNumber': utrNumber,
      if (createdAt != null) 'createdAt': createdAt,
      if (paidAt != null) 'paidAt': paidAt,
      if (submittedAt != null) 'submittedAt': submittedAt,
    };
  }

  bool get isPaid => status == PaymentStatus.paid;
  bool get isPending => status == PaymentStatus.pending;
  bool get isPendingVerification => status == PaymentStatus.pendingVerification;
  bool get isOverdue => status == PaymentStatus.overdue;
}
