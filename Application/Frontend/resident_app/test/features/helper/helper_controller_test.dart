import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/helper/domain/models/helper_log_model.dart';
import 'package:societysphere/features/helper/domain/models/helper_model.dart';
import 'package:societysphere/features/helper/domain/repositories/helper_repository.dart';
import 'package:societysphere/features/helper/presentation/controllers/helper_controller.dart';
import 'package:societysphere/features/helper/presentation/controllers/helper_state.dart';

import 'package:societysphere/features/helper/domain/models/helper_attendance_day.dart';
import 'package:societysphere/features/helper/domain/models/helper_salary_record.dart';

class MockHelperRepository implements HelperRepository {
  bool shouldFail = false;
  int registerCalls = 0;

  @override
  Stream<List<HelperModel>> watchMyHelpers(
      String societyId, String residentUid) {
    return Stream.value([]);
  }

  @override
  Stream<List<HelperLogModel>> watchTodayHelperLogs(String societyId) {
    return Stream.value([]);
  }

  @override
  Future<List<HelperAttendanceDay>> getMonthlyAttendance(
      String societyId, String helperId, int year, int month) async {
    return [
      HelperAttendanceDay(date: DateTime(year, month, 1), isPresent: true),
      HelperAttendanceDay(date: DateTime(year, month, 2), isPresent: false),
    ];
  }

  @override
  Future<HelperSalaryRecord?> getSalaryRecord(
      String societyId, String helperId, String yearMonth) async {
    return null;
  }

  @override
  Future<void> saveSalaryRecord(
      String societyId, String helperId, HelperSalaryRecord record) async {}

  @override
  Future<void> updateHelperSalaryConfig(
      String societyId, String helperId, double monthlySalary, String salaryCalculationType) async {}

  @override
  Future<void> registerHelper({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String name,
    required String phone,
    required String type,
    required String govtIdType,
    required String govtIdNumber,
    required String workingDays,
    required String emergencyContact,
  }) async {
    registerCalls++;
    if (shouldFail) throw Exception('Failed to register helper');
  }

  @override
  Future<void> updateHelperStatus({
    required String societyId,
    required String helperId,
    required String status,
  }) async {
    if (shouldFail) throw Exception('Failed to update helper status');
  }

  @override
  Future<void> deleteHelper({
    required String societyId,
    required String helperId,
  }) async {
    if (shouldFail) throw Exception('Failed to delete helper');
  }
}

void main() {
  late MockHelperRepository mockRepository;
  late HelperController controller;

  setUp(() {
    mockRepository = MockHelperRepository();
    controller = HelperController(mockRepository);
  });

  group('HelperController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, HelperActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
    });

    test('registerHelper fails validation if name is empty', () async {
      final success = await controller.registerHelper(
        societyId: 'SOC-001',
        residentUid: 'user-101',
        residentName: 'Jane Doe',
        flatNumber: '101',
        name: '',
        phone: '9876543210',
        type: 'Maid',
        govtIdType: 'Aadhaar Card',
        govtIdNumber: '1234',
        workingDays: 'Mon - Sat',
        emergencyContact: '9123456789',
      );

      expect(success, false);
      expect(controller.state.status, HelperActionStatus.error);
      expect(controller.state.errorMessage, contains('name is required'));
      expect(mockRepository.registerCalls, 0);
    });

    test('registerHelper fails validation if phone is empty', () async {
      final success = await controller.registerHelper(
        societyId: 'SOC-001',
        residentUid: 'user-101',
        residentName: 'Jane Doe',
        flatNumber: '101',
        name: 'Sunita Sharma',
        phone: '',
        type: 'Maid',
        govtIdType: 'Aadhaar Card',
        govtIdNumber: '1234',
        workingDays: 'Mon - Sat',
        emergencyContact: '9123456789',
      );

      expect(success, false);
      expect(controller.state.status, HelperActionStatus.error);
      expect(controller.state.errorMessage, contains('phone is required'));
      expect(mockRepository.registerCalls, 0);
    });

    test('registerHelper succeeds with valid input', () async {
      final success = await controller.registerHelper(
        societyId: 'SOC-001',
        residentUid: 'user-101',
        residentName: 'Jane Doe',
        flatNumber: '101',
        name: 'Sunita Sharma',
        phone: '9876543210',
        type: 'Maid',
        govtIdType: 'Aadhaar Card',
        govtIdNumber: '1234-5678-9012',
        workingDays: 'Mon - Sat',
        emergencyContact: '9123456789',
      );

      expect(success, true);
      expect(controller.state.status, HelperActionStatus.success);
      expect(mockRepository.registerCalls, 1);
    });

    test('registerHelper sets error state on repository failure', () async {
      mockRepository.shouldFail = true;

      final success = await controller.registerHelper(
        societyId: 'SOC-001',
        residentUid: 'user-101',
        residentName: 'Jane Doe',
        flatNumber: '101',
        name: 'Sunita Sharma',
        phone: '9876543210',
        type: 'Maid',
        govtIdType: 'Aadhaar Card',
        govtIdNumber: '1234-5678-9012',
        workingDays: 'Mon - Sat',
        emergencyContact: '9123456789',
      );

      expect(success, false);
      expect(controller.state.status, HelperActionStatus.error);
      expect(mockRepository.registerCalls, 1);
    });
  });
}
