import 'package:cloud_firestore/cloud_firestore.dart';
import 'visitor_status.dart';

class VisitorModel {
  final String id;
  final String name;
  final String phone;
  final String type;
  final String hostFlat;
  final String? hostResidentName;
  final String? hostResidentUid;
  final String? invitedBy;
  final String? passCode;
  final String? qrCode;
  final VisitorStatus status;
  final String passType; // 'one_time' or 'multi_day'
  final String? validFrom;
  final String? validUntil;
  final int entryCount;
  final int maxEntries;
  final String? vehicleNumber;
  final String? vehicleType;
  final String? company;
  final String? gender;
  final String? photoUrl;
  final String? notes;
  final String? guardUid;
  final String? gateName;
  final String? expectedDate;
  final String? expectedTime;
  final String? entryTime;
  final String? exitTime;
  final String? createdDate;
  final String? createdAt;
  final String? approvedAt;
  final String? approvedBy;
  final String? rejectedAt;
  final String? rejectedBy;
  final String? rejectionReason;
  final int? durationMinutes;
  final String? durationString;

  const VisitorModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.type,
    required this.hostFlat,
    this.hostResidentName,
    this.hostResidentUid,
    this.invitedBy,
    this.passCode,
    this.qrCode,
    required this.status,
    this.passType = 'one_time',
    this.validFrom,
    this.validUntil,
    this.entryCount = 0,
    this.maxEntries = 1,
    this.vehicleNumber,
    this.vehicleType,
    this.company,
    this.gender,
    this.photoUrl,
    this.notes,
    this.guardUid,
    this.gateName,
    this.expectedDate,
    this.expectedTime,
    this.entryTime,
    this.exitTime,
    this.createdDate,
    this.createdAt,
    this.approvedAt,
    this.approvedBy,
    this.rejectedAt,
    this.rejectedBy,
    this.rejectionReason,
    this.durationMinutes,
    this.durationString,
  });

  factory VisitorModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return VisitorModel.fromMap(doc.id, data);
  }

  factory VisitorModel.fromMap(String docId, Map<String, dynamic> map) {
    final pType = map['passType'] as String? ?? 'one_time';
    return VisitorModel(
      id: docId,
      name: map['name'] as String? ?? 'Unknown Visitor',
      phone: map['phone'] as String? ?? 'N/A',
      type: map['type'] as String? ?? map['purpose'] as String? ?? 'Guest',
      hostFlat: map['hostFlat'] as String? ?? 'N/A',
      hostResidentName: map['hostResidentName'] as String?,
      hostResidentUid: map['hostResidentUid'] as String?,
      invitedBy: map['invitedBy'] as String?,
      passCode: map['passCode'] as String?,
      qrCode: map['qrCode'] as String?,
      status: VisitorStatus.fromString(map['status'] as String?),
      passType: pType,
      validFrom: map['validFrom'] as String?,
      validUntil: map['validUntil'] as String?,
      entryCount: (map['entryCount'] as num?)?.toInt() ?? 0,
      maxEntries: (map['maxEntries'] as num?)?.toInt() ?? (pType == 'multi_day' ? -1 : 1),
      vehicleNumber: map['vehicleNumber'] as String?,
      vehicleType: map['vehicleType'] as String?,
      company: map['company'] as String?,
      gender: map['gender'] as String?,
      photoUrl: map['photoUrl'] as String?,
      notes: map['notes'] as String?,
      guardUid: map['guardUid'] as String?,
      gateName: map['gateName'] as String?,
      expectedDate: map['expectedDate'] as String?,
      expectedTime: map['expectedTime'] as String?,
      entryTime: map['entryTime'] as String?,
      exitTime: map['exitTime'] as String?,
      createdDate: map['createdDate'] as String? ?? map['createdAt'] as String?,
      createdAt: map['createdAt'] as String?,
      approvedAt: map['approvedAt'] as String?,
      approvedBy: map['approvedBy'] as String?,
      rejectedAt: map['rejectedAt'] as String?,
      rejectedBy: map['rejectedBy'] as String?,
      rejectionReason: map['rejectionReason'] as String?,
      durationMinutes: map['durationMinutes'] as int?,
      durationString: map['durationString'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'phone': phone,
      'type': type,
      'hostFlat': hostFlat,
      if (hostResidentName != null) 'hostResidentName': hostResidentName,
      if (hostResidentUid != null) 'hostResidentUid': hostResidentUid,
      if (invitedBy != null) 'invitedBy': invitedBy,
      if (passCode != null) 'passCode': passCode,
      if (qrCode != null) 'qrCode': qrCode,
      'status': status.toFirestore(),
      'passType': passType,
      if (validFrom != null) 'validFrom': validFrom,
      if (validUntil != null) 'validUntil': validUntil,
      'entryCount': entryCount,
      'maxEntries': maxEntries,
      if (vehicleNumber != null) 'vehicleNumber': vehicleNumber,
      if (vehicleType != null) 'vehicleType': vehicleType,
      if (company != null) 'company': company,
      if (gender != null) 'gender': gender,
      if (photoUrl != null) 'photoUrl': photoUrl,
      if (notes != null) 'notes': notes,
      if (guardUid != null) 'guardUid': guardUid,
      if (gateName != null) 'gateName': gateName,
      if (expectedDate != null) 'expectedDate': expectedDate,
      if (expectedTime != null) 'expectedTime': expectedTime,
      if (entryTime != null) 'entryTime': entryTime,
      if (exitTime != null) 'exitTime': exitTime,
      if (createdDate != null) 'createdDate': createdDate,
      if (createdAt != null) 'createdAt': createdAt,
      if (approvedAt != null) 'approvedAt': approvedAt,
      if (approvedBy != null) 'approvedBy': approvedBy,
      if (rejectedAt != null) 'rejectedAt': rejectedAt,
      if (rejectedBy != null) 'rejectedBy': rejectedBy,
      if (rejectionReason != null) 'rejectionReason': rejectionReason,
      if (durationMinutes != null) 'durationMinutes': durationMinutes,
      if (durationString != null) 'durationString': durationString,
    };
  }

  String get initials {
    if (name.trim().isEmpty) return 'V';
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name[0].toUpperCase();
  }

  bool get isOneTimePass => passType == 'one_time';
  bool get isMultiDayPass => passType == 'multi_day';
  bool get isPending => status == VisitorStatus.pending;
  bool get isExpected => status == VisitorStatus.expected;
  bool get isApproved => status == VisitorStatus.approved;
  bool get isRejected => status == VisitorStatus.rejected;
  bool get isInside => status == VisitorStatus.inside;
  bool get isCheckedOut => status == VisitorStatus.checkedOut;
}
