import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/services/firestore_service.dart';
import '../../domain/models/maintenance_bill_model.dart';
import '../../domain/models/payment_receipt_model.dart';
import '../../domain/models/payment_status.dart';
import '../../domain/repositories/maintenance_repository.dart';

class MaintenanceRepositoryImpl implements MaintenanceRepository {
  final FirestoreService _firestoreService;
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  MaintenanceRepositoryImpl(this._firestoreService);

  @override
  Stream<List<MaintenanceBillModel>> watchMaintenanceBills(String residentUid) {
    return _firestoreService
        .maintenanceBillsStream(residentUid)
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => MaintenanceBillModel.fromFirestore(doc))
          .toList();
    });
  }

  @override
  Stream<List<PaymentReceiptModel>> watchPaymentReceipts(String residentUid) {
    return _firestoreService.paymentReceiptsStream(residentUid).map((snapshot) {
      return snapshot.docs
          .map((doc) => PaymentReceiptModel.fromFirestore(doc))
          .toList();
    });
  }

  @override
  Future<MaintenanceBillModel?> getPendingBill(String residentUid) async {
    final snap = await _db
        .collection(
            'societies/${_firestoreService.societyId}/maintenance_bills')
        .where('residentUid', whereIn: [residentUid, 'ALL'])
        .get();

    if (snap.docs.isEmpty) return null;

    final pendingDocs = snap.docs
        .map((doc) => MaintenanceBillModel.fromFirestore(doc))
        .where((bill) => bill.status != PaymentStatus.paid)
        .toList();

    if (pendingDocs.isNotEmpty) return pendingDocs.first;
    return MaintenanceBillModel.fromFirestore(snap.docs.first);
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
    final activeSocId =
        societyId.isNotEmpty ? societyId : _firestoreService.societyId;
    final nowStr = DateTime.now().toIso8601String();

    await _db.doc('societies/$activeSocId/maintenance_bills/$billId').set({
      'status': 'pending_verification',
      'utrNumber': referenceNumber,
      'transactionId': referenceNumber,
      'paymentMethod': 'Offline Payment',
      'submittedAt': nowStr,
      'residentUid': residentUid,
      'residentName': residentName,
      'flatNumber': flatNumber,
    }, SetOptions(merge: true));

    try {
      await _db.collection('societies/$activeSocId/notifications').add({
        'title': 'New Offline Payment Submitted',
        'body':
            'Flat $flatNumber ($residentName) submitted ref $referenceNumber for Bill $invoiceNumber. Treasurer verification required.',
        'type': 'billing_verification',
        'billId': billId,
        'utrNumber': referenceNumber,
        'createdAt': nowStr,
        'isRead': false,
      });
    } catch (_) {}
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
    final activeSocId =
        societyId.isNotEmpty ? societyId : _firestoreService.societyId;
    final nowStr = DateTime.now().toIso8601String();

    final paymentRecord = {
      'internalPaymentId': internalPaymentId,
      'cashfreeOrderId': orderId,
      'cashfreePaymentId': null,
      'cashfreeRefundId': null,
      'societyId': activeSocId,
      'maintenanceBillId': billId,
      'residentUid': residentUid,
      'flatNumber': flatNumber,
      'amount': amount,
      'currency': 'INR',
      'status': 'PENDING',
      'webhookVerified': false,
      'apiVerified': false,
      'createdAt': nowStr,
      'updatedAt': nowStr,
    };

    await _db.collection('payments').doc(internalPaymentId).set(paymentRecord);
  }

  @override
  Future<void> seedDemoBills({
    required String societyId,
    required String residentUid,
    required String flatNumber,
  }) async {
    final activeSocId =
        societyId.isNotEmpty ? societyId : _firestoreService.societyId;
    final batch = _db.batch();

    final bills = [
      {
        'invoiceNumber': 'INV-2026-6832',
        'billingPeriod': 'August 2026',
        'month': 'August 2026',
        'dueDate': '28 Aug 2026',
        'amount': 3500.0,
        'maintenanceCharge': 2500.0,
        'waterCharge': 500.0,
        'parkingCharge': 300.0,
        'sinkingFund': 200.0,
        'status': 'pending',
        'residentUid': residentUid,
        'flatNumber': flatNumber,
        'createdAt': DateTime.now().toIso8601String(),
      },
      {
        'invoiceNumber': 'INV-2026-5120',
        'billingPeriod': 'July 2026',
        'month': 'July 2026',
        'dueDate': '28 Jul 2026',
        'amount': 3500.0,
        'maintenanceCharge': 2500.0,
        'waterCharge': 500.0,
        'parkingCharge': 300.0,
        'sinkingFund': 200.0,
        'status': 'paid',
        'paidAt': '2026-07-25T14:32:00Z',
        'paymentMethod': 'Cashfree Online',
        'transactionId': 'CF-PAY-98310',
        'residentUid': residentUid,
        'flatNumber': flatNumber,
        'createdAt': '2026-07-01T00:00:00Z',
      },
    ];

    for (final b in bills) {
      final ref =
          _db.collection('societies/$activeSocId/maintenance_bills').doc();
      batch.set(ref, b);
    }

    await batch.commit();
  }
}
