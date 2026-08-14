import 'package:flutter_test/flutter_test.dart';
import 'package:societysphere/features/notifications/domain/models/notification_model.dart';
import 'package:societysphere/features/notifications/domain/repositories/notification_repository.dart';
import 'package:societysphere/features/notifications/presentation/controllers/notification_controller.dart';
import 'package:societysphere/features/notifications/presentation/controllers/notification_state.dart';

class MockNotificationRepository implements NotificationRepository {
  bool shouldFail = false;
  int markReadCalls = 0;
  int markAllReadCalls = 0;
  int deleteCalls = 0;
  int clearAllCalls = 0;

  @override
  Stream<List<NotificationModel>> watchNotifications(
      String societyId, String uid) {
    return Stream.value([]);
  }

  @override
  Stream<int> watchUnreadCount(String societyId, String uid) {
    return Stream.value(0);
  }

  @override
  Future<void> markNotificationAsRead(
      String societyId, String notificationId, String uid) async {
    markReadCalls++;
    if (shouldFail) throw Exception('Failed to mark read');
  }

  @override
  Future<void> markAllNotificationsAsRead(String societyId, String uid) async {
    markAllReadCalls++;
    if (shouldFail) throw Exception('Failed to mark all read');
  }

  @override
  Future<void> deleteNotification(
      String societyId, String notificationId, String uid) async {
    deleteCalls++;
    if (shouldFail) throw Exception('Failed to delete notification');
  }

  @override
  Future<void> clearAllNotifications(String societyId, String uid) async {
    clearAllCalls++;
    if (shouldFail) throw Exception('Failed to clear notifications');
  }
}

void main() {
  late MockNotificationRepository mockRepository;
  late NotificationController controller;

  setUp(() {
    mockRepository = MockNotificationRepository();
    controller = NotificationController(mockRepository);
  });

  group('NotificationController Unit Tests', () {
    test('initial state is correct', () {
      expect(controller.state.status, NotificationActionStatus.initial);
      expect(controller.state.errorMessage, isNull);
      expect(controller.state.successMessage, isNull);
    });

    test('markNotificationAsRead succeeds with valid inputs', () async {
      final success = await controller.markNotificationAsRead(
        societyId: 'SOC-001',
        notificationId: 'notif-1',
        uid: 'user-123',
      );

      expect(success, true);
      expect(controller.state.status, NotificationActionStatus.success);
      expect(mockRepository.markReadCalls, 1);
    });

    test('markNotificationAsRead fails when notificationId is empty', () async {
      final success = await controller.markNotificationAsRead(
        societyId: 'SOC-001',
        notificationId: '',
        uid: 'user-123',
      );

      expect(success, false);
      expect(controller.state.status, NotificationActionStatus.error);
      expect(mockRepository.markReadCalls, 0);
    });

    test('markAllNotificationsAsRead succeeds', () async {
      final success = await controller.markAllNotificationsAsRead(
        societyId: 'SOC-001',
        uid: 'user-123',
      );

      expect(success, true);
      expect(controller.state.status, NotificationActionStatus.success);
      expect(mockRepository.markAllReadCalls, 1);
    });

    test('deleteNotification succeeds', () async {
      final success = await controller.deleteNotification(
        societyId: 'SOC-001',
        notificationId: 'notif-1',
        uid: 'user-123',
      );

      expect(success, true);
      expect(controller.state.status, NotificationActionStatus.success);
      expect(mockRepository.deleteCalls, 1);
    });

    test('clearAllNotifications succeeds', () async {
      final success = await controller.clearAllNotifications(
        societyId: 'SOC-001',
        uid: 'user-123',
      );

      expect(success, true);
      expect(controller.state.status, NotificationActionStatus.success);
      expect(mockRepository.clearAllCalls, 1);
    });

    test('controller sets error state when repository throws Exception',
        () async {
      mockRepository.shouldFail = true;

      final success = await controller.markNotificationAsRead(
        societyId: 'SOC-001',
        notificationId: 'notif-1',
        uid: 'user-123',
      );

      expect(success, false);
      expect(controller.state.status, NotificationActionStatus.error);
      expect(controller.state.errorMessage,
          contains('Failed to mark notification as read'));
      expect(mockRepository.markReadCalls, 1);
    });
  });
}
