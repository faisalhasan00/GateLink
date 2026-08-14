import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/complaint/domain/models/complaint_model.dart';
import 'package:societysphere/features/complaint/domain/repositories/complaint_repository.dart';
import 'package:societysphere/features/complaint/presentation/controllers/complaint_controller.dart';
import 'package:societysphere/features/complaint/presentation/controllers/complaint_state.dart';

class MockComplaintRepository implements ComplaintRepository {
  bool shouldFail = false;
  int raiseCalls = 0;

  @override
  Stream<List<ComplaintModel>> watchMyComplaints(
      String societyId, String residentUid) {
    return Stream.value([]);
  }

  @override
  Stream<ComplaintModel?> watchComplaintDetail(
      String societyId, String complaintId) {
    return Stream.value(null);
  }

  @override
  Future<String> raiseComplaint({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String title,
    required String description,
    required String category,
    required String block,
    required String floor,
    required String priority,
    String? photoUrl,
  }) async {
    raiseCalls++;
    if (shouldFail) throw Exception('Failed to raise complaint');
    return 'cmp-doc-123';
  }
}

void main() {
  late MockComplaintRepository mockRepository;
  late ComplaintController controller;

  setUp(() {
    mockRepository = MockComplaintRepository();
    controller = ComplaintController(mockRepository);
  });

  group('ComplaintController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, ComplaintActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
    });

    test('raiseComplaint fails validation if title is empty', () async {
      final success = await controller.raiseComplaint(
        societyId: 'SOC-001',
        residentUid: 'user-101',
        residentName: 'Jane Doe',
        flatNumber: '101',
        title: '',
        description: 'Bathroom pipe issue',
        category: 'Plumbing',
        block: 'Tower A',
        floor: '1st Floor',
        priority: 'medium',
      );

      expect(success, false);
      expect(controller.state.status, ComplaintActionStatus.error);
      expect(controller.state.errorMessage, contains('title is required'));
      expect(mockRepository.raiseCalls, 0);
    });

    test('raiseComplaint fails validation if category is empty', () async {
      final success = await controller.raiseComplaint(
        societyId: 'SOC-001',
        residentUid: 'user-101',
        residentName: 'Jane Doe',
        flatNumber: '101',
        title: 'Pipe Leakage',
        description: 'Bathroom pipe issue',
        category: '',
        block: 'Tower A',
        floor: '1st Floor',
        priority: 'medium',
      );

      expect(success, false);
      expect(controller.state.status, ComplaintActionStatus.error);
      expect(controller.state.errorMessage,
          contains('select a complaint category'));
      expect(mockRepository.raiseCalls, 0);
    });

    test('raiseComplaint succeeds with valid input', () async {
      final success = await controller.raiseComplaint(
        societyId: 'SOC-001',
        residentUid: 'user-101',
        residentName: 'Jane Doe',
        flatNumber: '101',
        title: 'Pipe Leakage',
        description: 'Bathroom pipe issue',
        category: 'Plumbing',
        block: 'Tower A',
        floor: '1st Floor',
        priority: 'medium',
      );

      expect(success, true);
      expect(controller.state.status, ComplaintActionStatus.success);
      expect(controller.state.raisedComplaintId, 'cmp-doc-123');
      expect(mockRepository.raiseCalls, 1);
    });

    test('raiseComplaint sets error state on repository failure', () async {
      mockRepository.shouldFail = true;

      final success = await controller.raiseComplaint(
        societyId: 'SOC-001',
        residentUid: 'user-101',
        residentName: 'Jane Doe',
        flatNumber: '101',
        title: 'Pipe Leakage',
        description: 'Bathroom pipe issue',
        category: 'Plumbing',
        block: 'Tower A',
        floor: '1st Floor',
        priority: 'medium',
      );

      expect(success, false);
      expect(controller.state.status, ComplaintActionStatus.error);
      expect(mockRepository.raiseCalls, 1);
    });
  });
}
