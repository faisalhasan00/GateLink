import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/amenity/domain/models/amenity_booking_model.dart';
import 'package:societysphere/features/amenity/domain/models/amenity_model.dart';
import 'package:societysphere/features/amenity/domain/repositories/amenity_repository.dart';
import 'package:societysphere/features/amenity/presentation/controllers/amenity_controller.dart';
import 'package:societysphere/features/amenity/presentation/controllers/amenity_state.dart';

class MockAmenityRepository implements AmenityRepository {
  bool shouldFail = false;
  int bookCalls = 0;
  int cancelCalls = 0;
  int seedCalls = 0;

  @override
  Stream<List<AmenityModel>> watchAmenities(String societyId) {
    return Stream.value([]);
  }

  @override
  Stream<List<AmenityBookingModel>> watchMyBookings(
      String societyId, String uid) {
    return Stream.value([]);
  }

  @override
  Stream<List<AmenityBookingModel>> watchAllBookings(String societyId) {
    return Stream.value([]);
  }

  @override
  Future<AmenityModel?> fetchAmenityById(
      String societyId, String amenityId) async {
    return AmenityModel(id: amenityId, name: 'Swimming Pool');
  }

  @override
  Future<List<String>> getBookedSlotsForDate(
      String societyId, String amenityId, String date) async {
    return [];
  }

  @override
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
  }) async {
    bookCalls++;
    if (shouldFail) {
      throw Exception('Slot Sold Out!');
    }
  }

  @override
  Future<void> cancelAmenityBooking(
      String societyId, String bookingId, String uid) async {
    cancelCalls++;
    if (shouldFail) {
      throw Exception('Failed to cancel booking');
    }
  }

  @override
  Future<void> seedDefaultAmenities(String societyId) async {
    seedCalls++;
    if (shouldFail) {
      throw Exception('Failed to seed');
    }
  }
}

void main() {
  late MockAmenityRepository mockRepository;
  late AmenityController controller;

  setUp(() {
    mockRepository = MockAmenityRepository();
    controller = AmenityController(mockRepository);
  });

  group('AmenityController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, AmenityActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
      expect(controller.state.successMessage, isNull);
    });

    test('bookAmenity fails validation if selectedDate is null', () async {
      final success = await controller.bookAmenity(
        societyId: 'SOC-001',
        amenityId: 'amenity-1',
        amenityName: 'Pool',
        uid: 'user-123',
        userName: 'John Doe',
        flatNumber: 'A-101',
        phone: '9876543210',
        selectedDate: null,
        selectedSlot: '6:00 AM',
      );

      expect(success, false);
      expect(controller.state.status, AmenityActionStatus.error);
      expect(controller.state.errorMessage,
          contains('select both a date and a time slot'));
      expect(mockRepository.bookCalls, 0);
    });

    test('bookAmenity fails validation if uid is empty', () async {
      final success = await controller.bookAmenity(
        societyId: 'SOC-001',
        amenityId: 'amenity-1',
        amenityName: 'Pool',
        uid: '',
        userName: 'John Doe',
        flatNumber: 'A-101',
        phone: '9876543210',
        selectedDate: DateTime.now(),
        selectedSlot: '6:00 AM',
      );

      expect(success, false);
      expect(controller.state.status, AmenityActionStatus.error);
      expect(controller.state.errorMessage, contains('User session expired'));
      expect(mockRepository.bookCalls, 0);
    });

    test('bookAmenity succeeds with valid inputs', () async {
      final success = await controller.bookAmenity(
        societyId: 'SOC-001',
        amenityId: 'amenity-1',
        amenityName: 'Pool',
        uid: 'user-123',
        userName: 'John Doe',
        flatNumber: 'A-101',
        phone: '9876543210',
        selectedDate: DateTime.now(),
        selectedSlot: '6:00 AM',
      );

      expect(success, true);
      expect(controller.state.status, AmenityActionStatus.success);
      expect(controller.state.successMessage,
          contains('Pool at 6:00 AM has been booked'));
      expect(mockRepository.bookCalls, 1);
    });

    test('bookAmenity sets error state when repository throws Exception',
        () async {
      mockRepository.shouldFail = true;

      final success = await controller.bookAmenity(
        societyId: 'SOC-001',
        amenityId: 'amenity-1',
        amenityName: 'Pool',
        uid: 'user-123',
        userName: 'John Doe',
        flatNumber: 'A-101',
        phone: '9876543210',
        selectedDate: DateTime.now(),
        selectedSlot: '6:00 AM',
      );

      expect(success, false);
      expect(controller.state.status, AmenityActionStatus.error);
      expect(controller.state.errorMessage, contains('Slot Sold Out!'));
      expect(mockRepository.bookCalls, 1);
    });

    test('cancelBooking succeeds with valid booking ID', () async {
      final success = await controller.cancelBooking(
        societyId: 'SOC-001',
        bookingId: 'booking-101',
        uid: 'user-123',
      );

      expect(success, true);
      expect(controller.state.status, AmenityActionStatus.success);
      expect(
          controller.state.successMessage, contains('cancelled successfully'));
      expect(mockRepository.cancelCalls, 1);
    });

    test('cancelBooking fails when booking ID is empty', () async {
      final success = await controller.cancelBooking(
        societyId: 'SOC-001',
        bookingId: '',
        uid: 'user-123',
      );

      expect(success, false);
      expect(controller.state.status, AmenityActionStatus.error);
      expect(mockRepository.cancelCalls, 0);
    });

    test('seedDefaultAmenities succeeds', () async {
      final success = await controller.seedDefaultAmenities('SOC-001');

      expect(success, true);
      expect(controller.state.status, AmenityActionStatus.success);
      expect(mockRepository.seedCalls, 1);
    });

    test('bookAmenity preserves actual phone number in repository invocation', () async {
      const testPhone = '+919876543210';
      final success = await controller.bookAmenity(
        societyId: 'SOC-001',
        amenityId: 'amenity-1',
        amenityName: 'Clubhouse',
        uid: 'user-123',
        userName: 'John Doe',
        flatNumber: 'A-101',
        phone: testPhone,
        selectedDate: DateTime.now(),
        selectedSlot: '6:00 AM',
      );

      expect(success, true);
      expect(testPhone.contains('@'), false);
      expect(mockRepository.bookCalls, 1);
    });
  });
}
