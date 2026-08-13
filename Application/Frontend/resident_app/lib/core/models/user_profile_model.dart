class UserProfileModel {
  final String uid;
  final String name;
  final String displayName;
  final String email;
  final String phone;
  final String gender;
  final String dob;
  final String societyId;
  final String societyName;
  final String tower;
  final String flatNumber;
  final String gateName;
  final String role;
  final String status;
  final Map<String, bool> notificationPreferences;

  const UserProfileModel({
    required this.uid,
    required this.name,
    required this.displayName,
    required this.email,
    this.phone = '',
    this.gender = 'Male',
    this.dob = '',
    required this.societyId,
    required this.societyName,
    required this.tower,
    required this.flatNumber,
    required this.gateName,
    required this.role,
    required this.status,
    this.notificationPreferences = const {},
  });

  factory UserProfileModel.fromMap(Map<String, dynamic> map, {String? defaultUid}) {
    final uid = map['uid'] as String? ?? defaultUid ?? '';
    final name = map['name'] as String? ?? map['displayName'] as String? ?? 'Resident';
    final displayName = map['displayName'] as String? ?? name;
    final email = map['email'] as String? ?? '';
    final phone = map['phone'] as String? ?? map['phoneNumber'] as String? ?? '';
    final gender = map['gender'] as String? ?? 'Male';
    final dob = map['dob'] as String? ?? '12 Oct 1992';
    final societyId = map['societyId'] as String? ?? 'SOC-001';
    final societyName = map['societyName'] as String? ?? 'SocietySphere Residency';
    final tower = map['tower'] as String? ?? 'Tower A';
    final flatNumber = map['flatNumber'] as String? ?? map['flat'] as String? ?? 'Unknown';
    final gateName = map['gateName'] as String? ?? 'Gate 1 — Main Entry';
    final role = map['role'] as String? ?? 'resident';
    final status = map['status'] as String? ?? 'active';

    final rawNotif = map['notificationPreferences'];
    final notifPrefs = <String, bool>{};
    if (rawNotif is Map) {
      rawNotif.forEach((key, val) {
        if (val is bool) notifPrefs[key.toString()] = val;
      });
    }

    return UserProfileModel(
      uid: uid,
      name: name,
      displayName: displayName,
      email: email,
      phone: phone,
      gender: gender,
      dob: dob,
      societyId: societyId,
      societyName: societyName,
      tower: tower,
      flatNumber: flatNumber,
      gateName: gateName,
      role: role,
      status: status,
      notificationPreferences: notifPrefs,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'name': name,
      'displayName': displayName,
      'email': email,
      'phone': phone,
      'gender': gender,
      'dob': dob,
      'societyId': societyId,
      'societyName': societyName,
      'tower': tower,
      'flatNumber': flatNumber,
      'gateName': gateName,
      'role': role,
      'status': status,
      'notificationPreferences': notificationPreferences,
    };
  }

  UserProfileModel copyWith({
    String? uid,
    String? name,
    String? displayName,
    String? email,
    String? phone,
    String? gender,
    String? dob,
    String? societyId,
    String? societyName,
    String? tower,
    String? flatNumber,
    String? gateName,
    String? role,
    String? status,
    Map<String, bool>? notificationPreferences,
  }) {
    return UserProfileModel(
      uid: uid ?? this.uid,
      name: name ?? this.name,
      displayName: displayName ?? this.displayName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      gender: gender ?? this.gender,
      dob: dob ?? this.dob,
      societyId: societyId ?? this.societyId,
      societyName: societyName ?? this.societyName,
      tower: tower ?? this.tower,
      flatNumber: flatNumber ?? this.flatNumber,
      gateName: gateName ?? this.gateName,
      role: role ?? this.role,
      status: status ?? this.status,
      notificationPreferences:
          notificationPreferences ?? this.notificationPreferences,
    );
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
      case 'phone':
        return phone;
      case 'gender':
        return gender;
      case 'dob':
        return dob;
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
      case 'notificationPreferences':
        return notificationPreferences;
      default:
        return null;
    }
  }
}
