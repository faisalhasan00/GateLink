import '../models/complaint_model.dart';

abstract class ComplaintRepository {
  Stream<List<ComplaintModel>> watchComplaints(String societyId);
}
