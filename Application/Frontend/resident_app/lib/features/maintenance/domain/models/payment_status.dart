enum PaymentStatus {
  pending,
  paid,
  overdue,
  pendingVerification,
  unknown;

  static PaymentStatus fromString(String? value) {
    if (value == null) return PaymentStatus.pending;
    switch (value.toLowerCase().trim()) {
      case 'paid':
      case 'success':
        return PaymentStatus.paid;
      case 'overdue':
        return PaymentStatus.overdue;
      case 'pending_verification':
      case 'pendingverification':
        return PaymentStatus.pendingVerification;
      case 'pending':
      default:
        return PaymentStatus.pending;
    }
  }

  String toFirestore() {
    switch (this) {
      case PaymentStatus.paid:
        return 'paid';
      case PaymentStatus.overdue:
        return 'overdue';
      case PaymentStatus.pendingVerification:
        return 'pending_verification';
      case PaymentStatus.pending:
      case PaymentStatus.unknown:
        return 'pending';
    }
  }

  String get displayName {
    switch (this) {
      case PaymentStatus.paid:
        return 'Paid';
      case PaymentStatus.overdue:
        return 'Overdue';
      case PaymentStatus.pendingVerification:
        return 'Pending Verification';
      case PaymentStatus.pending:
      case PaymentStatus.unknown:
        return 'Pending';
    }
  }
}
