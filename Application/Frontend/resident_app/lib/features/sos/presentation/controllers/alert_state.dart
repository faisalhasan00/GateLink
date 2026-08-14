enum AlertActionStatus { initial, loading, success, error }

class AlertState {
  final AlertActionStatus status;
  final String? errorMessage;
  final String? successMessage;

  const AlertState({
    this.status = AlertActionStatus.initial,
    this.errorMessage,
    this.successMessage,
  });

  bool get isLoading => status == AlertActionStatus.loading;
  bool get isSuccess => status == AlertActionStatus.success;
  bool get isError => status == AlertActionStatus.error;

  AlertState copyWith({
    AlertActionStatus? status,
    String? errorMessage,
    String? successMessage,
  }) {
    return AlertState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}
