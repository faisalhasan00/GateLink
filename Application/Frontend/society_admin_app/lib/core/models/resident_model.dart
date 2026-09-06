class ResidentModel {
  final String id;
  final String name;
  final String phone;
  final String email;
  final String flatNo;
  final String wing;
  final String role;
  final String userType; // 'owner', 'tenant', 'family_member'
  final String status;   // 'approved', 'pending', 'rejected'
  final String? profilePicture;
  final DateTime? createdAt;

  ResidentModel({
    required this.id,
    required this.name,
    required this.phone,
    this.email = '',
    required this.flatNo,
    this.wing = '',
    this.role = 'resident',
    this.userType = 'owner',
    this.status = 'approved',
    this.profilePicture,
    this.createdAt,
  });

  bool get isResident {
    final r = role.toLowerCase().trim();
    if (r == 'guard' || r == 'security' || r == 'staff' || r == 'manager' || r == 'admin' || r == 'super_admin') {
      return false;
    }
    final f = flatNo.trim().toLowerCase();
    return f.isNotEmpty && f != 'n/a' && f != 'null' && f != 'none';
  }

  static DateTime? parseDate(dynamic val) {
    if (val == null) return null;
    if (val is DateTime) return val;
    if (val is String) {
      return DateTime.tryParse(val);
    }
    try {
      return (val as dynamic).toDate();
    } catch (_) {
      return null;
    }
  }

  factory ResidentModel.fromFirestore(Map<String, dynamic> data, String id) {
    final rawRole = (data['role'] ?? 'resident').toString().toLowerCase();
    final rawType = (data['userType'] ?? data['resident_type'] ?? (rawRole == 'resident' ? 'owner' : rawRole)).toString().toLowerCase();

    return ResidentModel(
      id: id,
      name: data['name'] ?? data['fullName'] ?? data['residentName'] ?? 'Resident',
      phone: data['phone'] ?? data['mobileNumber'] ?? data['phoneNumber'] ?? '',
      email: data['email'] ?? '',
      flatNo: data['flatNo'] ?? data['flat_no'] ?? data['unit'] ?? data['flatNumber'] ?? '',
      wing: data['wing'] ?? data['block'] ?? '',
      role: rawRole,
      userType: rawType,
      status: (data['status'] ?? 'approved').toString().toLowerCase(),
      profilePicture: data['profilePicture'] ?? data['photoUrl'],
      createdAt: parseDate(data['createdAt'] ?? data['created_at'] ?? data['createdDate']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'phone': phone,
      'email': email,
      'flatNo': flatNo,
      'flatNumber': flatNo,
      'wing': wing,
      'role': role,
      'userType': userType,
      'status': status,
      'profilePicture': profilePicture,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
