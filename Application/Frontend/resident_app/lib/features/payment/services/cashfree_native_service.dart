import 'package:flutter/foundation.dart';
import 'package:flutter_cashfree_pg_sdk/api/cferrorresponse/cferrorresponse.dart';
import 'package:flutter_cashfree_pg_sdk/api/cfpayment/cfwebcheckoutpayment.dart';
import 'package:flutter_cashfree_pg_sdk/api/cfpaymentgateway/cfpaymentgatewayservice.dart';
import 'package:flutter_cashfree_pg_sdk/api/cfsession/cfsession.dart';
import 'package:flutter_cashfree_pg_sdk/utils/cfenums.dart';
import 'package:flutter_cashfree_pg_sdk/utils/cfexceptions.dart';

typedef OnCashfreeSuccess = void Function(String orderId);
typedef OnCashfreeError = void Function(String errorMessage, String? orderId);

class CashfreeNativeService {
  static final CashfreeNativeService _instance = CashfreeNativeService._internal();
  factory CashfreeNativeService() => _instance;
  CashfreeNativeService._internal();

  final CFPaymentGatewayService _gatewayService = CFPaymentGatewayService();
  OnCashfreeSuccess? _onSuccessCallback;
  OnCashfreeError? _onErrorCallback;
  bool _callbackRegistered = false;

  void _initCallbacks() {
    if (_callbackRegistered) return;
    _gatewayService.setCallback(
      (String orderId) {
        debugPrint('[CashfreeNativeSDK] Payment Success Callback for order: $orderId');
        _onSuccessCallback?.call(orderId);
      },
      (CFErrorResponse errorResponse, String orderId) {
        final errorMsg = errorResponse.getMessage() ?? 'Payment cancelled or failed';
        final errorCode = errorResponse.getCode() ?? 'UNKNOWN_ERROR';
        debugPrint('[CashfreeNativeSDK] Payment Error Callback: [$errorCode] $errorMsg for order: $orderId');
        _onErrorCallback?.call(errorMsg, orderId);
      },
    );
    _callbackRegistered = true;
  }

  /// Initiates native Cashfree Web Checkout within the native SDK dialog using the server-generated payment session ID
  Future<void> startCheckout({
    required String orderId,
    required String paymentSessionId,
    required CFEnvironment environment,
    required OnCashfreeSuccess onSuccess,
    required OnCashfreeError onError,
  }) async {
    _onSuccessCallback = onSuccess;
    _onErrorCallback = onError;
    _initCallbacks();

    try {
      final session = CFSessionBuilder()
          .setEnvironment(environment)
          .setOrderId(orderId)
          .setPaymentSessionId(paymentSessionId)
          .build();

      final webCheckoutPayment = CFWebCheckoutPaymentBuilder()
          .setSession(session)
          .build();

      debugPrint('[CashfreeNativeSDK] Launching native doPayment for orderId: $orderId, env: $environment');
      _gatewayService.doPayment(webCheckoutPayment);
    } on CFException catch (e) {
      debugPrint('[CashfreeNativeSDK] CFException caught: ${e.message}');
      onError(e.message, orderId);
    } catch (e) {
      debugPrint('[CashfreeNativeSDK] Unknown Exception caught: $e');
      onError(e.toString(), orderId);
    }
  }
}
