import 'package:cloud_firestore/cloud_firestore.dart';

class ComplaintModel {
  final String id;
  final String ticketNumber;
  final String title;
  final String category;
  final String description;
  final String status;
  final String raisedBy;
  final String residentUid;
  final String residentName;
  final String flatNumber;
  final String block;
  final String floor;
  final String priority;
  final String? photoUrl;
  final String? assignedTo;
  final int? rating;
  final String? ratingFeedback;
  final String createdAt;
  final String updatedAt;

  const ComplaintModel({
    required this.id,
    required this.ticketNumber,
    required this.title,
    required this.category,
    required this.description,
    required this.status,
    required this.raisedBy,
    required this.residentUid,
    required this.residentName,
    required this.flatNumber,
    required this.block,
    required this.floor,
    required this.priority,
    this.photoUrl,
    this.assignedTo,
    this.rating,
    this.ratingFeedback,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ComplaintModel.fromMap(Map<String, dynamic> map,
      {String? defaultId}) {
    final id = map['id'] as String? ?? defaultId ?? '';
    final ticketNumber = map['ticketNumber'] as String? ?? '#CMP-$id';
    return ComplaintModel(
      id: id,
      ticketNumber: ticketNumber,
      title: map['title'] as String? ?? 'Complaint',
      category: map['category'] as String? ?? 'General',
      description: map['description'] as String? ?? '',
      status: (map['status'] as String? ?? 'open').toLowerCase(),
      raisedBy: map['raisedBy'] as String? ?? map['uid'] as String? ?? '',
      residentUid: map['residentUid'] as String? ?? map['uid'] as String? ?? '',
      residentName: map['residentName'] as String? ?? 'Resident',
      flatNumber: map['flatNumber'] as String? ?? '',
      block: map['block'] as String? ?? '',
      floor: map['floor'] as String? ?? '',
      priority: map['priority'] as String? ?? 'medium',
      photoUrl: map['photoUrl'] as String?,
      assignedTo: map['assignedTo'] as String?,
      rating: map['rating'] is int ? map['rating'] as int : (map['rating'] is num ? (map['rating'] as num).toInt() : null),
      ratingFeedback: map['ratingFeedback'] as String?,
      createdAt: map['createdAt'] as String? ?? '',
      updatedAt: map['updatedAt'] as String? ?? '',
    );
  }

  factory ComplaintModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return ComplaintModel.fromMap(data, defaultId: doc.id);
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'ticketNumber': ticketNumber,
      'title': title,
      'category': category,
      'description': description,
      'status': status,
      'raisedBy': raisedBy,
      'residentUid': residentUid,
      'residentName': residentName,
      'flatNumber': flatNumber,
      'block': block,
      'floor': floor,
      'priority': priority,
      'photoUrl': photoUrl,
      'assignedTo': assignedTo,
      'rating': rating,
      'ratingFeedback': ratingFeedback,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  bool get isResolved {
    final s = status.toLowerCase();
    return s == 'resolved' || s == 'closed' || s == 'completed';
  }

  bool get isInProgress {
    final s = status.toLowerCase();
    return s == 'in_progress' || s == 'in progress' || s == 'assigned';
  }

  ComplaintModel copyWith({
    String? id,
    String? ticketNumber,
    String? title,
    String? category,
    String? description,
    String? status,
    String? raisedBy,
    String? residentUid,
    String? residentName,
    String? flatNumber,
    String? block,
    String? floor,
    String? priority,
    String? photoUrl,
    String? assignedTo,
    String? createdAt,
    String? updatedAt,
  }) {
    return ComplaintModel(
      id: id ?? this.id,
      ticketNumber: ticketNumber ?? this.ticketNumber,
      title: title ?? this.title,
      category: category ?? this.category,
      description: description ?? this.description,
      status: status ?? this.status,
      raisedBy: raisedBy ?? this.raisedBy,
      residentUid: residentUid ?? this.residentUid,
      residentName: residentName ?? this.residentName,
      flatNumber: flatNumber ?? this.flatNumber,
      block: block ?? this.block,
      floor: floor ?? this.floor,
      priority: priority ?? this.priority,
      photoUrl: photoUrl ?? this.photoUrl,
      assignedTo: assignedTo ?? this.assignedTo,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
