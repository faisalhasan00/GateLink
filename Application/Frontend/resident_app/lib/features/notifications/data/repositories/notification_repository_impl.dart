import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/notification_model.dart';
import '../../domain/repositories/notification_repository.dart';

class NotificationRepositoryImpl implements NotificationRepository {
  final FirebaseFirestore _firestore;

  NotificationRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<NotificationModel>> watchNotifications(String societyId, String uid) {
    return _firestore
        .collection('societies/$societyId/users/$uid/notifications')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => NotificationModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  @override
  Stream<int> watchUnreadCount(String societyId, String uid) {
    return _firestore
        .collection('societies/$societyId/users/$uid/notifications')
        .where('read', isEqualTo: false)
        .snapshots()
        .map((snapshot) => snapshot.docs.length);
  }

  @override
  Future<void> markNotificationAsRead(
      String societyId, String notificationId, String uid) async {
    await _firestore
        .collection('societies/$societyId/users/$uid/notifications')
        .doc(notificationId)
        .update({'read': true});
  }

  @override
  Future<void> markAllNotificationsAsRead(String societyId, String uid) async {
    final unreadSnap = await _firestore
        .collection('societies/$societyId/users/$uid/notifications')
        .where('read', isEqualTo: false)
        .get();

    final batch = _firestore.batch();
    for (final doc in unreadSnap.docs) {
      batch.update(doc.reference, {'read': true});
    }
    await batch.commit();
  }

  @override
  Future<void> deleteNotification(
      String societyId, String notificationId, String uid) async {
    await _firestore
        .collection('societies/$societyId/users/$uid/notifications')
        .doc(notificationId)
        .delete();
  }

  @override
  Future<void> clearAllNotifications(String societyId, String uid) async {
    final snap = await _firestore
        .collection('societies/$societyId/users/$uid/notifications')
        .get();

    final batch = _firestore.batch();
    for (final doc in snap.docs) {
      batch.delete(doc.reference);
    }
    await batch.commit();
  }
}
