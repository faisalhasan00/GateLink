import '../models/parking_slot_model.dart';

abstract class ParkingRepository {
  Stream<List<ParkingSlotModel>> watchParkingSlots(
      String societyId, String uid);
  Future<List<ParkingSlotModel>> getParkingSlots(String societyId, String uid);
}
