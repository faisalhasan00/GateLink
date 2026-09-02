import '../models/parking_slot_model.dart';

abstract class ParkingRepository {
  Stream<List<ParkingSlotModel>> watchParkingSlots(
      String societyId, String uid);
  Future<List<ParkingSlotModel>> getParkingSlots(String societyId, String uid);
  Future<void> addVehicle({
    required String societyId,
    required String uid,
    required String slot,
    required String level,
    required String number,
    required String type,
    required String model,
    required String color,
  });
  Future<void> seedDemoVehicles(String societyId, String uid);
}
