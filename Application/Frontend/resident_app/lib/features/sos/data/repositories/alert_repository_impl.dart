import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/repositories/alert_repository.dart';

class AlertRepositoryImpl implements AlertRepository {
  final FirebaseFirestore _firestore;

  AlertRepositoryImpl(this._firestore);

  @override
  Future<String> triggerEmergencySos({
    required String societyId,
    required String guardEmail,
    required String message,
  }) async {
    final docRef =
        await _firestore.collection('societies/$societyId/alerts').add({
      'type': 'SOS',
      'guardEmail': guardEmail,
      'message': message,
      'createdAt': DateTime.now().toIso8601String(),
      'status': 'active',
    });
    return docRef.id;
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
    final timestampStr = DateTime.now().toIso8601String();

    await _firestore.collection('societies/$societyId/sos_alerts').add({
      'residentUid': residentUid,
      'residentName': residentName,
      'flatNumber': flatNumber,
      'phone': phone,
      'type': type,
      'status': 'Triggered',
      'notes': notes,
      'createdAt': timestampStr,
      'timestamp': timestampStr,
    });

    await _firestore.collection('societies/$societyId/notifications').add({
      'title': '🚨 EMERGENCY SOS TRIGGERED: $type',
      'body':
          'Emergency SOS triggered by $residentName (Flat $flatNumber). Type: $type. Immediate assistance required!',
      'createdAt': timestampStr,
      'isRead': false,
      'type': 'sos',
    });
  }
}
