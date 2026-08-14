import '../models/notification_model.dart';

abstract class NotificationRepository {
  Stream<List<NotificationModel>> watchNotifications(
      String societyId, String uid);
  Stream<int> watchUnreadCount(String societyId, String uid);
  Future<void> markNotificationAsRead(
      String societyId, String notificationId, String uid);
  Future<void> markAllNotificationsAsRead(String societyId, String uid);
  Future<void> deleteNotification(
      String societyId, String notificationId, String uid);
  Future<void> clearAllNotifications(String societyId, String uid);
}
