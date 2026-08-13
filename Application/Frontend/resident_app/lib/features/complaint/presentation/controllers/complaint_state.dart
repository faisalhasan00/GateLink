enum ComplaintActionStatus { initial, loading, success, error }

class ComplaintState {
  final ComplaintActionStatus status;
  final String? errorMessage;
  final String? successMessage;
  final String? raisedComplaintId;

  const ComplaintState({
    required this.status,
    this.errorMessage,
    this.successMessage,
    this.raisedComplaintId,
  });

  factory ComplaintState.initial() => const ComplaintState(
        status: ComplaintActionStatus.initial,
      );

  bool get isLoading => status == ComplaintActionStatus.loading;
  bool get isSuccess => status == ComplaintActionStatus.success;
  bool get isError => status == ComplaintActionStatus.error;

  ComplaintState copyWith({
    ComplaintActionStatus? status,
    String? errorMessage,
    String? successMessage,
    String? raisedComplaintId,
  }) {
    return ComplaintState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
      raisedComplaintId: raisedComplaintId ?? this.raisedComplaintId,
    );
  }
}
