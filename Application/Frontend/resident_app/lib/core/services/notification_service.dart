import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Simple wrapper around flutter_local_notifications.
/// Call [NotificationService.init] once at app startup,
/// then [NotificationService.showVisitorAlert] anywhere you need.
class NotificationService {
  NotificationService._();
  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static Future<void> init() async {
    if (_initialized) return;

    const androidChannel = AndroidNotificationChannel(
      'visitors',
      'Visitor Alerts',
      description: 'Notifications when a visitor arrives at the gate',
      importance: Importance.max,
    );

    await _plugin
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(androidChannel);

    const initSettings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );
    await _plugin.initialize(initSettings);
    _initialized = true;
    debugPrint('NotificationService initialized');
  }

  static Future<void> showVisitorAlert({
    required String visitorName,
    required String visitorType,
    required String flatNumber,
  }) async {
    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      '🔔 Visitor at Gate — Flat $flatNumber',
      '$visitorName ($visitorType) is waiting for your approval',
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'visitors',
          'Visitor Alerts',
          channelDescription:
              'Notifications when a visitor arrives at the gate',
          importance: Importance.max,
          priority: Priority.high,
          playSound: true,
          icon: '@mipmap/ic_launcher',
        ),
      ),
    );
  }
}
