class SosAlertModel {
  final String id;
  final String flatNo;
  final String residentName;
  final String emergencyType; // 'medical', 'fire', 'security', 'lift_entrapment'
  final String status;        // 'active', 'resolved', 'acknowledged'
  final DateTime? triggeredAt;
  final DateTime? resolvedAt;
  final String? resolvedBy;

  SosAlertModel({
    required this.id,
    required this.flatNo,
    required this.residentName,
    required this.emergencyType,
    this.status = 'active',
    this.triggeredAt,
    this.resolvedAt,
    this.resolvedBy,
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

  factory SosAlertModel.fromFirestore(Map<String, dynamic> data, String id) {
    return SosAlertModel(
      id: id,
      flatNo: data['flatNo'] ?? data['unit'] ?? data['flat_no'] ?? '',
      residentName: data['residentName'] ?? data['userName'] ?? data['name'] ?? 'Resident',
      emergencyType: (data['emergencyType'] ?? data['type'] ?? 'security').toString(),
      status: (data['status'] ?? 'active').toString().toLowerCase(),
      triggeredAt: parseDate(data['triggeredAt'] ?? data['timestamp'] ?? data['createdAt'] ?? data['created_at']),
      resolvedAt: parseDate(data['resolvedAt']),
      resolvedBy: data['resolvedBy'],
    );
  }
}
