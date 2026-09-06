import '../../../../core/utils/timestamp_utils.dart';

class NotificationModel {
  final String id;
  final String title;
  final String body;
  final String type;
  final bool read;
  final String createdAt;
  final String societyId;

  const NotificationModel({
    required this.id,
    required this.title,
    required this.body,
    this.type = 'info',
    this.read = false,
    required this.createdAt,
    this.societyId = 'SOC-001',
  });

  factory NotificationModel.fromMap(
      Map<String, dynamic> map, String documentId) {
    return NotificationModel(
      id: documentId,
      title: map['title']?.toString() ?? 'Notification',
      body: map['body']?.toString() ?? '',
      type: map['type']?.toString() ?? 'info',
      read: map['read'] == true,
      createdAt: TimestampUtils.parseToString(map['createdAt']),
      societyId: map['societyId']?.toString() ?? 'SOC-001',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'body': body,
      'type': type,
      'read': read,
      'createdAt': createdAt,
      'societyId': societyId,
    };
  }

  NotificationModel copyWith({
    String? id,
    String? title,
    String? body,
    String? type,
    bool? read,
    String? createdAt,
    String? societyId,
  }) {
    return NotificationModel(
      id: id ?? this.id,
      title: title ?? this.title,
      body: body ?? this.body,
      type: type ?? this.type,
      read: read ?? this.read,
      createdAt: createdAt ?? this.createdAt,
      societyId: societyId ?? this.societyId,
    );
  }
}
