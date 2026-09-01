class PatrolIncidentModel {
  final String id;
  final String? checkpointId;
  final String? checkpointCode;
  final String? checkpointName;
  final String guardUid;
  final String guardName;
  final String category;
  final String severity; // 'low' | 'medium' | 'critical'
  final String description;
  final String? photoUrl;
  final String status; // 'open' | 'investigating' | 'resolved'
  final DateTime createdAt;

  const PatrolIncidentModel({
    required this.id,
    this.checkpointId,
    this.checkpointCode,
    this.checkpointName,
    required this.guardUid,
    required this.guardName,
    required this.category,
    this.severity = 'medium',
    required this.description,
    this.photoUrl,
    this.status = 'open',
    required this.createdAt,
  });

  factory PatrolIncidentModel.fromFirestore(Map<String, dynamic> json, String docId) {
    return PatrolIncidentModel(
      id: docId,
      checkpointId: json['checkpointId'] as String?,
      checkpointCode: json['checkpointCode'] as String?,
      checkpointName: json['checkpointName'] as String?,
      guardUid: json['guardUid'] as String? ?? '',
      guardName: json['guardName'] as String? ?? 'Security Guard',
      category: json['category'] as String? ?? 'Security Issue',
      severity: json['severity'] as String? ?? 'medium',
      description: json['description'] as String? ?? '',
      photoUrl: json['photoUrl'] as String?,
      status: json['status'] as String? ?? 'open',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      if (checkpointId != null) 'checkpointId': checkpointId,
      if (checkpointCode != null) 'checkpointCode': checkpointCode,
      if (checkpointName != null) 'checkpointName': checkpointName,
      'guardUid': guardUid,
      'guardName': guardName,
      'category': category,
      'severity': severity,
      'description': description,
      if (photoUrl != null) 'photoUrl': photoUrl,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
