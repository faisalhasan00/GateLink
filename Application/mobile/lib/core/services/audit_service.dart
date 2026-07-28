import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuditService {
  final String societyId;

  AuditService({this.societyId = 'SOC-001'});

  Future<void> logAction({
    required String action,
    required String module,
    required String resourceId,
    String? details,
    Map<String, dynamic>? oldValues,
    Map<String, dynamic>? newValues,
  }) async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      final timestamp = DateTime.now().toIso8601String();

      await FirebaseFirestore.instance
          .collection('societies/$societyId/audit_logs')
          .add({
        'action': action,
        'module': module,
        'resourceId': resourceId,
        'details': details ?? '',
        'userUid': user?.uid ?? 'system',
        'userEmail': user?.email ?? 'anonymous',
        'oldValues': oldValues ?? {},
        'newValues': newValues ?? {},
        'timestamp': timestamp,
        'createdAt': timestamp,
      });
    } catch (e) {
      // Silent error catching to prevent breaking core user flow
      print('AuditLog error: $e');
    }
  }
}
