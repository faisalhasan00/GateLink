import 'package:cloud_firestore/cloud_firestore.dart';

class NoticeModel {
  final String id;
  final String title;
  final String description;
  final String category;
  final String date;
  final String createdAt;

  const NoticeModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.date,
    required this.createdAt,
  });

  factory NoticeModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return NoticeModel(
      id: doc.id,
      title: data['title'] as String? ?? 'Notice',
      description: data['description'] as String? ?? '',
      category: data['category'] as String? ?? 'General',
      date: data['date'] as String? ?? '',
      createdAt: data['createdAt'] as String? ?? '',
    );
  }
}
