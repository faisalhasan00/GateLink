class HelperLogModel {
  final String id;
  final String helperId;
  final String helperName;
  final String helperType;
  final String flatNumber;
  final String residentUid;
  final String societyId;
  final String gateName;
  final String guardName;
  final String type; // 'ENTRY' or 'EXIT'
  final String timestamp;

  const HelperLogModel({
    required this.id,
    required this.helperId,
    required this.helperName,
    required this.helperType,
    required this.flatNumber,
    required this.residentUid,
    required this.societyId,
    required this.gateName,
    required this.guardName,
    required this.type,
    required this.timestamp,
  });

  factory HelperLogModel.fromMap(Map<String, dynamic> map, {String? defaultId}) {
    return HelperLogModel(
      id: map['id'] as String? ?? defaultId ?? '',
      helperId: map['helperId'] as String? ?? '',
      helperName: map['helperName'] as String? ?? 'Domestic Staff',
      helperType: map['helperType'] as String? ?? 'Staff',
      flatNumber: map['flatNumber'] as String? ?? '',
      residentUid: map['residentUid'] as String? ?? '',
      societyId: map['societyId'] as String? ?? '',
      gateName: map['gateName'] as String? ?? 'Main Gate',
      guardName: map['guardName'] as String? ?? 'Guard',
      type: map['type'] as String? ?? 'ENTRY',
      timestamp: map['timestamp'] as String? ?? (map['createdAt'] as String? ?? ''),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'helperId': helperId,
      'helperName': helperName,
      'helperType': helperType,
      'flatNumber': flatNumber,
      'residentUid': residentUid,
      'societyId': societyId,
      'gateName': gateName,
      'guardName': guardName,
      'type': type,
      'timestamp': timestamp,
    };
  }

  String get formattedTime {
    if (timestamp.isEmpty) return '--:--';
    try {
      final dt = DateTime.parse(timestamp);
      final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
      final period = dt.hour >= 12 ? 'PM' : 'AM';
      final minute = dt.minute.toString().padLeft(2, '0');
      return '$hour:$minute $period';
    } catch (_) {
      return timestamp;
    }
  }
}
