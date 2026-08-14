import '../models/amenity_model.dart';
import '../models/amenity_booking_model.dart';

abstract class AmenityRepository {
  Stream<List<AmenityModel>> watchAmenities(String societyId);
  Stream<List<AmenityBookingModel>> watchMyBookings(
      String societyId, String uid);
  Stream<List<AmenityBookingModel>> watchAllBookings(String societyId);
  Future<AmenityModel?> fetchAmenityById(String societyId, String amenityId);
  Future<List<String>> getBookedSlotsForDate(
      String societyId, String amenityId, String date);
  Future<void> bookAmenity({
    required String societyId,
    required String amenityId,
    required String amenityName,
    required String uid,
    required String userName,
    required String flatNumber,
    required String phone,
    required String date,
    required String timeSlot,
    int guests = 1,
    String? specialNotes,
  });
  Future<void> cancelAmenityBooking(
      String societyId, String bookingId, String uid);
  Future<void> seedDefaultAmenities(String societyId);
}
