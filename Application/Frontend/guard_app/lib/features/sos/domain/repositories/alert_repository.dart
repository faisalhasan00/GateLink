import '../models/guard_alert_model.dart';

abstract class AlertRepository {
  Future<void> broadcastSosAlert(String societyId, GuardAlertModel alert);
  Future<void> sendSosNotification(String societyId, {required String title, required String body});
}
