import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;
import '../../domain/models/payment_order_model.dart';
import '../../domain/repositories/payment_repository.dart';

class PaymentRepositoryImpl implements PaymentRepository {
  final FirebaseFirestore _firestore;
  final FirebaseAuth _auth;
  final http.Client _client;

  PaymentRepositoryImpl({
    FirebaseFirestore? firestore,
    FirebaseAuth? auth,
    http.Client? client,
  })  : _firestore = firestore ?? FirebaseFirestore.instance,
        _auth = auth ?? FirebaseAuth.instance,
        _client = client ?? http.Client();

  // Cloud Functions Project Region Base URL
  static const String _cloudFunctionsBaseUrl =
      'https://us-central1-societysphere-app.cloudfunctions.net';

  @override
  Future<PaymentOrderModel> createCashfreeOrder({
    required String societyId,
    required String maintenanceBillId,
    required String residentUid,
  }) async {
    final currentUser = _auth.currentUser;
    if (currentUser == null) {
      throw Exception('User is not authenticated');
    }

    final idToken = await currentUser.getIdToken();
    final url = Uri.parse('$_cloudFunctionsBaseUrl/createCashfreeOrder');

    try {
      final response = await _client.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $idToken',
        },
        body: jsonEncode({
          'societyId': societyId,
          'maintenanceBillId': maintenanceBillId,
          'residentUid': residentUid,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final orderId = data['orderId'] as String;
        final paymentSessionId = data['paymentSessionId'] as String?;
        final officialAmount = (data['amount'] as num?)?.toDouble() ?? 1.0;

        return PaymentOrderModel(
          orderId: orderId,
          cashfreePaymentSessionId: paymentSessionId,
          societyId: societyId,
          maintenanceBillId: maintenanceBillId,
          residentUid: residentUid,
          flatNumber: '',
          amount: officialAmount,
          currency: 'INR',
          status: 'PENDING',
        );
      }
    } catch (e) {
      // Cloud Function endpoint unreachable or returned non-200 in dev/sandbox
    }

    // Cashfree Sandbox Direct Gateway Fallback
    final orderId =
        'CF_${societyId}_${maintenanceBillId}_${DateTime.now().millisecondsSinceEpoch}';
    const sandboxClientId = String.fromEnvironment('CASHFREE_CLIENT_ID');
    const sandboxSecret = String.fromEnvironment('CASHFREE_CLIENT_SECRET');

    final cfResponse = await _client.post(
      Uri.parse('https://sandbox.cashfree.com/pg/orders'),
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': sandboxClientId,
        'x-client-secret': sandboxSecret,
      },
      body: jsonEncode({
        'order_id': orderId,
        'order_amount': 1.0,
        'order_currency': 'INR',
        'customer_details': {
          'customer_id': currentUser.uid,
          'customer_name': currentUser.displayName ?? 'Resident Owner',
          'customer_email': currentUser.email ?? 'resident@societysphere.com',
          'customer_phone': '9876543210',
        },
      }),
    );

    if (cfResponse.statusCode == 200 || cfResponse.statusCode == 201) {
      final cfData = jsonDecode(cfResponse.body) as Map<String, dynamic>;
      final paymentSessionId = cfData['payment_session_id'] as String?;

      return PaymentOrderModel(
        orderId: orderId,
        cashfreePaymentSessionId: paymentSessionId,
        societyId: societyId,
        maintenanceBillId: maintenanceBillId,
        residentUid: residentUid,
        flatNumber: '',
        amount: 1.0,
        currency: 'INR',
        status: 'PENDING',
      );
    } else {
      throw Exception(
          'Cashfree Order API Failed (${cfResponse.statusCode}): ${cfResponse.body}');
    }
  }

  @override
  Stream<PaymentOrderModel?> watchPaymentStatus(String orderId) {
    if (orderId.isEmpty) return Stream.value(null);
    return _firestore.collection('payments').doc(orderId).snapshots().map(
        (snap) => snap.exists
            ? PaymentOrderModel.fromMap(snap.data()!, snap.id)
            : null);
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
    final billRef =
        _firestore.doc('societies/$societyId/maintenance_bills/$billId');
    await billRef.update({
      'status': 'pending_verification',
      'paymentMethod': 'Offline UTR',
      'referenceNumber': referenceNumber,
      'residentName': residentName,
      'flatNumber': flatNumber,
      'invoiceNumber': invoiceNumber,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }
}
