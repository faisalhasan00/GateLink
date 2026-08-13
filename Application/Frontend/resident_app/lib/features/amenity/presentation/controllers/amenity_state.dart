enum AmenityActionStatus { initial, loading, success, error }

class AmenityState {
  final AmenityActionStatus status;
  final String? errorMessage;
  final String? successMessage;

  const AmenityState({
    required this.status,
    this.errorMessage,
    this.successMessage,
  });

  factory AmenityState.initial() => const AmenityState(
        status: AmenityActionStatus.initial,
      );

  bool get isLoading => status == AmenityActionStatus.loading;
  bool get isSuccess => status == AmenityActionStatus.success;
  bool get isError => status == AmenityActionStatus.error;

  AmenityState copyWith({
    AmenityActionStatus? status,
    String? errorMessage,
    String? successMessage,
  }) {
    return AmenityState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}
