import 'package:flutter/foundation.dart';

/// Direct Google Cloud FCM Push Notification Service.
/// SEC-P0: Hardcoded service account credentials REMOVED.
/// Visitor arrival notifications are automatically dispatched by server-side
/// Cloud Function triggers (`notifyResidentOnVisitorArrival`).
class FcmPushService {
  FcmPushService._();

  /// Server-side Cloud Function handles dispatch automatically on visitor document creation.
  static Future<bool> sendVisitorNotification({
    required String fcmToken,
    required String visitorName,
    required String visitorType,
    required String hostFlat,
    required String visitorId,
    required String societyId,
  }) async {
    debugPrint('Visitor arrival notification delegated to server-side Cloud Function trigger: $visitorId');
    return true;
  }
}

