import 'dart:convert';
import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../../firebase_options.dart';

/// Top-level background notification response handler (for action buttons when app is backgrounded or closed).
@pragma('vm:entry-point')
Future<void> notificationBackgroundActionHandler(NotificationResponse response) async {
  debugPrint('Notification background action received: ${response.actionId} with payload: ${response.payload}');

  if (response.payload == null || response.payload!.isEmpty) return;

  try {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    }

    final data = jsonDecode(response.payload!) as Map<String, dynamic>;
    final societyId = data['societyId'] as String? ?? '';
    final visitorId = data['visitorId'] as String? ?? '';

    if (societyId.isEmpty || visitorId.isEmpty) return;

    final actionId = response.actionId;
    final nowIso = DateTime.now().toIso8601String();

    if (actionId == NotificationService.actionApprove) {
      await FirebaseFirestore.instance
          .doc('societies/$societyId/visitors/$visitorId')
          .update({
        'status': 'approved',
        'approvedAt': nowIso,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      debugPrint('Visitor $visitorId approved via background notification action');
    } else if (actionId == NotificationService.actionReject) {
      await FirebaseFirestore.instance
          .doc('societies/$societyId/visitors/$visitorId')
          .update({
        'status': 'rejected',
        'rejectedAt': nowIso,
        'rejectionReason': 'Denied via quick notification action',
        'updatedAt': FieldValue.serverTimestamp(),
      });
      debugPrint('Visitor $visitorId rejected via background notification action');
    }
  } catch (e) {
    debugPrint('Error processing background notification action: $e');
  }
}

/// Production-grade Local & Heads-up Notification Engine.
/// Configures high-importance Android channels with sound, vibration, and
/// interactive Action Buttons (Approve & Reject) for instant delivery.
class NotificationService {
  NotificationService._();
  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static const String channelGateId = 'gate_security_channel';
  static const String channelEmergencyId = 'emergency_alerts_channel';
  static const String channelUpdatesId = 'society_updates_channel';

  static const String actionApprove = 'action_approve';
  static const String actionReject = 'action_reject';

  static Future<void> init() async {
    if (_initialized) return;

    // 1. Android Notification Channels (High Priority & Heads-up Banner)
    const gateChannel = AndroidNotificationChannel(
      channelGateId,
      'Gate & Visitor Alerts',
      description: 'Immediate alerts with Approve/Reject buttons when visitors arrive.',
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
    );

    const emergencyChannel = AndroidNotificationChannel(
      channelEmergencyId,
      'Emergency SOS Alerts',
      description: 'High-priority emergency alerts and safety broadcasts.',
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
    );

    const updatesChannel = AndroidNotificationChannel(
      channelUpdatesId,
      'Society Notices & Bills',
      description: 'Announcements, maintenance invoices, and society notices.',
      importance: Importance.high,
      playSound: true,
    );

    final androidPlugin = _plugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    if (androidPlugin != null) {
      await androidPlugin.createNotificationChannel(gateChannel);
      await androidPlugin.createNotificationChannel(emergencyChannel);
      await androidPlugin.createNotificationChannel(updatesChannel);

      // Request notification permissions for Android 13+ (API 33+)
      if (Platform.isAndroid) {
        await androidPlugin.requestNotificationsPermission();
      }
    }

    // 2. Initialization Settings
    const initSettings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) async {
        debugPrint('Notification foreground action: ${response.actionId} with payload: ${response.payload}');
        if (response.actionId != null && response.actionId!.isNotEmpty) {
          await notificationBackgroundActionHandler(response);
        }
      },
      onDidReceiveBackgroundNotificationResponse: notificationBackgroundActionHandler,
    );

    _initialized = true;
    debugPrint('NotificationService initialized successfully with action buttons');
  }

  /// Trigger a heads-up gate arrival notification with 2 action buttons: Approve and Reject
  static Future<void> showVisitorAlert({
    required String visitorName,
    required String visitorType,
    required String flatNumber,
    String? visitorId,
    String? societyId,
  }) async {
    await init();

    final payloadData = jsonEncode({
      'visitorId': visitorId ?? '',
      'societyId': societyId ?? '',
      'visitorName': visitorName,
      'flatNumber': flatNumber,
    });

    final notifId = visitorId != null && visitorId.isNotEmpty
        ? visitorId.hashCode.remainder(100000)
        : DateTime.now().millisecondsSinceEpoch.remainder(100000);

    await _plugin.show(
      notifId,
      '🚪 Visitor at Gate — Flat $flatNumber',
      '$visitorName ($visitorType) is waiting for your entry approval.',
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelGateId,
          'Gate & Visitor Alerts',
          channelDescription: 'Visitor arrival alerts with Approve/Reject buttons',
          importance: Importance.max,
          priority: Priority.max,
          playSound: true,
          enableVibration: true,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(
            '$visitorName ($visitorType) is at the security gate for Flat $flatNumber. Please approve or deny entry.',
            contentTitle: '🚪 Visitor Approval — Flat $flatNumber',
            summaryText: 'Gate Request',
          ),
          actions: const <AndroidNotificationAction>[
            AndroidNotificationAction(
              actionApprove,
              'Approve ✅',
              showsUserInterface: false,
              cancelNotification: true,
            ),
            AndroidNotificationAction(
              actionReject,
              'Reject ❌',
              showsUserInterface: false,
              cancelNotification: true,
            ),
          ],
        ),
      ),
      payload: payloadData,
    );
  }

  /// Trigger an Emergency SOS broadcast notification
  static Future<void> showSosAlert({
    required String residentName,
    required String flatNumber,
    required String alertType,
  }) async {
    await init();
    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      '🚨 EMERGENCY SOS ALERT: Flat $flatNumber',
      '$residentName triggered an urgent $alertType alert.',
      const NotificationDetails(
        android: AndroidNotificationDetails(
          channelEmergencyId,
          'Emergency SOS Alerts',
          channelDescription: 'Critical life-safety alerts',
          importance: Importance.max,
          priority: Priority.max,
          playSound: true,
          enableVibration: true,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(''),
        ),
      ),
    );
  }

  /// Trigger a society notice or announcement notification
  static Future<void> showNoticeAlert({
    required String title,
    required String body,
  }) async {
    await init();
    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      '📢 $title',
      body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          channelUpdatesId,
          'Society Notices & Bills',
          channelDescription: 'Updates and broadcasts from management',
          importance: Importance.high,
          priority: Priority.high,
          playSound: true,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(''),
        ),
      ),
    );
  }

  /// Trigger a bill confirmation or due reminder notification
  static Future<void> showBillAlert({
    required String title,
    required String body,
  }) async {
    await init();
    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      '💳 $title',
      body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          channelUpdatesId,
          'Society Notices & Bills',
          channelDescription: 'Maintenance and payment receipts',
          importance: Importance.high,
          priority: Priority.high,
          playSound: true,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(''),
        ),
      ),
    );
  }
}
