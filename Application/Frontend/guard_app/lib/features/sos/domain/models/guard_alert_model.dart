import 'package:flutter/foundation.dart';

@immutable
class GuardAlertModel {
  final String id;
  final String? residentUid;
  final String? residentName;
  final String? flatNumber;
  final String? phone;
  final String? guardEmail;
  final String message;
  final String type; // SOS, Medical, Fire, Security Threat, Accident, Other
  final String status; // active, Triggered, Acknowledged, Resolved
  final DateTime createdAt;
  final String? notes;

  const GuardAlertModel({
    required this.id,
    this.residentUid,
    this.residentName,
    this.flatNumber,
    this.phone,
    this.guardEmail,
    required this.message,
    required this.type,
    required this.status,
    required this.createdAt,
    this.notes,
  });

  factory GuardAlertModel.fromMap(Map<String, dynamic> map, String id) {
    DateTime parseDate(dynamic val) {
      if (val is String && val.isNotEmpty) {
        return DateTime.tryParse(val) ?? DateTime.now();
      }
      return DateTime.now();
    }

    return GuardAlertModel(
      id: id,
      residentUid: map['residentUid'] as String?,
      residentName: map['residentName'] as String?,
      flatNumber: map['flatNumber'] as String?,
      phone: map['phone'] as String?,
      guardEmail: map['guardEmail'] as String?,
      message: map['message'] as String? ?? 'Emergency SOS Alert',
      type: map['type'] as String? ?? 'SOS',
      status: map['status'] as String? ?? 'active',
      createdAt: parseDate(map['createdAt'] ?? map['timestamp']),
      notes: map['notes'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      if (residentUid != null) 'residentUid': residentUid,
      if (residentName != null) 'residentName': residentName,
      if (flatNumber != null) 'flatNumber': flatNumber,
      if (phone != null) 'phone': phone,
      if (guardEmail != null) 'guardEmail': guardEmail,
      'message': message,
      'type': type,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'timestamp': createdAt.toIso8601String(),
      if (notes != null) 'notes': notes,
    };
  }
}
