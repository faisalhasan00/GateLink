import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/profile/domain/models/session_model.dart';
import 'package:societysphere/features/profile/domain/repositories/session_repository.dart';
import 'package:societysphere/features/profile/presentation/controllers/session_controller.dart';
import 'package:societysphere/features/profile/presentation/controllers/session_state.dart';

class MockSessionRepository implements SessionRepository {
  bool shouldFail = false;
  int revokeCalls = 0;
  int revokeAllCalls = 0;

  @override
  Stream<List<SessionModel>> watchUserSessions(String userId) {
    return Stream.value([]);
  }

  @override
  Future<void> revokeSession({
    required String userId,
    required String sessionId,
  }) async {
    revokeCalls++;
    if (shouldFail) throw Exception('Failed to revoke session');
  }

  @override
  Future<void> revokeAllOtherSessions({
    required String userId,
    required String currentSessionId,
  }) async {
    revokeAllCalls++;
    if (shouldFail) throw Exception('Failed to revoke all sessions');
  }
}

void main() {
  late MockSessionRepository mockRepository;
  late SessionController controller;

  setUp(() {
    mockRepository = MockSessionRepository();
    controller = SessionController(mockRepository);
  });

  group('SessionController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, SessionActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
      expect(controller.state.successMessage, isNull);
    });

    test('revokeSession succeeds with valid inputs', () async {
      final success = await controller.revokeSession(
        userId: 'user-100',
        sessionId: 'sess-001',
      );

      expect(success, true);
      expect(controller.state.status, SessionActionStatus.success);
      expect(mockRepository.revokeCalls, 1);
    });

    test('revokeSession fails when userId is empty', () async {
      final success = await controller.revokeSession(
        userId: '',
        sessionId: 'sess-001',
      );

      expect(success, false);
      expect(controller.state.status, SessionActionStatus.error);
      expect(mockRepository.revokeCalls, 0);
    });

    test('revokeAllOtherSessions succeeds', () async {
      final success = await controller.revokeAllOtherSessions(
        userId: 'user-100',
        currentSessionId: 'sess-current',
      );

      expect(success, true);
      expect(controller.state.status, SessionActionStatus.success);
      expect(mockRepository.revokeAllCalls, 1);
    });

    test('controller sets error state on repository failure', () async {
      mockRepository.shouldFail = true;

      final success = await controller.revokeSession(
        userId: 'user-100',
        sessionId: 'sess-001',
      );

      expect(success, false);
      expect(controller.state.status, SessionActionStatus.error);
      expect(
          controller.state.errorMessage, contains('Failed to revoke session'));
    });
  });
}
