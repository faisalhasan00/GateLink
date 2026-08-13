import 'package:cloud_firestore/cloud_firestore.dart';

class AlertModel {
  final String id;
  final String type;
  final String guardEmail;
  final String message;
  final String createdAt;
  final String status;

  const AlertModel({
    required this.id,
    required this.type,
    required this.guardEmail,
    required this.message,
    required this.createdAt,
    required this.status,
  });

  factory AlertModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return AlertModel(
      id: doc.id,
      type: data['type'] as String? ?? 'SOS',
      guardEmail: data['guardEmail'] as String? ?? '',
      message: data['message'] as String? ?? '',
      createdAt: data['createdAt'] as String? ?? '',
      status: data['status'] as String? ?? 'active',
    );
  }
}
