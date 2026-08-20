import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Handles Resident In-App Notifications, Badges, and Read States.
class UserNotificationService {
  final FirebaseFirestore _db;
  final String societyId;

  UserNotificationService({
    required this.societyId,
    FirebaseFirestore? db,
  }) : _db = db ?? FirebaseFirestore.instance;

  Stream<QuerySnapshot> notificationsStream(String uid) {
    return _db
        .collection('societies/$societyId/users/$uid/notifications')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  Stream<int> unreadNotificationsCountStream(String uid) {
    return _db
        .collection('societies/$societyId/users/$uid/notifications')
        .where('read', isEqualTo: false)
        .snapshots()
        .map((snap) => snap.docs.length);
  }

  Future<void> markNotificationAsRead(String notifId, String uid) async {
    await _db
        .collection('societies/$societyId/users/$uid/notifications')
        .doc(notifId)
        .update({'read': true});
  }

  Future<void> markAllNotificationsAsRead(String uid) async {
    final unreadSnap = await _db
        .collection('societies/$societyId/users/$uid/notifications')
        .where('read', isEqualTo: false)
        .get();

    final batch = _db.batch();
    for (final doc in unreadSnap.docs) {
      batch.update(doc.reference, {'read': true});
    }
    await batch.commit();
  }

  Future<void> updateNotificationPreferences(
      String uid, Map<String, bool> prefs) async {
    await _db
        .collection('societies/$societyId/users')
        .doc(uid)
        .set({'notificationPreferences': prefs}, SetOptions(merge: true));
  }

  Future<void> deleteNotification(String notifId, String uid) async {
    await _db
        .collection('societies/$societyId/users/$uid/notifications')
        .doc(notifId)
        .delete();
  }

  Future<void> clearAllNotifications(String uid) async {
    final snap = await _db
        .collection('societies/$societyId/users/$uid/notifications')
        .get();

    final batch = _db.batch();
    for (final doc in snap.docs) {
      batch.delete(doc.reference);
    }
    await batch.commit();
  }
}
