import 'package:flutter/foundation.dart';

@immutable
class GuardSessionModel {
  final String id;
  final String deviceName;
  final String ipAddress;
  final String platform;
  final DateTime lastActive;
  final bool isCurrent;

  const GuardSessionModel({
    required this.id,
    required this.deviceName,
    required this.ipAddress,
    required this.platform,
    required this.lastActive,
    required this.isCurrent,
  });

  factory GuardSessionModel.fromMap(Map<String, dynamic> map, String id) {
    DateTime parseDate(dynamic val) {
      if (val is String && val.isNotEmpty) {
        return DateTime.tryParse(val) ?? DateTime.now();
      }
      return DateTime.now();
    }

    return GuardSessionModel(
      id: id,
      deviceName: map['deviceName'] as String? ?? 'Mobile Device',
      ipAddress: map['ipAddress'] as String? ?? '127.0.0.1',
      platform: map['platform'] as String? ?? 'Android',
      lastActive: parseDate(map['lastActive'] ?? map['createdAt']),
      isCurrent: map['isCurrent'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'deviceName': deviceName,
      'ipAddress': ipAddress,
      'platform': platform,
      'lastActive': lastActive.toIso8601String(),
      'isCurrent': isCurrent,
    };
  }
}
