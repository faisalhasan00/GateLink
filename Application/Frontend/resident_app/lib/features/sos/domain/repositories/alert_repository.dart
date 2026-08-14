abstract class AlertRepository {
  Future<String> triggerEmergencySos({
    required String societyId,
    required String guardEmail,
    required String message,
  });

  Future<void> broadcastSosAlert({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String phone,
    required String type,
    required String notes,
  });
}
