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
    final docRef = await _firestore.collection('societies/$societyId/alerts').add({
      'type': 'SOS',
      'guardEmail': guardEmail,
      'message': message,
      'createdAt': DateTime.now().toIso8601String(),
      'status': 'active',
    });
    return docRef.id;
  }
}
