import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/visitor/domain/models/visitor_model.dart';

void main() {
  group('VisitorModel Unit Tests', () {
    test('VisitorModel parses correctly from map', () {
      final map = {
        'name': 'Rahul Sharma',
        'phone': '9876543210',
        'type': 'Delivery',
        'hostFlat': 'A-101',
        'vehicleNumber': 'MH02AB1234',
        'vehicleType': '2-Wheeler',
        'company': 'Amazon',
        'status': 'inside',
        'createdAt': '2026-08-14T02:00:00.000Z',
      };

      final visitor = VisitorModel.fromMap(map, 'vis_123');

      expect(visitor.id, equals('vis_123'));
      expect(visitor.name, equals('Rahul Sharma'));
      expect(visitor.type, equals('Delivery'));
      expect(visitor.hostFlat, equals('A-101'));
      expect(visitor.vehicleNumber, equals('MH02AB1234'));
      expect(visitor.status, equals('inside'));
    });

    test('VisitorModel toMap produces correct map structure', () {
      final visitor = VisitorModel(
        id: 'vis_101',
        name: 'Priya Singh',
        phone: '9123456789',
        type: 'Guest',
        hostFlat: 'B-402',
        status: 'pending',
        createdAt: DateTime(2026, 8, 14, 2, 0),
      );

      final map = visitor.toMap();

      expect(map['name'], equals('Priya Singh'));
      expect(map['phone'], equals('9123456789'));
      expect(map['type'], equals('Guest'));
      expect(map['hostFlat'], equals('B-402'));
      expect(map['status'], equals('pending'));
    });
  });
}
