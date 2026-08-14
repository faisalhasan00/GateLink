abstract class AmenityRepository {
  Stream<List<Map<String, dynamic>>> watchAmenities(String societyId);
  Stream<List<Map<String, dynamic>>> watchAmenityBookings(String societyId);
  Future<void> bookAmenity(String societyId, Map<String, dynamic> bookingData);
}
