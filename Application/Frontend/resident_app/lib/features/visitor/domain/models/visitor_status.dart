enum VisitorStatus {
  pending,
  approved,
  rejected,
  expected,
  inside,
  checkedOut,
  unknown;

  static VisitorStatus fromString(String? value) {
    if (value == null) return VisitorStatus.pending;
    switch (value.toLowerCase().trim()) {
      case 'approved':
        return VisitorStatus.approved;
      case 'rejected':
      case 'denied':
        return VisitorStatus.rejected;
      case 'expected':
        return VisitorStatus.expected;
      case 'inside':
        return VisitorStatus.inside;
      case 'checked_out':
      case 'checkedout':
      case 'left':
        return VisitorStatus.checkedOut;
      case 'pending':
      default:
        return VisitorStatus.pending;
    }
  }

  String toFirestore() {
    switch (this) {
      case VisitorStatus.approved:
        return 'approved';
      case VisitorStatus.rejected:
        return 'rejected';
      case VisitorStatus.expected:
        return 'expected';
      case VisitorStatus.inside:
        return 'inside';
      case VisitorStatus.checkedOut:
        return 'checked_out';
      case VisitorStatus.pending:
      case VisitorStatus.unknown:
        return 'pending';
    }
  }

  String get displayName {
    switch (this) {
      case VisitorStatus.approved:
        return 'Approved';
      case VisitorStatus.rejected:
        return 'Denied';
      case VisitorStatus.expected:
        return 'Pre-Approved Pass';
      case VisitorStatus.inside:
        return 'Inside Society';
      case VisitorStatus.checkedOut:
        return 'Checked Out';
      case VisitorStatus.pending:
      case VisitorStatus.unknown:
        return 'Pending Approval';
    }
  }
}
