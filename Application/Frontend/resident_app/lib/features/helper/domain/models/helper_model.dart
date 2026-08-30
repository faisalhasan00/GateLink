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
  final bool isInside;
  final String? lastCheckIn;
  final String? lastCheckOut;
  final String? qrCodeData;
  final String createdAt;
  final double? monthlySalary;
  final String salaryCalculationType; // 'pro_rata' | 'fixed_with_deductions'

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
    this.isInside = false,
    this.lastCheckIn,
    this.lastCheckOut,
    this.qrCodeData,
    required this.createdAt,
    this.monthlySalary,
    this.salaryCalculationType = 'pro_rata',
  });

  factory HelperModel.fromMap(Map<String, dynamic> map, {String? defaultId}) {
    final rawId = map['id'] as String? ?? defaultId ?? '';
    final socId = map['societyId'] as String? ?? '';
    return HelperModel(
      id: rawId,
      name: map['name'] as String? ?? 'Domestic Staff',
      phone: map['phone'] as String? ?? '',
      type: map['type'] as String? ?? (map['category'] as String? ?? 'Maid'),
      govtIdType: map['govtIdType'] as String? ?? 'Aadhaar Card',
      govtIdNumber: map['govtIdNumber'] as String? ?? '',
      workingDays: map['workingDays'] as String? ?? 'Mon - Sat',
      emergencyContact: map['emergencyContact'] as String? ?? '',
      residentUid: map['residentUid'] as String? ?? '',
      residentName: map['residentName'] as String? ?? 'Resident',
      flatNumber: map['flatNumber'] as String? ?? 'A-402',
      status: map['status'] as String? ?? 'Active',
      isInside: map['isInside'] as bool? ?? false,
      lastCheckIn: map['lastCheckIn'] as String?,
      lastCheckOut: map['lastCheckOut'] as String?,
      qrCodeData: map['qrCodeData'] as String? ?? (rawId.isNotEmpty ? 'GATELINK:HELPER:$socId:$rawId' : null),
      createdAt: map['createdAt'] as String? ?? '',
      monthlySalary: (map['monthlySalary'] as num?)?.toDouble() ?? 3500.0,
      salaryCalculationType: map['salaryCalculationType'] as String? ?? 'pro_rata',
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
      'isInside': isInside,
      'lastCheckIn': lastCheckIn,
      'lastCheckOut': lastCheckOut,
      'qrCodeData': qrCodeData ?? 'GATELINK:HELPER:$id',
      'createdAt': createdAt,
      'monthlySalary': monthlySalary ?? 3500.0,
      'salaryCalculationType': salaryCalculationType,
    };
  }

  bool get isActive => status.toLowerCase() == 'active';
  bool get isRevoked => status.toLowerCase() == 'revoked' || status.toLowerCase() == 'inactive';

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
    bool? isInside,
    String? lastCheckIn,
    String? lastCheckOut,
    String? qrCodeData,
    String? createdAt,
    double? monthlySalary,
    String? salaryCalculationType,
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
      isInside: isInside ?? this.isInside,
      lastCheckIn: lastCheckIn ?? this.lastCheckIn,
      lastCheckOut: lastCheckOut ?? this.lastCheckOut,
      qrCodeData: qrCodeData ?? this.qrCodeData,
      createdAt: createdAt ?? this.createdAt,
      monthlySalary: monthlySalary ?? this.monthlySalary,
      salaryCalculationType: salaryCalculationType ?? this.salaryCalculationType,
    );
  }
}
