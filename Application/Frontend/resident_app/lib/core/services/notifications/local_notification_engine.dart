import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'notification_action_handler.dart';
import 'notification_channel_manager.dart';

/// Micro-service responsible for assembling and dispatching local / heads-up notification cards.
class LocalNotificationEngine {
  LocalNotificationEngine._();

  /// Posts a rich interactive Visitor & Delivery Doorbell Action Card to the system.
  static Future<void> showVisitorAlert(
    FlutterLocalNotificationsPlugin plugin, {
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
    final payloadData = jsonEncode({
      'visitorId': visitorId ?? '',
      'societyId': societyId ?? '',
      'visitorName': visitorName,
      'visitorType': visitorType,
      'flatNumber': flatNumber,
      'company': company ?? '',
      'vehicleNumber': vehicleNumber ?? '',
      'gateName': gateName ?? '',
      'photoUrl': photoUrl ?? '',
    });

    final notifId = visitorId != null && visitorId.isNotEmpty
        ? visitorId.hashCode.remainder(100000)
        : DateTime.now().millisecondsSinceEpoch.remainder(100000);

    final partnerBadge = (company != null && company.trim().isNotEmpty)
        ? company.trim()
        : visitorType;
    final plateInfo = (vehicleNumber != null && vehicleNumber.trim().isNotEmpty)
        ? ' • Plate: ${vehicleNumber.trim()}'
        : '';
    final gateLoc = (gateName != null && gateName.trim().isNotEmpty)
        ? gateName.trim()
        : 'Main Gate';

    await plugin.show(
      notifId,
      '🚨 Live at $gateLoc — Flat $flatNumber',
      '🛵 $partnerBadge ($visitorName)$plateInfo is waiting for your entry approval.',
      NotificationDetails(
        android: AndroidNotificationDetails(
          NotificationChannelManager.channelGateId,
          '🚪 Gate & Visitor Doorbell',
          channelDescription: 'Visitor arrival alerts with custom doorbell chime and quick action buttons',
          importance: Importance.max,
          priority: Priority.max,
          playSound: true,
          sound: NotificationChannelManager.residentBellSound,
          audioAttributesUsage: AudioAttributesUsage.notificationRingtone,
          enableVibration: true,
          fullScreenIntent: true,
          category: AndroidNotificationCategory.event,
          visibility: NotificationVisibility.public,
          icon: '@mipmap/ic_launcher',
          color: const Color(0xFF1E3A8A),
          styleInformation: BigTextStyleInformation(
            '👤 $visitorName ($partnerBadge)$plateInfo\n📍 $gateLoc\n\nTap below to Allow, Leave at Gate, or Deny with 1 tap.',
            contentTitle: '🚨 Live at $gateLoc — Flat $flatNumber',
            summaryText: '$partnerBadge Request',
          ),
          actions: const <AndroidNotificationAction>[
            AndroidNotificationAction(
              NotificationActionKeys.allow,
              'Allow Entry',
              showsUserInterface: false,
              cancelNotification: true,
            ),
            AndroidNotificationAction(
              NotificationActionKeys.leaveAtGate,
              'Leave at Gate',
              showsUserInterface: false,
              cancelNotification: true,
            ),
            AndroidNotificationAction(
              NotificationActionKeys.deny,
              'Deny',
              showsUserInterface: false,
              cancelNotification: true,
            ),
          ],
        ),
      ),
      payload: payloadData,
    );
  }

  /// Posts an Emergency SOS Broadcast alert to the system.
  static Future<void> showSosAlert(
    FlutterLocalNotificationsPlugin plugin, {
    required String residentName,
    required String flatNumber,
    required String alertType,
  }) async {
    final notifId = DateTime.now().millisecondsSinceEpoch.remainder(100000);

    await plugin.show(
      notifId,
      '🚨 EMERGENCY SOS ALERT — Flat $flatNumber',
      '⚠️ Resident $residentName triggered an SOS: $alertType. Immediate security action required.',
      NotificationDetails(
        android: AndroidNotificationDetails(
          NotificationChannelManager.channelEmergencyId,
          '🚨 Emergency SOS Alerts',
          channelDescription: 'High-priority emergency alerts and safety broadcasts',
          importance: Importance.max,
          priority: Priority.max,
          playSound: true,
          sound: NotificationChannelManager.residentBellSound,
          audioAttributesUsage: AudioAttributesUsage.alarm,
          enableVibration: true,
          fullScreenIntent: true,
          category: AndroidNotificationCategory.alarm,
          visibility: NotificationVisibility.public,
          icon: '@mipmap/ic_launcher',
          color: const Color(0xFFEF4444),
          styleInformation: BigTextStyleInformation(
            '⚠️ $residentName (Flat $flatNumber) needs immediate emergency assistance!\nAlert type: $alertType',
            contentTitle: '🚨 EMERGENCY SOS ALERT — Flat $flatNumber',
            summaryText: 'Emergency Broadcast',
          ),
        ),
      ),
    );
  }

  /// Posts a general Society Notice or Bill Alert to the system.
  static Future<void> showNoticeAlert(
    FlutterLocalNotificationsPlugin plugin, {
    required String title,
    required String body,
    String? payload,
  }) async {
    final notifId = DateTime.now().millisecondsSinceEpoch.remainder(100000);

    await plugin.show(
      notifId,
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          NotificationChannelManager.channelUpdatesId,
          '📢 Society Notices & Bills',
          channelDescription: 'Announcements, maintenance invoices, and society notices',
          importance: Importance.high,
          priority: Priority.high,
          playSound: true,
          sound: NotificationChannelManager.residentBellSound,
          audioAttributesUsage: AudioAttributesUsage.notification,
          icon: '@mipmap/ic_launcher',
          color: const Color(0xFF0EA5E9),
          styleInformation: BigTextStyleInformation(
            body,
            contentTitle: title,
          ),
        ),
      ),
      payload: payload,
    );
  }
}
