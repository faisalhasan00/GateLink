class SessionModel {
  final String id;
  final String deviceName;
  final String osVersion;
  final String lastLogin;
  final bool isCurrentSession;

  const SessionModel({
    required this.id,
    required this.deviceName,
    required this.osVersion,
    required this.lastLogin,
    this.isCurrentSession = false,
  });

  factory SessionModel.fromMap(Map<String, dynamic> map, String docId) {
    return SessionModel(
      id: docId,
      deviceName: map['deviceName'] as String? ?? 'Android Device',
      osVersion: map['osVersion'] as String? ?? 'Android OS',
      lastLogin: map['lastLogin'] as String? ?? 'Recent',
      isCurrentSession: map['isCurrentSession'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'deviceName': deviceName,
      'osVersion': osVersion,
      'lastLogin': lastLogin,
      'isCurrentSession': isCurrentSession,
    };
  }
}
