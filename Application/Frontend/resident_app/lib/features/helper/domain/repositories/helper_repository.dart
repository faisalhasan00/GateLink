import '../models/helper_attendance_day.dart';
import '../models/helper_log_model.dart';
import '../models/helper_model.dart';
import '../models/helper_salary_record.dart';

abstract class HelperRepository {
  Stream<List<HelperModel>> watchMyHelpers(
      String societyId, String residentUid);
  Stream<List<HelperLogModel>> watchTodayHelperLogs(String societyId);
  Future<List<HelperAttendanceDay>> getMonthlyAttendance(
      String societyId, String helperId, int year, int month);
  Future<HelperSalaryRecord?> getSalaryRecord(
      String societyId, String helperId, String yearMonth);
  Future<void> saveSalaryRecord(
      String societyId, String helperId, HelperSalaryRecord record);
  Future<void> updateHelperSalaryConfig(
      String societyId, String helperId, double monthlySalary, String salaryCalculationType);
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
  Future<void> updateHelperStatus({
    required String societyId,
    required String helperId,
    required String status,
  });
  Future<void> deleteHelper({
    required String societyId,
    required String helperId,
  });
}
