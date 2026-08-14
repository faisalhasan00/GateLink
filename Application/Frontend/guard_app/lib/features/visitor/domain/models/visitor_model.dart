import 'package:flutter/foundation.dart';

@immutable
class VisitorModel {
  final String id;
  final String name;
  final String phone;
  final String type; // Guest, Delivery, Cab, Daily Help
  final String hostFlat;
  final String? vehicleNumber;
  final String? vehicleType;
  final String? company;
  final String? gender;
  final String? photoUrl;
  final String? notes;
  final String status; // pending, approved, denied, inside, left
  final DateTime? entryTime;
  final DateTime? exitTime;
  final DateTime createdAt;
  final String? guardUid;
  final String? gateName;

  const VisitorModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.type,
    required this.hostFlat,
    this.vehicleNumber,
    this.vehicleType,
    this.company,
    this.gender,
    this.photoUrl,
    this.notes,
    required this.status,
    this.entryTime,
    this.exitTime,
    required this.createdAt,
    this.guardUid,
    this.gateName,
  });

  factory VisitorModel.fromMap(Map<String, dynamic> map, String id) {
    DateTime? parseDate(dynamic val) {
      if (val == null) return null;
      if (val is String && val.isNotEmpty) {
        return DateTime.tryParse(val);
      }
      return null;
    }

    return VisitorModel(
      id: id,
      name: map['name'] as String? ?? 'Unknown Visitor',
      phone: map['phone'] as String? ?? '',
      type: map['type'] as String? ?? 'Guest',
      hostFlat: map['hostFlat'] as String? ?? map['flatNumber'] as String? ?? '',
      vehicleNumber: map['vehicleNumber'] as String?,
      vehicleType: map['vehicleType'] as String?,
      company: map['company'] as String?,
      gender: map['gender'] as String?,
      photoUrl: map['photoUrl'] as String?,
      notes: map['notes'] as String?,
      status: map['status'] as String? ?? 'pending',
      entryTime: parseDate(map['entryTime']),
      exitTime: parseDate(map['exitTime']),
      createdAt: parseDate(map['createdAt']) ?? DateTime.now(),
      guardUid: map['guardUid'] as String?,
      gateName: map['gateName'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'phone': phone,
      'type': type,
      'hostFlat': hostFlat,
      if (vehicleNumber != null) 'vehicleNumber': vehicleNumber,
      if (vehicleType != null) 'vehicleType': vehicleType,
      if (company != null) 'company': company,
      if (gender != null) 'gender': gender,
      if (photoUrl != null) 'photoUrl': photoUrl,
      if (notes != null) 'notes': notes,
      'status': status,
      if (entryTime != null) 'entryTime': entryTime!.toIso8601String(),
      if (exitTime != null) 'exitTime': exitTime!.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      if (guardUid != null) 'guardUid': guardUid,
      if (gateName != null) 'gateName': gateName,
    };
  }

  VisitorModel copyWith({
    String? id,
    String? name,
    String? phone,
    String? type,
    String? hostFlat,
    String? vehicleNumber,
    String? vehicleType,
    String? company,
    String? gender,
    String? photoUrl,
    String? notes,
    String? status,
    DateTime? entryTime,
    DateTime? exitTime,
    DateTime? createdAt,
    String? guardUid,
    String? gateName,
  }) {
    return VisitorModel(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      type: type ?? this.type,
      hostFlat: hostFlat ?? this.hostFlat,
      vehicleNumber: vehicleNumber ?? this.vehicleNumber,
      vehicleType: vehicleType ?? this.vehicleType,
      company: company ?? this.company,
      gender: gender ?? this.gender,
      photoUrl: photoUrl ?? this.photoUrl,
      notes: notes ?? this.notes,
      status: status ?? this.status,
      entryTime: entryTime ?? this.entryTime,
      exitTime: exitTime ?? this.exitTime,
      createdAt: createdAt ?? this.createdAt,
      guardUid: guardUid ?? this.guardUid,
      gateName: gateName ?? this.gateName,
    );
  }
}
