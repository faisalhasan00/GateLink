class NoticeModel {
  final String id;
  final String title;
  final String content;
  final String category; // 'general', 'emergency', 'maintenance', 'event', 'meeting'
  final bool isUrgent;
  final String createdBy;
  final DateTime? createdAt;
  final DateTime? expiresAt;

  NoticeModel({
    required this.id,
    required this.title,
    required this.content,
    this.category = 'general',
    this.isUrgent = false,
    this.createdBy = 'Society Office',
    this.createdAt,
    this.expiresAt,
  });

  static DateTime? parseDate(dynamic val) {
    if (val == null) return null;
    if (val is DateTime) return val;
    if (val is String) return DateTime.tryParse(val);
    try {
      return (val as dynamic).toDate();
    } catch (_) {
      return null;
    }
  }

  factory NoticeModel.fromFirestore(Map<String, dynamic> data, String id) {
    return NoticeModel(
      id: id,
      title: data['title'] ?? data['heading'] ?? 'Notice #$id',
      content: data['body'] ?? data['content'] ?? data['description'] ?? '',
      category: (data['category'] ?? 'General').toString(),
      isUrgent: data['urgent'] == true || data['isUrgent'] == true || (data['category']?.toString().toLowerCase() == 'emergency'),
      createdBy: data['author'] ?? data['createdBy'] ?? 'Society Office',
      createdAt: parseDate(data['createdAt'] ?? data['created_at'] ?? data['createdDate']),
      expiresAt: parseDate(data['expiresAt'] ?? data['expires_at']),
    );
  }

  Map<String, dynamic> toMap() {
    final nowIso = DateTime.now().toIso8601String();
    return {
      'title': title,
      'body': content,
      'content': content,
      'description': content,
      'category': category,
      'urgent': isUrgent,
      'isUrgent': isUrgent,
      'author': createdBy,
      'createdBy': createdBy,
      'createdAt': nowIso,
      'createdDate': nowIso,
      'expiresAt': expiresAt?.toIso8601String(),
    };
  }
}
