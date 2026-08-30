import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Production-grade Local & Heads-up Notification Engine for Security Guards.
/// Configures high-importance Android channels with custom Guard Alert radar siren sound and vibration.
class NotificationService {
  NotificationService._();
  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static const String channelGuardSecurityId = 'gatelink_guard_alarm_v3';
  static const String channelGuardEmergencyId = 'gatelink_guard_emergency_v3';

  static const RawResourceAndroidNotificationSound _guardAlertSound =
      RawResourceAndroidNotificationSound('guard_alert');

  static Future<void> init() async {
    if (_initialized) return;

    // 1. Android Notification Channels (Urgent Guard Gate Siren Tone)
    const securityChannel = AndroidNotificationChannel(
      channelGuardSecurityId,
      '🛡️ Gate Clearance & Approvals',
      description: 'Instant notification when resident approves or rejects a visitor at the gate.',
      importance: Importance.max,
      playSound: true,
      sound: _guardAlertSound,
      audioAttributesUsage: AudioAttributesUsage.notificationRingtone,
      enableVibration: true,
      showBadge: true,
    );

    const emergencyChannel = AndroidNotificationChannel(
      channelGuardEmergencyId,
      '🚨 Emergency SOS Sirens',
      description: 'High-priority emergency panic alarms from society residents.',
      importance: Importance.max,
      playSound: true,
      sound: _guardAlertSound,
      audioAttributesUsage: AudioAttributesUsage.alarm,
      enableVibration: true,
      showBadge: true,
    );

    final androidPlugin = _plugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    if (androidPlugin != null) {
      await androidPlugin.deleteNotificationChannel('visitors');
      await androidPlugin.deleteNotificationChannel('guard_security_channel_v2');

      await androidPlugin.createNotificationChannel(securityChannel);
      await androidPlugin.createNotificationChannel(emergencyChannel);

      if (Platform.isAndroid) {
        await androidPlugin.requestNotificationsPermission();
      }
    }

    const initSettings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );

    await _plugin.initialize(initSettings);
    _initialized = true;
    debugPrint('Guard NotificationService initialized with custom guard_alert sound');
  }

  /// Show arrival alert for incoming visitor
  static Future<void> showVisitorAlert({
    required String visitorName,
    required String visitorType,
    required String flatNumber,
  }) async {
    await init();
    final title = '🚪 Visitor Arrival — Flat $flatNumber';
    final body = '$visitorName ($visitorType) waiting for gate approval.';

    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelGuardSecurityId,
          '🛡️ Gate Clearance & Approvals',
          channelDescription: 'Incoming visitor arrival alert',
          importance: Importance.max,
          priority: Priority.max,
          playSound: true,
          sound: _guardAlertSound,
          audioAttributesUsage: AudioAttributesUsage.notificationRingtone,
          enableVibration: true,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(
            body,
            contentTitle: title,
            summaryText: 'Gate Alert',
          ),
        ),
      ),
    );
  }

  /// Trigger resident approval/rejection gate clearance notification
  static Future<void> showVisitorDecisionAlert({
    required String visitorName,
    required String decision, // 'approved' | 'rejected'
    required String flatNumber,
    String? visitorType,
  }) async {
    await init();
    final isApproved = decision.toLowerCase() == 'approved';
    final title = isApproved
        ? '✅ ENTRY APPROVED — Flat $flatNumber'
        : '❌ ENTRY REJECTED — Flat $flatNumber';
    final body = isApproved
        ? 'Resident approved entry for $visitorName (${visitorType ?? 'Visitor'}). Allow passage.'
        : 'Resident denied entry for $visitorName. Do not allow inside.';

    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelGuardSecurityId,
          '🛡️ Gate Clearance & Approvals',
          channelDescription: 'Notifications when a resident decides on visitor entry',
          importance: Importance.max,
          priority: Priority.max,
          playSound: true,
          sound: _guardAlertSound,
          audioAttributesUsage: AudioAttributesUsage.notificationRingtone,
          enableVibration: true,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(
            body,
            contentTitle: title,
            summaryText: 'Gate Status Update',
          ),
        ),
      ),
    );
  }

  /// Trigger Panic SOS Siren Alert on Guard Terminal
  static Future<void> showSosAlert({
    required String residentName,
    required String flatNumber,
    required String alertType,
  }) async {
    await init();
    final title = '🚨 PANIC SOS: Flat $flatNumber';
    final body = 'URGENT: $residentName triggered $alertType panic alarm! Dispatch security immediately.';

    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelGuardEmergencyId,
          '🚨 Emergency SOS Sirens',
          channelDescription: 'Critical life-safety alerts from residents',
          importance: Importance.max,
          priority: Priority.max,
          playSound: true,
          sound: _guardAlertSound,
          audioAttributesUsage: AudioAttributesUsage.alarm,
          enableVibration: true,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(
            body,
            contentTitle: title,
            summaryText: 'EMERGENCY DISPATCH',
          ),
        ),
      ),
    );
  }

  /// General Guard Alert fallback
  static Future<void> showGeneralAlert({
    required String title,
    required String body,
  }) async {
    await init();
    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelGuardSecurityId,
          '🛡️ Gate Clearance & Approvals',
          channelDescription: 'Gate notifications',
          importance: Importance.high,
          priority: Priority.high,
          playSound: true,
          sound: _guardAlertSound,
          audioAttributesUsage: AudioAttributesUsage.notificationRingtone,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(body),
        ),
      ),
    );
  }
}
