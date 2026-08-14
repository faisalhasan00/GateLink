import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/parking/domain/models/parking_slot_model.dart';

void main() {
  group('ParkingSlotModel Unit Tests', () {
    test('ParkingSlotModel parses fromMap correctly', () {
      final map = {
        'id': 'slot-101',
        'slot': 'P-12',
        'level': 'Basement 1',
        'number': 'MH 12 AB 1234',
        'type': 'Car',
        'model': 'Honda City',
        'color': 'Silver',
        'status': 'Active',
        'assignedTo': 'user-101',
        'societyId': 'SOC-001',
      };

      final model = ParkingSlotModel.fromMap(map);

      expect(model.id, 'slot-101');
      expect(model.slot, 'P-12');
      expect(model.level, 'Basement 1');
      expect(model.number, 'MH 12 AB 1234');
      expect(model.type, 'Car');
      expect(model.model, 'Honda City');
      expect(model.color, 'Silver');
      expect(model.status, 'Active');
      expect(model.assignedTo, 'user-101');
      expect(model.societyId, 'SOC-001');
    });

    test(
        'ParkingSlotModel handles fallback defaults when map fields are missing',
        () {
      final model = ParkingSlotModel.fromMap({});

      expect(model.id, '');
      expect(model.slot, 'Unknown Slot');
      expect(model.level, 'Level 1');
      expect(model.number, 'XX 00 XX 0000');
      expect(model.type, 'Car');
      expect(model.model, 'Unknown Model');
      expect(model.color, 'Color');
      expect(model.status, 'Active');
    });

    test('ParkingSlotModel converts toMap correctly', () {
      const model = ParkingSlotModel(
        id: 'slot-101',
        slot: 'P-12',
        level: 'Basement 1',
        number: 'MH 12 AB 1234',
        type: 'Car',
        model: 'Honda City',
        color: 'Silver',
        status: 'Active',
        assignedTo: 'user-101',
        societyId: 'SOC-001',
      );

      final map = model.toMap();

      expect(map['id'], 'slot-101');
      expect(map['slot'], 'P-12');
      expect(map['level'], 'Basement 1');
      expect(map['number'], 'MH 12 AB 1234');
      expect(map['type'], 'Car');
    });
  });
}
