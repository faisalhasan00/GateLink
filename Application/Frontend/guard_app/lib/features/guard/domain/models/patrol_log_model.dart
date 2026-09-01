class PatrolLogModel {
  final String id;
  final String sessionId;
  final String checkpointId;
  final String checkpointCode;
  final String checkpointName;
  final String checkpointArea;
  final String guardUid;
  final String guardName;
  final DateTime scannedAt;
  final String status;
  final String? notes;

  const PatrolLogModel({
    required this.id,
    required this.sessionId,
    required this.checkpointId,
    required this.checkpointCode,
    required this.checkpointName,
    required this.checkpointArea,
    required this.guardUid,
    required this.guardName,
    required this.scannedAt,
    this.status = 'completed',
    this.notes,
  });

  factory PatrolLogModel.fromFirestore(Map<String, dynamic> json, String docId) {
    return PatrolLogModel(
      id: docId,
      sessionId: json['sessionId'] as String? ?? 'default_session',
      checkpointId: json['checkpointId'] as String? ?? '',
      checkpointCode: json['checkpointCode'] as String? ?? 'CP-01',
      checkpointName: json['checkpointName'] as String? ?? 'Checkpoint',
      checkpointArea: json['checkpointArea'] as String? ?? 'Perimeter',
      guardUid: json['guardUid'] as String? ?? '',
      guardName: json['guardName'] as String? ?? 'Security Guard',
      scannedAt: json['scannedAt'] != null
          ? DateTime.tryParse(json['scannedAt'] as String) ?? DateTime.now()
          : DateTime.now(),
      status: json['status'] as String? ?? 'completed',
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'sessionId': sessionId,
      'checkpointId': checkpointId,
      'checkpointCode': checkpointCode,
      'checkpointName': checkpointName,
      'checkpointArea': checkpointArea,
      'guardUid': guardUid,
      'guardName': guardName,
      'scannedAt': scannedAt.toIso8601String(),
      'status': status,
      if (notes != null) 'notes': notes,
    };
  }
}
