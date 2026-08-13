class VisitorInviteResult {
  final String visitorId;
  final String passCode;

  const VisitorInviteResult({
    required this.visitorId,
    required this.passCode,
  });
}

class VisitorScanResult {
  final bool isValid;
  final String? visitorName;
  final String? error;
  final String? reason;
  final String? visitorId;

  const VisitorScanResult({
    required this.isValid,
    this.visitorName,
    this.error,
    this.reason,
    this.visitorId,
  });

  factory VisitorScanResult.fromMap(Map<String, dynamic> map) {
    return VisitorScanResult(
      isValid: map['valid'] as bool? ?? false,
      visitorName: map['visitorName'] as String? ?? map['name'] as String?,
      error: map['error'] as String?,
      reason: map['reason'] as String?,
      visitorId: map['visitorId'] as String? ?? map['id'] as String?,
    );
  }
}
