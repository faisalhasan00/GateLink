import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Handles Resident Complaints, Status Progression, and Admin Dispatch.
class ComplaintService {
  final FirebaseFirestore _db;
  final String societyId;

  ComplaintService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  Stream<QuerySnapshot> complaintsStream(String uid) {
    return _db
        .collection('societies/$societyId/complaints')
        .where('raisedBy', isEqualTo: uid)
        .snapshots();
  }

  Stream<DocumentSnapshot> complaintDetailStream(String complaintId) {
    return _db
        .collection('societies/$societyId/complaints')
        .doc(complaintId)
        .snapshots();
  }

  Future<String> raiseComplaint({
    required String title,
    required String description,
    required String category,
    required String uid,
    String? block,
    String? floor,
    String? priority,
    String? photoUrl,
    String? residentName,
    String? flatNumber,
  }) async {
    final ticketNum =
        'CMP-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
    final nowStr = DateTime.now().toIso8601String();

    final docRef = await _db.collection('societies/$societyId/complaints').add({
      'ticketNumber': ticketNum,
      'title': title,
      'description': description,
      'category': category,
      'status': 'Open',
      'raisedBy': uid,
      'residentUid': uid,
      'residentName': residentName ?? 'Resident',
      'flatNumber': flatNumber ?? '',
      'block': block ?? '',
      'floor': floor ?? '',
      'priority': priority ?? 'medium',
      'photoUrl': photoUrl,
      'createdAt': nowStr,
      'updatedAt': nowStr,
    });

    // Write Live Notification to Society Admin & Super Admin
    try {
      final senderName = residentName != null && residentName.isNotEmpty
          ? residentName
          : 'Resident';
      final senderFlat = flatNumber != null && flatNumber.isNotEmpty
          ? ' (Flat $flatNumber)'
          : '';

      await _db.collection('societies/$societyId/notifications').add({
        'title': '🚨 New Complaint: $ticketNum',
        'message':
            '$senderName$senderFlat raised a $category complaint: "$title"',
        'category': category,
        'type': 'complaint',
        'ticketNumber': ticketNum,
        'complaintId': docRef.id,
        'read': false,
        'createdAt': nowStr,
      });

      await _db.collection('notifications').add({
        'title': '🚨 New Complaint: $ticketNum',
        'message':
            '$category complaint raised by $senderName$senderFlat ($title)',
        'societyId': societyId,
        'type': 'complaint',
        'read': false,
        'createdAt': nowStr,
      });
    } catch (notifErr) {
      print('Error pushing complaint notification to admin: $notifErr');
    }

    return docRef.id;
  }
}
