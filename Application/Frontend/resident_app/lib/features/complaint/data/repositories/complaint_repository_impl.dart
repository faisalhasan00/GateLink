import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/complaint_model.dart';
import '../../domain/repositories/complaint_repository.dart';

class ComplaintRepositoryImpl implements ComplaintRepository {
  final FirebaseFirestore _firestore;

  ComplaintRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<ComplaintModel>> watchMyComplaints(
      String societyId, String residentUid) {
    if (societyId.isEmpty || residentUid.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/complaints')
        .where('raisedBy', isEqualTo: residentUid)
        .limit(50)
        .snapshots()
        .map((snapshot) {
      final list = snapshot.docs
          .map((doc) => ComplaintModel.fromMap(doc.data(), defaultId: doc.id))
          .toList();
      list.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return list;
    });
  }

  @override
  Stream<ComplaintModel?> watchComplaintDetail(
      String societyId, String complaintId) {
    if (societyId.isEmpty || complaintId.isEmpty) return Stream.value(null);

    return _firestore
        .collection('societies/$societyId/complaints')
        .doc(complaintId)
        .snapshots()
        .map((doc) {
      if (!doc.exists || doc.data() == null) return null;
      return ComplaintModel.fromMap(doc.data()!, defaultId: doc.id);
    });
  }

  @override
  Future<String> raiseComplaint({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String title,
    required String description,
    required String category,
    required String block,
    required String floor,
    required String priority,
    String? photoUrl,
  }) async {
    final ticketNum =
        'CMP-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
    final nowStr = DateTime.now().toIso8601String();

    final docRef =
        await _firestore.collection('societies/$societyId/complaints').add({
      'ticketNumber': ticketNum,
      'title': title.trim(),
      'description': description.trim(),
      'category': category,
      'status': 'open',
      'raisedBy': residentUid,
      'residentUid': residentUid,
      'residentName': residentName,
      'flatNumber': flatNumber,
      'block': block,
      'floor': floor,
      'priority': priority,
      'photoUrl': photoUrl,
      'createdAt': nowStr,
      'updatedAt': nowStr,
    });

    // Write Live Notification to Society Admin
    try {
      final senderName = residentName.isNotEmpty ? residentName : 'Resident';
      final senderFlat = flatNumber.isNotEmpty ? ' (Flat $flatNumber)' : '';

      await _firestore.collection('societies/$societyId/notifications').add({
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

      await _firestore.collection('notifications').add({
        'title': '🚨 New Complaint: $ticketNum',
        'message':
            '$category complaint raised by $senderName$senderFlat ($title)',
        'societyId': societyId,
        'type': 'complaint',
        'read': false,
        'createdAt': nowStr,
      });
    } catch (_) {}

    return docRef.id;
  }
}
