import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../../../firebase_options.dart';
import '../doorbell_call_service.dart';
import 'doorbell_sound_service.dart';

/// Constants for Notification Actions
class NotificationActionKeys {
  static const String allow = 'action_allow';
  static const String leaveAtGate = 'action_leave_at_gate';
  static const String deny = 'action_deny';
}

/// Top-level background notification response handler executed in an isolated VM.
/// Processes direct 1-tap notification actions (Allow, Leave at Gate, Deny) with zero app launch.
@pragma('vm:entry-point')
Future<void> notificationBackgroundActionHandler(NotificationResponse response) async {
  debugPrint('notificationBackgroundActionHandler: Action ${response.actionId} with payload: ${response.payload}');

  if (response.payload == null || response.payload!.isEmpty) return;

  try {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    }

    final data = jsonDecode(response.payload!) as Map<String, dynamic>;
    final societyId = (data['societyId'] as String? ?? '').trim();
    final visitorId = (data['visitorId'] as String? ?? '').trim();

    if (societyId.isEmpty || visitorId.isEmpty) return;

    final actionId = response.actionId;
    final nowIso = DateTime.now().toIso8601String();

    // Stop doorbell chime if active
    try {
      await DoorbellSoundService.instance.stop();
    } catch (_) {}

    if (actionId == NotificationActionKeys.allow) {
      await FirebaseFirestore.instance
          .doc('societies/$societyId/visitors/$visitorId')
          .update({
        'status': 'approved',
        'approvedAt': nowIso,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      try {
        await DoorbellCallService.endDoorbellCall(visitorId);
      } catch (_) {}
      debugPrint('Visitor $visitorId APPROVED via 1-tap notification action');
    } else if (actionId == NotificationActionKeys.leaveAtGate) {
      await FirebaseFirestore.instance
          .doc('societies/$societyId/visitors/$visitorId')
          .update({
        'status': 'leave_at_gate',
        'leaveAtGateAt': nowIso,
        'notes': 'Resident instructed to leave delivery at guard desk',
        'updatedAt': FieldValue.serverTimestamp(),
      });
      try {
        await DoorbellCallService.endDoorbellCall(visitorId);
      } catch (_) {}
      debugPrint('Visitor $visitorId LEAVE AT GATE via 1-tap notification action');
    } else if (actionId == NotificationActionKeys.deny) {
      await FirebaseFirestore.instance
          .doc('societies/$societyId/visitors/$visitorId')
          .update({
        'status': 'rejected',
        'rejectedAt': nowIso,
        'rejectionReason': 'Denied by resident via 1-tap notification action',
        'updatedAt': FieldValue.serverTimestamp(),
      });
      try {
        await DoorbellCallService.endDoorbellCall(visitorId);
      } catch (_) {}
      debugPrint('Visitor $visitorId DENIED via 1-tap notification action');
    }
  } catch (e) {
    debugPrint('Error processing background notification action: $e');
  }
}
