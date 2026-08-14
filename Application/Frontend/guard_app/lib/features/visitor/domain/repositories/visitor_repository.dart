import '../models/visitor_model.dart';

abstract class VisitorRepository {
  Stream<List<VisitorModel>> watchTodayVisitors(String societyId);
  Future<Map<String, dynamic>> validateAndProcessQrScan(String societyId, String qrCode);
  Future<void> updateVisitorStatus(String societyId, String visitorId, String status);
  Future<void> markVisitorExit(String societyId, String visitorId);
  Future<void> approveVisitorEntry(String societyId, String visitorId);
  Future<void> logVisitorEntry(String societyId, VisitorModel visitor);
}
