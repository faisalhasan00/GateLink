class UserProfileModel {
  final String uid;
  final String name;
  final String displayName;
  final String email;
  final String societyId;
  final String societyName;
  final String tower;
  final String flatNumber;
  final String gateName;
  final String role;
  final String status;

  const UserProfileModel({
    required this.uid,
    required this.name,
    required this.displayName,
    required this.email,
    required this.societyId,
    required this.societyName,
    required this.tower,
    required this.flatNumber,
    required this.gateName,
    required this.role,
    required this.status,
  });

  factory UserProfileModel.fromMap(Map<String, dynamic> map, {String? defaultUid}) {
    final uid = map['uid'] as String? ?? defaultUid ?? '';
    final name = map['name'] as String? ?? map['displayName'] as String? ?? 'Resident';
    final displayName = map['displayName'] as String? ?? name;
    final email = map['email'] as String? ?? '';
    final societyId = map['societyId'] as String? ?? 'SOC-001';
    final societyName = map['societyName'] as String? ?? 'SocietySphere Residency';
    final tower = map['tower'] as String? ?? 'Tower A';
    final flatNumber = map['flatNumber'] as String? ?? map['flat'] as String? ?? 'Unknown';
    final gateName = map['gateName'] as String? ?? 'Gate 1 — Main Entry';
    final role = map['role'] as String? ?? 'resident';
    final status = map['status'] as String? ?? 'active';

    return UserProfileModel(
      uid: uid,
      name: name,
      displayName: displayName,
      email: email,
      societyId: societyId,
      societyName: societyName,
      tower: tower,
      flatNumber: flatNumber,
      gateName: gateName,
      role: role,
      status: status,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'name': name,
      'displayName': displayName,
      'email': email,
      'societyId': societyId,
      'societyName': societyName,
      'tower': tower,
      'flatNumber': flatNumber,
      'gateName': gateName,
      'role': role,
      'status': status,
    };
  }

  dynamic operator [](String key) {
    switch (key) {
      case 'uid':
        return uid;
      case 'name':
        return name;
      case 'displayName':
        return displayName;
      case 'email':
        return email;
      case 'societyId':
        return societyId;
      case 'societyName':
        return societyName;
      case 'tower':
        return tower;
      case 'flatNumber':
        return flatNumber;
      case 'gateName':
        return gateName;
      case 'role':
        return role;
      case 'status':
        return status;
      default:
        return null;
    }
  }
}
