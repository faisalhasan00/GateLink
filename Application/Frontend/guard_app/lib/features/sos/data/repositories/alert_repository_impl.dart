import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/guard_alert_model.dart';
import '../../domain/repositories/alert_repository.dart';

class AlertRepositoryImpl implements AlertRepository {
  final FirebaseFirestore _firestore;

  AlertRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Future<void> broadcastSosAlert(String societyId, GuardAlertModel alert) async {
    if (societyId.isEmpty) throw ArgumentError('Society ID is required');
    await _firestore.collection('societies/$societyId/sos_alerts').add(alert.toMap());
  }

  @override
  Future<void> sendSosNotification(String societyId, {required String title, required String body}) async {
    if (societyId.isEmpty) throw ArgumentError('Society ID is required');
    await _firestore.collection('societies/$societyId/notifications').add({
      'title': title,
      'body': body,
      'createdAt': DateTime.now().toIso8601String(),
      'isRead': false,
      'type': 'sos',
    });
  }
}
