enum NotificationActionStatus { initial, loading, success, error }

class NotificationState {
  final NotificationActionStatus status;
  final String? errorMessage;
  final String? successMessage;

  const NotificationState({
    required this.status,
    this.errorMessage,
    this.successMessage,
  });

  factory NotificationState.initial() => const NotificationState(
        status: NotificationActionStatus.initial,
      );

  bool get isLoading => status == NotificationActionStatus.loading;
  bool get isSuccess => status == NotificationActionStatus.success;
  bool get isError => status == NotificationActionStatus.error;

  NotificationState copyWith({
    NotificationActionStatus? status,
    String? errorMessage,
    String? successMessage,
  }) {
    return NotificationState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}
