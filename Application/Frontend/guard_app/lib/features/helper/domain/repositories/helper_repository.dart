import '../models/helper_log_model.dart';
import '../models/helper_model.dart';

abstract class HelperRepository {
  Stream<List<HelperModel>> watchRegisteredHelpers(String societyId, {String? residentUid});
  Stream<List<HelperLogModel>> watchHelperLogs(String societyId);
  Future<void> registerHelper(String societyId, HelperModel helper);
  Future<void> logHelperEntryExit(String societyId, HelperLogModel log);
}
