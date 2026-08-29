class VisitorInviteResult {
  final String visitorId;
  final String passCode;
  final String passType; // 'one_time' or 'multi_day'
  final String? validFrom;
  final String? validUntil;

  const VisitorInviteResult({
    required this.visitorId,
    required this.passCode,
    this.passType = 'one_time',
    this.validFrom,
    this.validUntil,
  });
}

class VisitorScanResult {
  final bool isValid;
  final String? visitorName;
  final String? error;
  final String? reason;
  final String? visitorId;
  final String? passType;

  const VisitorScanResult({
    required this.isValid,
    this.visitorName,
    this.error,
    this.reason,
    this.visitorId,
    this.passType,
  });

  factory VisitorScanResult.fromMap(Map<String, dynamic> map) {
    return VisitorScanResult(
      isValid: map['valid'] as bool? ?? false,
      visitorName: map['visitorName'] as String? ?? map['name'] as String?,
      error: map['error'] as String?,
      reason: map['reason'] as String?,
      visitorId: map['visitorId'] as String? ?? map['id'] as String?,
      passType: map['passType'] as String?,
    );
  }
}
