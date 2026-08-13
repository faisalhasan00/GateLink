import 'package:cloud_firestore/cloud_firestore.dart';

class ComplaintModel {
  final String id;
  final String title;
  final String category;
  final String description;
  final String status;
  final String residentName;
  final String flatNumber;
  final String createdAt;

  const ComplaintModel({
    required this.id,
    required this.title,
    required this.category,
    required this.description,
    required this.status,
    required this.residentName,
    required this.flatNumber,
    required this.createdAt,
  });

  factory ComplaintModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return ComplaintModel(
      id: doc.id,
      title: data['title'] as String? ?? 'Complaint',
      category: data['category'] as String? ?? 'General',
      description: data['description'] as String? ?? '',
      status: data['status'] as String? ?? 'Pending',
      residentName: data['residentName'] as String? ?? '',
      flatNumber: data['flatNumber'] as String? ?? '',
      createdAt: data['createdAt'] as String? ?? '',
    );
  }
}
