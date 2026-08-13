abstract class AlertRepository {
  Future<String> triggerEmergencySos({
    required String societyId,
    required String guardEmail,
    required String message,
  });
}
