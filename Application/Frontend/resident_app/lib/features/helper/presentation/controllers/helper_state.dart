enum HelperActionStatus { initial, loading, success, error }

class HelperState {
  final HelperActionStatus status;
  final String? errorMessage;
  final String? successMessage;

  const HelperState({
    required this.status,
    this.errorMessage,
    this.successMessage,
  });

  factory HelperState.initial() => const HelperState(
        status: HelperActionStatus.initial,
      );

  bool get isLoading => status == HelperActionStatus.loading;
  bool get isSuccess => status == HelperActionStatus.success;
  bool get isError => status == HelperActionStatus.error;

  HelperState copyWith({
    HelperActionStatus? status,
    String? errorMessage,
    String? successMessage,
  }) {
    return HelperState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}
