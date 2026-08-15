import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Production-grade Local & Heads-up Notification Engine.
/// Configures high-importance Android channels with sound and vibration
/// for instant delivery when app is in foreground, background, or closed.
class NotificationService {
  NotificationService._();
  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static const String channelGateId = 'gate_security_channel';
  static const String channelEmergencyId = 'emergency_alerts_channel';
  static const String channelUpdatesId = 'society_updates_channel';

  static Future<void> init() async {
    if (_initialized) return;

    // 1. Android Notification Channels (High Priority & Heads-up Banner)
    const gateChannel = AndroidNotificationChannel(
      channelGateId,
      'Gate & Visitor Alerts',
      description: 'Immediate alerts when visitors, delivery, or cabs arrive at the gate.',
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
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        debugPrint('Notification clicked with payload: ${response.payload}');
      },
    );

    _initialized = true;
    debugPrint('NotificationService initialized successfully with high-priority channels');
  }

  /// Trigger a heads-up gate arrival notification (e.g. Zomato / Delivery / Guest waiting)
  static Future<void> showVisitorAlert({
    required String visitorName,
    required String visitorType,
    required String flatNumber,
  }) async {
    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      '🚪 Visitor at Main Gate — Flat $flatNumber',
      '$visitorName ($visitorType) is waiting for your entry approval.',
      const NotificationDetails(
        android: AndroidNotificationDetails(
          channelGateId,
          'Gate & Visitor Alerts',
          channelDescription: 'Visitor arrival alerts with action triggers',
          importance: Importance.max,
          priority: Priority.high,
          playSound: true,
          enableVibration: true,
          icon: '@mipmap/ic_launcher',
          styleInformation: BigTextStyleInformation(''),
        ),
      ),
    );
  }

  /// Trigger an Emergency SOS broadcast notification
  static Future<void> showSosAlert({
    required String residentName,
    required String flatNumber,
    required String alertType,
  }) async {
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
