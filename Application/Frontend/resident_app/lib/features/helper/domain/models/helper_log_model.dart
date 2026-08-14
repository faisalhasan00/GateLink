class HelperLogModel {
  final String id;
  final String helperId;
  final String name;
  final String action; // 'ENTRY' or 'EXIT'
  final String gateName;
  final String timestamp;
  final String flatNumber;

  const HelperLogModel({
    required this.id,
    required this.helperId,
    required this.name,
    required this.action,
    required this.gateName,
    required this.timestamp,
    required this.flatNumber,
  });

  factory HelperLogModel.fromMap(Map<String, dynamic> map,
      {String? defaultId}) {
    return HelperLogModel(
      id: map['id'] as String? ?? defaultId ?? '',
      helperId: map['helperId'] as String? ?? '',
      name: map['name'] as String? ?? 'Entry',
      action: map['action'] as String? ?? 'ENTRY',
      gateName: map['gateName'] as String? ?? 'Gate 1',
      timestamp: map['timestamp'] as String? ?? '',
      flatNumber: map['flatNumber'] as String? ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'helperId': helperId,
      'name': name,
      'action': action,
      'gateName': gateName,
      'timestamp': timestamp,
      'flatNumber': flatNumber,
    };
  }

  bool get isEntry => action.toUpperCase() == 'ENTRY';

  String get formattedTime {
    if (timestamp.isEmpty) return 'Now';
    try {
      final dt = DateTime.parse(timestamp).toLocal();
      final hour = dt.hour.toString().padLeft(2, '0');
      final minute = dt.minute.toString().padLeft(2, '0');
      return '$hour:$minute';
    } catch (_) {
      return 'Now';
    }
  }
}
