import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Micro-service responsible solely for creating, updating, and deleting Android Notification Channels.
class NotificationChannelManager {
  NotificationChannelManager._();

  static const String channelGateId = 'gatelink_resident_doorbell_v5';
  static const String channelEmergencyId = 'gatelink_resident_emergency_v5';
  static const String channelUpdatesId = 'gatelink_resident_updates_v5';

  static const RawResourceAndroidNotificationSound residentBellSound =
      RawResourceAndroidNotificationSound('resident_bell');

  /// Configures all required Android Notification Channels with high importance and custom audio attributes.
  static Future<void> setupChannels(FlutterLocalNotificationsPlugin plugin) async {
    final androidPlugin = plugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    if (androidPlugin == null) return;

    // 1. Delete legacy channels to avoid conflicting system settings
    final legacyChannels = [
      'gate_security_channel',
      'gate_security_channel_v2',
      'gatelink_resident_doorbell_v3',
      'gatelink_resident_doorbell_v4',
    ];
    for (final legacyId in legacyChannels) {
      try {
        await androidPlugin.deleteNotificationChannel(legacyId);
      } catch (_) {}
    }

    // 2. Doorbell & Visitor Channel (Max Importance, Custom Sound, Ringtone Attributes)
    const gateChannel = AndroidNotificationChannel(
      channelGateId,
      '🚪 Gate & Visitor Doorbell',
      description: 'Immediate alerts with custom GateLink doorbell chime when visitors or deliveries arrive.',
      importance: Importance.max,
      playSound: true,
      sound: residentBellSound,
      audioAttributesUsage: AudioAttributesUsage.notificationRingtone,
      enableVibration: true,
      showBadge: true,
    );

    // 3. Emergency SOS Channel (Max Importance, Alarm Attributes)
    const emergencyChannel = AndroidNotificationChannel(
      channelEmergencyId,
      '🚨 Emergency SOS Alerts',
      description: 'High-priority emergency alerts and safety broadcasts.',
      importance: Importance.max,
      playSound: true,
      sound: residentBellSound,
      audioAttributesUsage: AudioAttributesUsage.alarm,
      enableVibration: true,
      showBadge: true,
    );

    // 4. Society Updates Channel (High Importance, Notification Attributes)
    const updatesChannel = AndroidNotificationChannel(
      channelUpdatesId,
      '📢 Society Notices & Bills',
      description: 'Announcements, maintenance invoices, and society notices.',
      importance: Importance.high,
      playSound: true,
      sound: residentBellSound,
      audioAttributesUsage: AudioAttributesUsage.notification,
      showBadge: true,
    );

    await androidPlugin.createNotificationChannel(gateChannel);
    await androidPlugin.createNotificationChannel(emergencyChannel);
    await androidPlugin.createNotificationChannel(updatesChannel);

    // Request permissions on Android 13+ (API 33+)
    if (Platform.isAndroid) {
      try {
        await androidPlugin.requestNotificationsPermission();
      } catch (e) {
        debugPrint('NotificationChannelManager: Permission request note: $e');
      }
    }

    debugPrint('NotificationChannelManager: All notification channels configured successfully.');
  }
}
