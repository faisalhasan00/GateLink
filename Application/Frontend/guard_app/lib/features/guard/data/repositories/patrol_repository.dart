import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/patrol_checkpoint_model.dart';
import '../../domain/models/patrol_log_model.dart';
import '../../domain/models/patrol_incident_model.dart';

class PatrolRepository {
  final FirebaseFirestore _firestore;

  PatrolRepository({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  /// Stream active checkpoints for a society ordered by patrol sequence
  Stream<List<PatrolCheckpointModel>> streamCheckpoints(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);
    return _firestore
        .collection('societies/$societyId/patrol_checkpoints')
        .where('isActive', isEqualTo: true)
        .orderBy('order')
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => PatrolCheckpointModel.fromFirestore(d.data(), d.id))
            .toList());
  }

  /// Record a verified QR checkpoint scan
  Future<void> recordCheckpointScan({
    required String societyId,
    required String checkpointId,
    required String checkpointCode,
    required String checkpointName,
    required String checkpointArea,
    required String guardUid,
    required String guardName,
    String? sessionId,
    String? notes,
  }) async {
    if (societyId.isEmpty || checkpointId.isEmpty) {
      throw ArgumentError('Society ID and Checkpoint ID are required');
    }

    final now = DateTime.now();
    final logRef = _firestore.collection('societies/$societyId/patrol_logs').doc();

    final log = PatrolLogModel(
      id: logRef.id,
      sessionId: sessionId ?? 'patrol_${now.year}_${now.month}_${now.day}',
      checkpointId: checkpointId,
      checkpointCode: checkpointCode,
      checkpointName: checkpointName,
      checkpointArea: checkpointArea,
      guardUid: guardUid,
      guardName: guardName,
      scannedAt: now,
      notes: notes,
    );

    // Write log and update checkpoint lastScannedAt in batch
    final batch = _firestore.batch();
    batch.set(logRef, log.toMap());

    final checkpointRef = _firestore.doc('societies/$societyId/patrol_checkpoints/$checkpointId');
    batch.update(checkpointRef, {
      'lastScannedAt': now.toIso8601String(),
      'lastScannedGuard': guardUid,
      'lastScannedGuardName': guardName,
    });

    await batch.commit();
  }

  /// Stream today's patrol logs for compliance check
  Stream<List<PatrolLogModel>> streamTodayPatrolLogs(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);
    final now = DateTime.now();
    final startOfDay = DateTime(now.year, now.month, now.day).toIso8601String();

    return _firestore
        .collection('societies/$societyId/patrol_logs')
        .where('scannedAt', isGreaterThanOrEqualTo: startOfDay)
        .orderBy('scannedAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => PatrolLogModel.fromFirestore(d.data(), d.id))
            .toList());
  }

  /// Report a patrol incident
  Future<void> reportIncident({
    required String societyId,
    String? checkpointId,
    String? checkpointCode,
    String? checkpointName,
    required String guardUid,
    required String guardName,
    required String category,
    required String severity,
    required String description,
    String? photoUrl,
  }) async {
    if (societyId.isEmpty) throw ArgumentError('Society ID is required');

    final incidentRef = _firestore.collection('societies/$societyId/patrol_incidents').doc();
    final incident = PatrolIncidentModel(
      id: incidentRef.id,
      checkpointId: checkpointId,
      checkpointCode: checkpointCode,
      checkpointName: checkpointName,
      guardUid: guardUid,
      guardName: guardName,
      category: category,
      severity: severity,
      description: description,
      photoUrl: photoUrl,
      status: 'open',
      createdAt: DateTime.now(),
    );

    await incidentRef.set(incident.toMap());
  }
}
