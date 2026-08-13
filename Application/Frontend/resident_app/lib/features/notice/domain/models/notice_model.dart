import 'package:cloud_firestore/cloud_firestore.dart';

class NoticeModel {
  final String id;
  final String title;
  final String description;
  final String category;
  final String date;
  final bool isNew;
  final String createdAt;
  final String author;
  final String authorRole;

  const NoticeModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.date,
    required this.isNew,
    required this.createdAt,
    required this.author,
    required this.authorRole,
  });

  factory NoticeModel.fromMap(Map<String, dynamic> map, {String? defaultId}) {
    return NoticeModel(
      id: map['id'] as String? ?? defaultId ?? '',
      title: map['title'] as String? ?? 'Notice',
      description: map['description'] as String? ?? '',
      category: map['category'] as String? ?? 'General',
      date: map['date'] as String? ?? '',
      isNew: map['isNew'] as bool? ?? false,
      createdAt: map['createdAt'] as String? ?? '',
      author: map['author'] as String? ?? 'Society Management',
      authorRole: map['authorRole'] as String? ?? 'Admin',
    );
  }

  factory NoticeModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return NoticeModel.fromMap(data, defaultId: doc.id);
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'date': date,
      'isNew': isNew,
      'createdAt': createdAt,
      'author': author,
      'authorRole': authorRole,
    };
  }

  NoticeModel copyWith({
    String? id,
    String? title,
    String? description,
    String? category,
    String? date,
    bool? isNew,
    String? createdAt,
    String? author,
    String? authorRole,
  }) {
    return NoticeModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      date: date ?? this.date,
      isNew: isNew ?? this.isNew,
      createdAt: createdAt ?? this.createdAt,
      author: author ?? this.author,
      authorRole: authorRole ?? this.authorRole,
    );
  }
}
