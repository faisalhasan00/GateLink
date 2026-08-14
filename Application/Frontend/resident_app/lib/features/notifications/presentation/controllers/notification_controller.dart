import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/notification_repository.dart';
import 'notification_state.dart';

class NotificationController extends StateNotifier<NotificationState> {
  final NotificationRepository _repository;

  NotificationController(this._repository) : super(NotificationState.initial());

  void resetState() {
    state = NotificationState.initial();
  }

  Future<bool> markNotificationAsRead({
    required String societyId,
    required String notificationId,
    required String uid,
  }) async {
    if (state.isLoading) return false;

    if (notificationId.isEmpty || uid.isEmpty) {
      state = state.copyWith(
        status: NotificationActionStatus.error,
        errorMessage: 'Invalid notification parameters.',
      );
      return false;
    }

    try {
      await _repository.markNotificationAsRead(societyId, notificationId, uid);
      state = state.copyWith(
        status: NotificationActionStatus.success,
        successMessage: 'Notification marked as read.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: NotificationActionStatus.error,
        errorMessage: 'Failed to mark notification as read.',
      );
      return false;
    }
  }

  Future<bool> markAllNotificationsAsRead({
    required String societyId,
    required String uid,
  }) async {
    if (state.isLoading) return false;

    if (uid.isEmpty) {
      state = state.copyWith(
        status: NotificationActionStatus.error,
        errorMessage: 'User session expired. Please log in again.',
      );
      return false;
    }

    state = state.copyWith(status: NotificationActionStatus.loading);

    try {
      await _repository.markAllNotificationsAsRead(societyId, uid);
      state = state.copyWith(
        status: NotificationActionStatus.success,
        successMessage: 'All notifications marked as read.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: NotificationActionStatus.error,
        errorMessage: 'Failed to mark all notifications as read.',
      );
      return false;
    }
  }

  Future<bool> deleteNotification({
    required String societyId,
    required String notificationId,
    required String uid,
  }) async {
    if (state.isLoading) return false;

    if (notificationId.isEmpty || uid.isEmpty) {
      state = state.copyWith(
        status: NotificationActionStatus.error,
        errorMessage: 'Invalid notification parameters.',
      );
      return false;
    }

    try {
      await _repository.deleteNotification(societyId, notificationId, uid);
      state = state.copyWith(
        status: NotificationActionStatus.success,
        successMessage: 'Notification deleted.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: NotificationActionStatus.error,
        errorMessage: 'Failed to delete notification.',
      );
      return false;
    }
  }

  Future<bool> clearAllNotifications({
    required String societyId,
    required String uid,
  }) async {
    if (state.isLoading) return false;

    if (uid.isEmpty) {
      state = state.copyWith(
        status: NotificationActionStatus.error,
        errorMessage: 'User session expired. Please log in again.',
      );
      return false;
    }

    state = state.copyWith(status: NotificationActionStatus.loading);

    try {
      await _repository.clearAllNotifications(societyId, uid);
      state = state.copyWith(
        status: NotificationActionStatus.success,
        successMessage: 'All notifications cleared.',
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        status: NotificationActionStatus.error,
        errorMessage: 'Failed to clear all notifications.',
      );
      return false;
    }
  }
}
