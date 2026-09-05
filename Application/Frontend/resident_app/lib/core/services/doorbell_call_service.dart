import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_callkit_incoming/flutter_callkit_incoming.dart';
import 'package:flutter_callkit_incoming/entities/entities.dart';
import '../../firebase_options.dart';

/// Top-level or background CallKit event listener for action buttons on the CallKit UI
@pragma('vm:entry-point')
Future<void> onCallkitEvent(CallEvent event) async {
  debugPrint('CallKit Event received: ${event.event} with body: ${event.body}');

  final extra = event.body['extra'] as Map<dynamic, dynamic>? ?? {};
  final visitorId = extra['visitorId'] as String? ?? '';
  final societyId = extra['societyId'] as String? ?? '';

  if (visitorId.isEmpty || societyId.isEmpty) return;

  try {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    }

    final nowIso = DateTime.now().toIso8601String();

    switch (event.event) {
      case Event.actionCallAccept:
        debugPrint('Doorbell Call ACCEPTED for visitor: $visitorId');
        await FirebaseFirestore.instance
            .doc('societies/$societyId/visitors/$visitorId')
            .update({
          'status': 'approved',
          'approvedAt': nowIso,
          'updatedAt': FieldValue.serverTimestamp(),
        });
        await FlutterCallkitIncoming.endCall(event.body['id'] as String);
        break;

      case Event.actionCallDecline:
        debugPrint('Doorbell Call REJECTED for visitor: $visitorId');
        await FirebaseFirestore.instance
            .doc('societies/$societyId/visitors/$visitorId')
            .update({
          'status': 'rejected',
          'rejectedAt': nowIso,
          'rejectionReason': 'Denied via Doorbell Call Alert',
          'updatedAt': FieldValue.serverTimestamp(),
        });
        await FlutterCallkitIncoming.endCall(event.body['id'] as String);
        break;

      case Event.actionCallTimeout:
        debugPrint('Doorbell Call TIMEOUT for visitor: $visitorId');
        await FlutterCallkitIncoming.endCall(event.body['id'] as String);
        break;

      default:
        break;
    }
  } catch (e) {
    debugPrint('Error handling CallKit event: $e');
  }
}

/// Service managing full-screen incoming doorbell call alerts for visitor arrivals.
class DoorbellCallService {
  DoorbellCallService._();

  static bool _initialized = false;

  /// Initialize CallKit event listeners
  static Future<void> init() async {
    if (_initialized) return;

    try {
      await FlutterCallkitIncoming.requestFullIntentPermission();
    } catch (e) {
      debugPrint('CallKit permission note: $e');
    }

    FlutterCallkitIncoming.onEvent.listen((event) async {
      if (event != null) {
        await onCallkitEvent(event);
      }
    });

    _initialized = true;
    debugPrint('DoorbellCallService initialized');
  }

  /// Trigger a full-screen incoming call ringing UI for visitor arrival
  static Future<void> showIncomingDoorbellCall({
    required String visitorName,
    required String visitorType,
    required String flatNumber,
    required String visitorId,
    required String societyId,
    String? company,
    String? vehicleNumber,
    String? gateName,
    String? photoUrl,
  }) async {
    await init();

    final callId = visitorId.isNotEmpty
        ? visitorId
        : DateTime.now().millisecondsSinceEpoch.toString();

    final partnerBadge = (company != null && company.trim().isNotEmpty)
        ? company.trim()
        : visitorType;
    final plateInfo = (vehicleNumber != null && vehicleNumber.trim().isNotEmpty)
        ? ' • Plate: ${vehicleNumber.trim()}'
        : '';
    final gateLoc = (gateName != null && gateName.trim().isNotEmpty)
        ? gateName.trim()
        : 'Main Gate';

    final CallKitParams callKitParams = CallKitParams(
      id: callId,
      nameCaller: '🚨 Live at $gateLoc — Flat $flatNumber',
      appName: 'GateLink Security',
      avatar: (photoUrl != null && photoUrl.trim().isNotEmpty)
          ? photoUrl.trim()
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      handle: '🛵 $partnerBadge ($visitorName)$plateInfo',
      type: 0, // 0: Audio Call / Doorbell, 1: Video
      duration: 30000, // Ring for 30s
      textAccept: 'Allow Entry',
      textDecline: 'Deny',
      missedCallNotification: const NotificationParams(
        showNotification: true,
        isShowCallback: true,
        subtitle: 'Missed Visitor Approval',
        callbackText: 'Open App',
      ),
      extra: <String, dynamic>{
        'visitorId': visitorId,
        'societyId': societyId,
        'visitorName': visitorName,
        'visitorType': visitorType,
        'flatNumber': flatNumber,
        'company': company ?? '',
        'vehicleNumber': vehicleNumber ?? '',
        'gateName': gateName ?? '',
        'photoUrl': photoUrl ?? '',
      },
      headers: <String, dynamic>{
        'platform': 'flutter',
      },
      android: const AndroidParams(
        isCustomNotification: true,
        isShowLogo: false,
        ringtonePath: 'resident_bell',
        backgroundColor: '#1E3A8A', // Primary Navy
        actionColor: '#0EA5E9',
        textColor: '#FFFFFF',
        incomingCallNotificationChannelName: '🚪 Gate & Visitor Doorbell',
        isShowCallID: true,
      ),
      ios: const IOSParams(
        iconName: 'AppIcon',
        handleType: 'generic',
        supportsGrouping: true,
        supportsVideo: false,
        ringtonePath: 'resident_bell.caf',
      ),
    );

    try {
      await FlutterCallkitIncoming.showCallkitIncoming(callKitParams);
      debugPrint('CallKit Doorbell UI triggered for visitor $visitorName ($visitorId)');
    } catch (e) {
      debugPrint('Error showing CallKit Doorbell: $e');
    }
  }

  /// End active call UI
  static Future<void> endDoorbellCall(String visitorId) async {
    try {
      await FlutterCallkitIncoming.endCall(visitorId);
    } catch (e) {
      debugPrint('Error ending CallKit: $e');
    }
  }
}
