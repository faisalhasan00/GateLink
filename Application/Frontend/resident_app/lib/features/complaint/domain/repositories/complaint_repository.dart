import '../models/complaint_model.dart';

abstract class ComplaintRepository {
  Stream<List<ComplaintModel>> watchMyComplaints(String societyId, String residentUid);
  Stream<ComplaintModel?> watchComplaintDetail(String societyId, String complaintId);
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
  });
}
