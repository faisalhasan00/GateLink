class ComplaintModel {
  final String id;
  final String title;
  final String description;
  final String category; // 'plumbing', 'electrical', 'security', 'cleanliness', 'general'
  final String status;   // 'open', 'in_progress', 'resolved', 'closed'
  final String priority; // 'low', 'medium', 'high', 'urgent'
  final String residentName;
  final String flatNo;
  final String? assignedStaffId;
  final String? assignedStaffName;
  final DateTime? createdAt;
  final DateTime? resolvedAt;

  ComplaintModel({
    required this.id,
    required this.title,
    required this.description,
    this.category = 'general',
    this.status = 'open',
    this.priority = 'medium',
    required this.residentName,
    required this.flatNo,
    this.assignedStaffId,
    this.assignedStaffName,
    this.createdAt,
    this.resolvedAt,
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

  factory ComplaintModel.fromFirestore(Map<String, dynamic> data, String id) {
    return ComplaintModel(
      id: id,
      title: data['title'] ?? data['subject'] ?? 'Complaint #$id',
      description: data['description'] ?? '',
      category: (data['category'] ?? 'general').toString().toLowerCase(),
      status: (data['status'] ?? 'open').toString().toLowerCase(),
      priority: (data['priority'] ?? 'medium').toString().toLowerCase(),
      residentName: data['residentName'] ?? data['userName'] ?? data['name'] ?? 'Resident',
      flatNo: data['flatNo'] ?? data['flat_no'] ?? data['unit'] ?? '',
      assignedStaffId: data['assignedStaffId'] ?? data['assigned_to'] ?? data['assignedTo'],
      assignedStaffName: data['assignedStaffName'] ?? data['assigned_staff'] ?? data['assignedStaff'],
      createdAt: parseDate(data['createdAt'] ?? data['created_at'] ?? data['createdDate']),
      resolvedAt: parseDate(data['resolvedAt'] ?? data['resolved_at']),
    );
  }
}
