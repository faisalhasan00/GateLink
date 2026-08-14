enum SessionActionStatus { initial, loading, success, error }

class SessionState {
  final SessionActionStatus status;
  final String? errorMessage;
  final String? successMessage;

  const SessionState({
    this.status = SessionActionStatus.initial,
    this.errorMessage,
    this.successMessage,
  });

  bool get isLoading => status == SessionActionStatus.loading;
  bool get isSuccess => status == SessionActionStatus.success;
  bool get isError => status == SessionActionStatus.error;

  SessionState copyWith({
    SessionActionStatus? status,
    String? errorMessage,
    String? successMessage,
  }) {
    return SessionState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}
