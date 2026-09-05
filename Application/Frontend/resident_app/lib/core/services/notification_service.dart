import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'notifications/doorbell_sound_service.dart';
import 'notifications/notification_action_handler.dart';
import 'notifications/notification_channel_manager.dart';
import 'notifications/local_notification_engine.dart';

// Re-export micro-services so callers can import cleanly
export 'notifications/doorbell_sound_service.dart';
export 'notifications/notification_action_handler.dart';
export 'notifications/notification_channel_manager.dart';
export 'notifications/local_notification_engine.dart';

/// Facade coordinating Android Channels, Sound Engine, and Notification Dispatch.
class NotificationService {
  NotificationService._();
  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  // Action Key Shortcuts
  static const String actionAllow = NotificationActionKeys.allow;
  static const String actionLeaveAtGate = NotificationActionKeys.leaveAtGate;
  static const String actionDeny = NotificationActionKeys.deny;
  static const String actionApprove = NotificationActionKeys.allow;
  static const String actionReject = NotificationActionKeys.deny;

  /// Initializes the local notification plugin and configures all Android channels.
  static Future<void> init() async {
    if (_initialized) return;

    // 1. Configure Android Channels via ChannelManager
    await NotificationChannelManager.setupChannels(_plugin);

    // 2. Configure Plugin Initialization Settings
    const initSettings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) async {
        debugPrint('NotificationService foreground response: ${response.actionId}');
        if (response.actionId != null && response.actionId!.isNotEmpty) {
          await notificationBackgroundActionHandler(response);
        }
      },
      onDidReceiveBackgroundNotificationResponse: notificationBackgroundActionHandler,
    );

    _initialized = true;
    debugPrint('NotificationService initialized successfully with micro-service architecture.');
  }

  /// Plays custom GateLink doorbell chime.
  static Future<void> playDoorbellChime({bool loop = false}) async {
    await DoorbellSoundService.instance.playDoorbellChime(loop: loop);
  }

  /// Stops audio chime playback.
  static Future<void> stopAudio() async {
    await DoorbellSoundService.instance.stop();
  }

  /// Trigger interactive Doorbell & Delivery Action Card.
  static Future<void> showVisitorAlert({
    required String visitorName,
    required String visitorType,
    required String flatNumber,
    String? visitorId,
    String? societyId,
    String? company,
    String? vehicleNumber,
    String? gateName,
    String? photoUrl,
  }) async {
    await init();
    await LocalNotificationEngine.showVisitorAlert(
      _plugin,
      visitorName: visitorName,
      visitorType: visitorType,
      flatNumber: flatNumber,
      visitorId: visitorId,
      societyId: societyId,
      company: company,
      vehicleNumber: vehicleNumber,
      gateName: gateName,
      photoUrl: photoUrl,
    );
  }

  /// Trigger an Emergency SOS broadcast alert.
  static Future<void> showSosAlert({
    required String residentName,
    required String flatNumber,
    required String alertType,
  }) async {
    await init();
    await LocalNotificationEngine.showSosAlert(
      _plugin,
      residentName: residentName,
      flatNumber: flatNumber,
      alertType: alertType,
    );
  }

  /// Trigger a standard society notice / bill alert.
  static Future<void> showNoticeAlert({
    required String title,
    required String body,
    String? payload,
  }) async {
    await init();
    await LocalNotificationEngine.showNoticeAlert(
      _plugin,
      title: title,
      body: body,
      payload: payload,
    );
  }
}
