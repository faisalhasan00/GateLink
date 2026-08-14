import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/sos/domain/repositories/alert_repository.dart';
import 'package:societysphere/features/sos/presentation/controllers/alert_controller.dart';
import 'package:societysphere/features/sos/presentation/controllers/alert_state.dart';

class MockAlertRepository implements AlertRepository {
  bool shouldFail = false;
  int broadcastCalls = 0;

  @override
  Future<String> triggerEmergencySos({
    required String societyId,
    required String guardEmail,
    required String message,
  }) async {
    return 'alert-123';
  }

  @override
  Future<void> broadcastSosAlert({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String phone,
    required String type,
    required String notes,
  }) async {
    broadcastCalls++;
    if (shouldFail) throw Exception('Failed to broadcast SOS alert');
  }
}

void main() {
  late MockAlertRepository mockRepository;
  late AlertController controller;

  setUp(() {
    mockRepository = MockAlertRepository();
    controller = AlertController(mockRepository);
  });

  group('AlertController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, AlertActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
      expect(controller.state.successMessage, isNull);
    });

    test('broadcastSosAlert succeeds with valid inputs', () async {
      final success = await controller.broadcastSosAlert(
        societyId: 'SOC-001',
        residentUid: 'user-100',
        residentName: 'Jane Doe',
        flatNumber: 'B-302',
        phone: '9876543210',
        type: 'Medical',
        notes: 'Need ambulance',
      );

      expect(success, true);
      expect(controller.state.status, AlertActionStatus.success);
      expect(mockRepository.broadcastCalls, 1);
    });

    test('broadcastSosAlert handles repository exception gracefully', () async {
      mockRepository.shouldFail = true;

      final success = await controller.broadcastSosAlert(
        societyId: 'SOC-001',
        residentUid: 'user-100',
        residentName: 'Jane Doe',
        flatNumber: 'B-302',
        phone: '9876543210',
        type: 'Medical',
        notes: 'Need ambulance',
      );

      expect(success, false);
      expect(controller.state.status, AlertActionStatus.error);
      expect(controller.state.errorMessage,
          contains('Failed to broadcast SOS alert'));
    });
  });
}
