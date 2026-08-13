import '../models/helper_log_model.dart';
import '../models/helper_model.dart';

abstract class HelperRepository {
  Stream<List<HelperModel>> watchMyHelpers(String societyId, String residentUid);
  Stream<List<HelperLogModel>> watchTodayHelperLogs(String societyId);
  Future<void> registerHelper({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String name,
    required String phone,
    required String type,
    required String govtIdType,
    required String govtIdNumber,
    required String workingDays,
    required String emergencyContact,
  });
}
