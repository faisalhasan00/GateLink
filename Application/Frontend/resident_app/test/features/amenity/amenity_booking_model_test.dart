import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/amenity/domain/models/amenity_booking_model.dart';

void main() {
  group('AmenityBookingModel Unit Tests', () {
    test('AmenityBookingModel parses fromMap correctly', () {
      final map = {
        'amenityId': 'amenity-001',
        'amenityName': 'Clubhouse Hall',
        'bookedBy': 'user-123',
        'residentName': 'Alice Smith',
        'flatNumber': 'A-402',
        'phone': '9876543210',
        'date': '15/8/2026',
        'timeSlot': '6:00 PM',
        'guests': 4,
        'specialNotes': 'Birthday party',
        'status': 'approved',
        'approvalPolicy': 'auto',
        'societyId': 'SOC-001',
        'createdAt': '2026-08-14T10:00:00Z',
      };

      final model = AmenityBookingModel.fromMap(map, 'booking-101');

      expect(model.id, 'booking-101');
      expect(model.amenityId, 'amenity-001');
      expect(model.amenityName, 'Clubhouse Hall');
      expect(model.bookedBy, 'user-123');
      expect(model.residentName, 'Alice Smith');
      expect(model.flatNumber, 'A-402');
      expect(model.guests, 4);
      expect(model.isConfirmed, true);
      expect(model.isCancelled, false);
    });

    test('AmenityBookingModel identifies cancelled status correctly', () {
      final map = {
        'status': 'cancelled',
      };

      final model = AmenityBookingModel.fromMap(map, 'booking-102');

      expect(model.isConfirmed, false);
      expect(model.isCancelled, true);
    });
  });
}
