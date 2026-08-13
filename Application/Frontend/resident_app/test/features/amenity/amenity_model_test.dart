import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/amenity/domain/models/amenity_model.dart';

void main() {
  group('AmenityModel Unit Tests', () {
    test('AmenityModel parses fromMap correctly', () {
      final map = {
        'name': 'Swimming Pool',
        'iconKey': 'pool',
        'timing': '6:00 AM - 9:00 PM',
        'available': true,
        'status': 'Available',
        'fee': 'Free',
        'location': 'Clubhouse Level 1',
        'availableSlots': 15,
        'capacity': 20,
      };

      final model = AmenityModel.fromMap(map, 'amenity-001');

      expect(model.id, 'amenity-001');
      expect(model.name, 'Swimming Pool');
      expect(model.iconKey, 'pool');
      expect(model.timing, '6:00 AM - 9:00 PM');
      expect(model.available, true);
      expect(model.fee, 'Free');
      expect(model.location, 'Clubhouse Level 1');
      expect(model.availableSlots, 15);
      expect(model.capacity, 20);
    });

    test('AmenityModel handles default fallback values', () {
      final map = <String, dynamic>{};

      final model = AmenityModel.fromMap(map, 'amenity-002');

      expect(model.id, 'amenity-002');
      expect(model.name, 'Amenity');
      expect(model.iconKey, 'pool');
      expect(model.fee, 'Free');
      expect(model.capacity, 10);
    });

    test('AmenityModel converts toMap correctly', () {
      const model = AmenityModel(
        id: 'amenity-001',
        name: 'Tennis Court',
        iconKey: 'tennis',
        timing: '6:00 AM - 8:00 PM',
        fee: 'Free',
        capacity: 8,
      );

      final map = model.toMap();

      expect(map['name'], 'Tennis Court');
      expect(map['iconKey'], 'tennis');
      expect(map['capacity'], 8);
    });
  });
}
