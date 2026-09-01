class PatrolCheckpointModel {
  final String id;
  final String code;
  final String name;
  final String area;
  final int order;
  final bool isActive;
  final String? instructions;
  final DateTime? lastScannedAt;
  final String? lastScannedGuard;
  final String? lastScannedGuardName;

  const PatrolCheckpointModel({
    required this.id,
    required this.code,
    required this.name,
    required this.area,
    this.order = 1,
    this.isActive = true,
    this.instructions,
    this.lastScannedAt,
    this.lastScannedGuard,
    this.lastScannedGuardName,
  });

  factory PatrolCheckpointModel.fromFirestore(Map<String, dynamic> json, String docId) {
    return PatrolCheckpointModel(
      id: docId,
      code: json['code'] as String? ?? 'CP-01',
      name: json['name'] as String? ?? 'Checkpoint',
      area: json['area'] as String? ?? 'Society Grounds',
      order: (json['order'] as num?)?.toInt() ?? 1,
      isActive: json['isActive'] as bool? ?? true,
      instructions: json['instructions'] as String?,
      lastScannedAt: json['lastScannedAt'] != null
          ? DateTime.tryParse(json['lastScannedAt'] as String)
          : null,
      lastScannedGuard: json['lastScannedGuard'] as String?,
      lastScannedGuardName: json['lastScannedGuardName'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'code': code,
      'name': name,
      'area': area,
      'order': order,
      'isActive': isActive,
      if (instructions != null) 'instructions': instructions,
      if (lastScannedAt != null) 'lastScannedAt': lastScannedAt!.toIso8601String(),
      if (lastScannedGuard != null) 'lastScannedGuard': lastScannedGuard,
      if (lastScannedGuardName != null) 'lastScannedGuardName': lastScannedGuardName,
    };
  }

  PatrolCheckpointModel copyWith({
    String? id,
    String? code,
    String? name,
    String? area,
    int? order,
    bool? isActive,
    String? instructions,
    DateTime? lastScannedAt,
    String? lastScannedGuard,
    String? lastScannedGuardName,
  }) {
    return PatrolCheckpointModel(
      id: id ?? this.id,
      code: code ?? this.code,
      name: name ?? this.name,
      area: area ?? this.area,
      order: order ?? this.order,
      isActive: isActive ?? this.isActive,
      instructions: instructions ?? this.instructions,
      lastScannedAt: lastScannedAt ?? this.lastScannedAt,
      lastScannedGuard: lastScannedGuard ?? this.lastScannedGuard,
      lastScannedGuardName: lastScannedGuardName ?? this.lastScannedGuardName,
    );
  }
}
