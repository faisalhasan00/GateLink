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
  final String societyCode;
  final String country;
  final String city;
  final String tower;
  final String flatNumber;
  final String unitNumber;
  final String gateName;
  final String role;
  final String residentRoleType;
  final String ownershipType;
  final String occupancyStatus;
  final String status;
  final String createdAt;
  final String? photoUrl;
  final Map<String, bool> notificationPreferences;

  const UserProfileModel({
    required this.uid,
    required this.name,
    required this.displayName,
    required this.email,
    this.phone = '',
    this.gender = '',
    this.dob = '',
    required this.societyId,
    required this.societyName,
    this.societyCode = '',
    this.country = '',
    this.city = '',
    required this.tower,
    required this.flatNumber,
    this.unitNumber = '',
    this.gateName = '',
    required this.role,
    this.residentRoleType = '',
    this.ownershipType = '',
    this.occupancyStatus = '',
    required this.status,
    this.createdAt = '',
    this.photoUrl,
    this.notificationPreferences = const {},
  });

  factory UserProfileModel.fromMap(Map<String, dynamic> map,
      {String? defaultUid}) {
    final uid = map['uid'] as String? ?? defaultUid ?? '';
    final name =
        map['name'] as String? ?? map['displayName'] as String? ?? 'Resident';
    final displayName = map['displayName'] as String? ?? name;
    final email = map['email'] as String? ?? '';
    final phone =
        map['phone'] as String? ?? map['phoneNumber'] as String? ?? '';
    final gender = map['gender'] as String? ?? '';
    final dob = map['dob'] as String? ?? '';
    final societyId = map['societyId'] as String? ?? '';
    final societyName =
        map['societyName'] as String? ?? map['society'] as String? ?? '';
    final societyCode = map['societyCode'] as String? ?? map['code'] as String? ?? '';
    final country = map['country'] as String? ?? '';
    final city = map['city'] as String? ?? '';
    final tower = map['tower'] as String? ??
        map['buildingBlock'] as String? ??
        map['block'] as String? ??
        '';
    final flatNumber = map['flatNumber'] as String? ??
        map['flat'] as String? ??
        map['unitNumber'] as String? ??
        '';
    final unitNumber = map['unitNumber'] as String? ?? '';
    final gateName = map['gateName'] as String? ?? '';
    final role = map['role'] as String? ?? 'resident';
    final residentRoleType = map['residentRoleType'] as String? ?? '';
    final ownershipType = map['ownershipType'] as String? ??
        (residentRoleType.contains('Owner') ? 'Owner' : (residentRoleType.isNotEmpty ? 'Tenant' : ''));
    final occupancyStatus = map['occupancyStatus'] as String? ?? '';
    final status = map['status'] as String? ?? 'active';
    final createdAt = map['createdAt'] as String? ?? '';
    final photoUrl = map['photoUrl'] as String? ?? map['avatarUrl'] as String?;

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
      societyCode: societyCode,
      country: country,
      city: city,
      tower: tower,
      flatNumber: flatNumber,
      unitNumber: unitNumber,
      gateName: gateName,
      role: role,
      residentRoleType: residentRoleType,
      ownershipType: ownershipType,
      occupancyStatus: occupancyStatus,
      status: status,
      createdAt: createdAt,
      photoUrl: photoUrl,
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
      'societyCode': societyCode,
      'country': country,
      'city': city,
      'tower': tower,
      'flatNumber': flatNumber,
      'unitNumber': unitNumber,
      'gateName': gateName,
      'role': role,
      'residentRoleType': residentRoleType,
      'ownershipType': ownershipType,
      'occupancyStatus': occupancyStatus,
      'status': status,
      'createdAt': createdAt,
      if (photoUrl != null) 'photoUrl': photoUrl,
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
    String? societyCode,
    String? country,
    String? city,
    String? tower,
    String? flatNumber,
    String? unitNumber,
    String? gateName,
    String? role,
    String? residentRoleType,
    String? ownershipType,
    String? occupancyStatus,
    String? status,
    String? createdAt,
    String? photoUrl,
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
      societyCode: societyCode ?? this.societyCode,
      country: country ?? this.country,
      city: city ?? this.city,
      tower: tower ?? this.tower,
      flatNumber: flatNumber ?? this.flatNumber,
      unitNumber: unitNumber ?? this.unitNumber,
      gateName: gateName ?? this.gateName,
      role: role ?? this.role,
      residentRoleType: residentRoleType ?? this.residentRoleType,
      ownershipType: ownershipType ?? this.ownershipType,
      occupancyStatus: occupancyStatus ?? this.occupancyStatus,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      photoUrl: photoUrl ?? this.photoUrl,
      notificationPreferences:
          notificationPreferences ?? this.notificationPreferences,
    );
  }

  /// Helper: user initials (e.g. "FH" for Faisal Hasan)
  String get initials {
    final effective = name.isNotEmpty ? name : displayName;
    if (effective.isEmpty) return 'R';
    final parts = effective.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  /// Helper: clean display society name
  String get displaySocietyName {
    if (societyName.isNotEmpty) return societyName;
    if (societyCode.isNotEmpty) return 'Society $societyCode';
    if (societyId.isNotEmpty) return 'Society $societyId';
    return 'Housing Society';
  }

  /// Helper: clean display flat identifier
  String get displayFlatNumber {
    if (flatNumber.isNotEmpty) return flatNumber;
    if (tower.isNotEmpty && unitNumber.isNotEmpty) return '$tower-$unitNumber';
    if (unitNumber.isNotEmpty) return unitNumber;
    return 'Not Assigned';
  }

  /// Helper: formatted role title
  String get displayRoleTitle {
    if (residentRoleType.isNotEmpty) return residentRoleType;
    if (ownershipType.isNotEmpty) return ownershipType;
    if (role.isNotEmpty) {
      return role[0].toUpperCase() + role.substring(1).toLowerCase();
    }
    return 'Resident';
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
      case 'societyCode':
        return societyCode;
      case 'country':
        return country;
      case 'city':
        return city;
      case 'tower':
        return tower;
      case 'flatNumber':
        return flatNumber;
      case 'unitNumber':
        return unitNumber;
      case 'gateName':
        return gateName;
      case 'role':
        return role;
      case 'residentRoleType':
        return residentRoleType;
      case 'ownershipType':
        return ownershipType;
      case 'occupancyStatus':
        return occupancyStatus;
      case 'status':
        return status;
      case 'createdAt':
        return createdAt;
      case 'photoUrl':
        return photoUrl;
      case 'notificationPreferences':
        return notificationPreferences;
      default:
        return null;
    }
  }
}
