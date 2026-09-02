import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/amenity_repository.dart';
import 'amenity_state.dart';

class AmenityController extends StateNotifier<AmenityState> {
  final AmenityRepository _repository;

  AmenityController(this._repository) : super(AmenityState.initial());

  void resetState() {
    state = AmenityState.initial();
  }

  Future<bool> bookAmenity({
    required String societyId,
    required String amenityId,
    required String amenityName,
    required String uid,
    required String userName,
    required String flatNumber,
    required String phone,
    required DateTime? selectedDate,
    required String? selectedSlot,
    int guests = 1,
    String? specialNotes,
  }) async {
    if (state.isLoading) return false;

    if (selectedDate == null || selectedSlot == null || selectedSlot.isEmpty) {
      state = state.copyWith(
        status: AmenityActionStatus.error,
        errorMessage: 'Please select both a date and a time slot.',
      );
      return false;
    }

    if (uid.isEmpty) {
      state = state.copyWith(
        status: AmenityActionStatus.error,
        errorMessage: 'User session expired. Please log in again.',
      );
      return false;
    }

    state = state.copyWith(status: AmenityActionStatus.loading);

    try {
      final dateStr =
          '${selectedDate.day}/${selectedDate.month}/${selectedDate.year}';
      await _repository.bookAmenity(
        societyId: societyId,
        amenityId: amenityId,
        amenityName: amenityName,
        uid: uid,
        userName: userName,
        flatNumber: flatNumber,
        phone: phone,
        date: dateStr,
        timeSlot: selectedSlot,
        guests: guests,
        specialNotes: specialNotes,
      );

      state = state.copyWith(
        status: AmenityActionStatus.success,
        successMessage:
            'Your slot for $amenityName at $selectedSlot has been booked.',
      );
      return true;
    } catch (e) {
      final cleanErr = e.toString().replaceAll('Exception: ', '');
      state = state.copyWith(
        status: AmenityActionStatus.error,
        errorMessage: cleanErr,
      );
      return false;
    }
  }

  Future<bool> cancelBooking({
    required String societyId,
    required String bookingId,
    required String uid,
  }) async {
    if (state.isLoading) return false;

    if (bookingId.isEmpty) {
      state = state.copyWith(
        status: AmenityActionStatus.error,
        errorMessage: 'Invalid booking ID.',
      );
      return false;
    }

    state = state.copyWith(status: AmenityActionStatus.loading);

    try {
      await _repository.cancelAmenityBooking(societyId, bookingId, uid);
      state = state.copyWith(
        status: AmenityActionStatus.success,
        successMessage: 'Booking cancelled successfully.',
      );
      return true;
    } catch (e) {
      final cleanErr = e.toString().replaceAll('Exception: ', '');
      state = state.copyWith(
        status: AmenityActionStatus.error,
        errorMessage: cleanErr,
      );
      return false;
    }
  }

  Future<bool> seedDefaultAmenities(String societyId) async {
    if (societyId.isEmpty) return false;
    if (state.isLoading) return false;

    state = state.copyWith(status: AmenityActionStatus.loading);

    try {
      await _repository.seedDefaultAmenities(societyId);
      state = state.copyWith(
        status: AmenityActionStatus.success,
        successMessage: 'Default amenities seeded successfully.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: AmenityActionStatus.error,
        errorMessage: 'Failed to seed default amenities.',
      );
      return false;
    }
  }
}
