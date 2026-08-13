class HelperModel {
  final String id;
  final String name;
  final String phone;
  final String type;
  final String govtIdType;
  final String govtIdNumber;
  final String workingDays;
  final String emergencyContact;
  final String residentUid;
  final String residentName;
  final String flatNumber;
  final String status;
  final String createdAt;

  const HelperModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.type,
    required this.govtIdType,
    required this.govtIdNumber,
    required this.workingDays,
    required this.emergencyContact,
    required this.residentUid,
    required this.residentName,
    required this.flatNumber,
    required this.status,
    required this.createdAt,
  });

  factory HelperModel.fromMap(Map<String, dynamic> map, {String? defaultId}) {
    return HelperModel(
      id: map['id'] as String? ?? defaultId ?? '',
      name: map['name'] as String? ?? 'Helper',
      phone: map['phone'] as String? ?? '',
      type: map['type'] as String? ?? 'Maid',
      govtIdType: map['govtIdType'] as String? ?? 'Aadhaar Card',
      govtIdNumber: map['govtIdNumber'] as String? ?? '',
      workingDays: map['workingDays'] as String? ?? 'Mon - Sat',
      emergencyContact: map['emergencyContact'] as String? ?? '',
      residentUid: map['residentUid'] as String? ?? '',
      residentName: map['residentName'] as String? ?? 'Resident',
      flatNumber: map['flatNumber'] as String? ?? 'A-402',
      status: map['status'] as String? ?? 'Active',
      createdAt: map['createdAt'] as String? ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'type': type,
      'govtIdType': govtIdType,
      'govtIdNumber': govtIdNumber,
      'workingDays': workingDays,
      'emergencyContact': emergencyContact,
      'residentUid': residentUid,
      'residentName': residentName,
      'flatNumber': flatNumber,
      'status': status,
      'createdAt': createdAt,
    };
  }

  bool get isActive => status.toLowerCase() == 'active';

  HelperModel copyWith({
    String? id,
    String? name,
    String? phone,
    String? type,
    String? govtIdType,
    String? govtIdNumber,
    String? workingDays,
    String? emergencyContact,
    String? residentUid,
    String? residentName,
    String? flatNumber,
    String? status,
    String? createdAt,
  }) {
    return HelperModel(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      type: type ?? this.type,
      govtIdType: govtIdType ?? this.govtIdType,
      govtIdNumber: govtIdNumber ?? this.govtIdNumber,
      workingDays: workingDays ?? this.workingDays,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      residentUid: residentUid ?? this.residentUid,
      residentName: residentName ?? this.residentName,
      flatNumber: flatNumber ?? this.flatNumber,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
