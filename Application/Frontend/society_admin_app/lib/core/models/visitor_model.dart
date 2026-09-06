class VisitorModel {
  final String id;
  final String name;
  final String phone;
  final String purpose;
  final String flatNo;
  final String wing;
  final String status; // 'inside', 'checked_out', 'approved', 'rejected', 'pending'
  final String? visitorType; // 'guest', 'cab', 'delivery', 'service'
  final String? vehicleNumber;
  final String? photoUrl;
  final DateTime? inTime;
  final DateTime? outTime;

  VisitorModel({
    required this.id,
    required this.name,
    required this.phone,
    this.purpose = 'Visit',
    required this.flatNo,
    this.wing = '',
    this.status = 'inside',
    this.visitorType = 'guest',
    this.vehicleNumber,
    this.photoUrl,
    this.inTime,
    this.outTime,
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

  factory VisitorModel.fromFirestore(Map<String, dynamic> data, String id) {
    return VisitorModel(
      id: id,
      name: data['name'] ?? data['visitor_name'] ?? 'Visitor',
      phone: data['phone'] ?? data['visitor_phone'] ?? '',
      purpose: data['purpose'] ?? 'Visit',
      flatNo: data['flatNo'] ?? data['flat_no'] ?? '',
      wing: data['wing'] ?? data['block'] ?? '',
      status: data['status'] ?? 'inside',
      visitorType: data['visitorType'] ?? data['type'] ?? 'guest',
      vehicleNumber: data['vehicleNumber'] ?? data['vehicle_no'],
      photoUrl: data['photoUrl'] ?? data['photo_url'],
      inTime: parseDate(data['inTime'] ?? data['checkInTime'] ?? data['created_at'] ?? data['createdAt']),
      outTime: parseDate(data['outTime'] ?? data['checkOutTime']),
    );
  }
}
