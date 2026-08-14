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
      title: map['title'] as String? ?? 'Notification',
      body: map['body'] as String? ?? '',
      type: map['type'] as String? ?? 'info',
      read: map['read'] as bool? ?? false,
      createdAt: map['createdAt'] as String? ?? '',
      societyId: map['societyId'] as String? ?? 'SOC-001',
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
