enum MaintenanceActionStatus { initial, loading, success, error }

class MaintenanceState {
  final MaintenanceActionStatus status;
  final String? errorMessage;
  final String? successMessage;

  const MaintenanceState({
    this.status = MaintenanceActionStatus.initial,
    this.errorMessage,
    this.successMessage,
  });

  bool get isSubmitting => status == MaintenanceActionStatus.loading;
  bool get hasError => status == MaintenanceActionStatus.error && errorMessage != null;
  bool get isSuccess => status == MaintenanceActionStatus.success;

  MaintenanceState copyWith({
    MaintenanceActionStatus? status,
    String? errorMessage,
    String? successMessage,
  }) {
    return MaintenanceState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }

  factory MaintenanceState.initial() => const MaintenanceState();

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MaintenanceState &&
          runtimeType == other.runtimeType &&
          status == other.status &&
          errorMessage == other.errorMessage &&
          successMessage == other.successMessage;

  @override
  int get hashCode => status.hashCode ^ errorMessage.hashCode ^ successMessage.hashCode;
}
