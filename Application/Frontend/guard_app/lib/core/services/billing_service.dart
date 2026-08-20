import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Handles Maintenance Invoices, Dues, and Payment Receipts.
class BillingService {
  final FirebaseFirestore _db;
  final String societyId;

  BillingService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  Stream<QuerySnapshot> maintenanceBillsStream(String uid) {
    return _db
        .collection('societies/$societyId/maintenance_bills')
        .where('residentUid', isEqualTo: uid)
        .snapshots();
  }

  Stream<QuerySnapshot> paymentReceiptsStream(String uid) {
    return _db
        .collection('societies/$societyId/payment_receipts')
        .where('residentUid', isEqualTo: uid)
        .snapshots();
  }

  Future<void> payMaintenanceBill({
    required String billId,
    required String residentUid,
    required double amount,
    required String paymentMethod,
    required String invoiceNumber,
    required String billingPeriod,
  }) async {
    final nowStr = DateTime.now().toIso8601String();
    final txnId = 'TXN${DateTime.now().millisecondsSinceEpoch}';

    await _db
        .collection('societies/$societyId/maintenance_bills')
        .doc(billId)
        .set({
      'status': 'paid',
      'paidAt': nowStr,
      'paymentMethod': paymentMethod,
      'transactionId': txnId,
    }, SetOptions(merge: true));

    await _db.collection('societies/$societyId/payment_receipts').add({
      'billId': billId,
      'residentUid': residentUid,
      'amount': amount,
      'paymentMethod': paymentMethod,
      'transactionId': txnId,
      'invoiceNumber': invoiceNumber,
      'billingPeriod': billingPeriod,
      'status': 'success',
      'paidAt': nowStr,
      'createdAt': nowStr,
      'societyId': societyId,
    });
  }
}
