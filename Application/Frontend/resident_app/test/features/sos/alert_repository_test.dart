import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/sos/domain/repositories/alert_repository.dart';

class MockAlertRepository implements AlertRepository {
  bool shouldFail = false;
  int triggerEmergencySosCalls = 0;

  @override
  Future<String> triggerEmergencySos({
    required String societyId,
    required String guardEmail,
    required String message,
  }) async {
    triggerEmergencySosCalls++;
    if (shouldFail) throw Exception('SOS trigger failure');
    return 'alert-123';
  }
}

void main() {
  late MockAlertRepository mockRepository;

  setUp(() {
    mockRepository = MockAlertRepository();
  });

  group('AlertRepository Unit Tests', () {
    test('triggerEmergencySos succeeds with valid inputs', () async {
      final docId = await mockRepository.triggerEmergencySos(
        societyId: 'SOC-001',
        guardEmail: 'guard@society.com',
        message: 'Emergency SOS triggered',
      );

      expect(docId, 'alert-123');
      expect(mockRepository.triggerEmergencySosCalls, 1);
    });

    test('triggerEmergencySos throws Exception on failure', () async {
      mockRepository.shouldFail = true;

      expect(
        () => mockRepository.triggerEmergencySos(
          societyId: 'SOC-001',
          guardEmail: 'guard@society.com',
          message: 'Emergency SOS triggered',
        ),
        throwsA(isA<Exception>()),
      );
    });
  });
}
