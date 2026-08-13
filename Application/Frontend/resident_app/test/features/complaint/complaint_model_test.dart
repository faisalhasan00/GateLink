import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/complaint/domain/models/complaint_model.dart';

void main() {
  group('ComplaintModel Unit Tests', () {
    test('ComplaintModel instantiates correctly', () {
      const complaint = ComplaintModel(
        id: 'comp-101',
        title: 'Water Leakage',
        category: 'Plumbing',
        description: 'Leakage in bathroom ceiling',
        status: 'In Progress',
        residentName: 'John Resident',
        flatNumber: 'A-101',
        createdAt: '2026-08-14T00:00:00Z',
      );

      expect(complaint.id, 'comp-101');
      expect(complaint.title, 'Water Leakage');
      expect(complaint.category, 'Plumbing');
      expect(complaint.status, 'In Progress');
    });
  });
}
