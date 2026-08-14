import 'package:flutter/foundation.dart';

@immutable
class HelperModel {
  final String id;
  final String name;
  final String phone;
  final String type; // Maid, Driver, Cook, etc.
  final String? govtIdType;
  final String? govtIdNumber;
  final String workingDays;
  final String? emergencyContact;
  final String? residentUid;
  final String? residentName;
  final String? flatNumber;
  final String status; // Active, Inactive
  final DateTime createdAt;

  const HelperModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.type,
    this.govtIdType,
    this.govtIdNumber,
    required this.workingDays,
    this.emergencyContact,
    this.residentUid,
    this.residentName,
    this.flatNumber,
    required this.status,
    required this.createdAt,
  });

  factory HelperModel.fromMap(Map<String, dynamic> map, String id) {
    DateTime parseDate(dynamic val) {
      if (val is String && val.isNotEmpty) {
        return DateTime.tryParse(val) ?? DateTime.now();
      }
      return DateTime.now();
    }

    return HelperModel(
      id: id,
      name: map['name'] as String? ?? 'Unknown Helper',
      phone: map['phone'] as String? ?? '',
      type: map['type'] as String? ?? 'Maid',
      govtIdType: map['govtIdType'] as String?,
      govtIdNumber: map['govtIdNumber'] as String?,
      workingDays: map['workingDays'] as String? ?? 'Mon - Sat',
      emergencyContact: map['emergencyContact'] as String?,
      residentUid: map['residentUid'] as String?,
      residentName: map['residentName'] as String?,
      flatNumber: map['flatNumber'] as String?,
      status: map['status'] as String? ?? 'Active',
      createdAt: parseDate(map['createdAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'phone': phone,
      'type': type,
      if (govtIdType != null) 'govtIdType': govtIdType,
      if (govtIdNumber != null) 'govtIdNumber': govtIdNumber,
      'workingDays': workingDays,
      if (emergencyContact != null) 'emergencyContact': emergencyContact,
      if (residentUid != null) 'residentUid': residentUid,
      if (residentName != null) 'residentName': residentName,
      if (flatNumber != null) 'flatNumber': flatNumber,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

@immutable
class HelperLogModel {
  final String id;
  final String? helperId;
  final String name;
  final String action; // ENTRY, EXIT
  final String gateName;
  final DateTime timestamp;

  const HelperLogModel({
    required this.id,
    this.helperId,
    required this.name,
    required this.action,
    required this.gateName,
    required this.timestamp,
  });

  factory HelperLogModel.fromMap(Map<String, dynamic> map, String id) {
    DateTime parseDate(dynamic val) {
      if (val is String && val.isNotEmpty) {
        return DateTime.tryParse(val) ?? DateTime.now();
      }
      return DateTime.now();
    }

    return HelperLogModel(
      id: id,
      helperId: map['helperId'] as String?,
      name: map['name'] as String? ?? 'Entry',
      action: map['action'] as String? ?? 'ENTRY',
      gateName: map['gateName'] as String? ?? 'Gate 1',
      timestamp: parseDate(map['timestamp']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      if (helperId != null) 'helperId': helperId,
      'name': name,
      'action': action,
      'gateName': gateName,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}
