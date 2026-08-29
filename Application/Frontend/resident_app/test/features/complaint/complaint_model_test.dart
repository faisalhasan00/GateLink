import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/complaint/domain/models/complaint_model.dart';

void main() {
  group('ComplaintModel Unit Tests', () {
    test('ComplaintModel parses fromMap correctly', () {
      final map = {
        'id': 'cmp-101',
        'ticketNumber': '#CMP-101',
        'title': 'Water Leakage',
        'category': 'Plumbing',
        'description': 'Water leaking in bathroom ceiling',
        'status': 'In Progress',
        'raisedBy': 'user-101',
        'residentUid': 'user-101',
        'residentName': 'Jane Doe',
        'flatNumber': '101',
        'block': 'Tower A',
        'floor': '1st Floor',
        'priority': 'high',
        'photoUrl': 'https://example.com/photo.jpg',
        'assignedTo': 'Plumber Joe',
        'createdAt': '2026-08-14T00:00:00.000',
        'updatedAt': '2026-08-14T01:00:00.000',
      };

      final model = ComplaintModel.fromMap(map);

      expect(model.id, 'cmp-101');
      expect(model.ticketNumber, '#CMP-101');
      expect(model.title, 'Water Leakage');
      expect(model.category, 'Plumbing');
      expect(model.status, 'in progress');
      expect(model.raisedBy, 'user-101');
      expect(model.residentName, 'Jane Doe');
      expect(model.flatNumber, '101');
      expect(model.priority, 'high');
      expect(model.photoUrl, 'https://example.com/photo.jpg');
      expect(model.assignedTo, 'Plumber Joe');
      expect(model.isInProgress, true);
      expect(model.isResolved, false);
    });

    test('ComplaintModel handles default fallbacks', () {
      final model = ComplaintModel.fromMap({});

      expect(model.id, '');
      expect(model.title, 'Complaint');
      expect(model.category, 'General');
      expect(model.status, 'open');
      expect(model.priority, 'medium');
      expect(model.residentName, 'Resident');
      expect(model.isResolved, false);
    });

    test('ComplaintModel converts toMap correctly', () {
      const model = ComplaintModel(
        id: 'cmp-102',
        ticketNumber: '#CMP-102',
        title: 'Elevator Noise',
        category: 'Lift / Elevator',
        description: 'Noise on 3rd floor',
        status: 'Resolved',
        raisedBy: 'user-102',
        residentUid: 'user-102',
        residentName: 'John Smith',
        flatNumber: '302',
        block: 'Tower B',
        floor: '3rd Floor',
        priority: 'medium',
        createdAt: '2026-08-14T00:00:00.000',
        updatedAt: '2026-08-14T02:00:00.000',
      );

      final map = model.toMap();

      expect(map['id'], 'cmp-102');
      expect(map['title'], 'Elevator Noise');
      expect(map['status'], 'Resolved');
      expect(model.isResolved, true);
    });
  });
}
