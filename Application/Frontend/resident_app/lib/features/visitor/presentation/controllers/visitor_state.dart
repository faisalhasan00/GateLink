enum VisitorActionStatus { initial, loading, success, error }

class VisitorState {
  final VisitorActionStatus status;
  final String? errorMessage;
  final String? successMessage;
  final Map<String, dynamic>? data;

  const VisitorState({
    this.status = VisitorActionStatus.initial,
    this.errorMessage,
    this.successMessage,
    this.data,
  });

  bool get isSubmitting => status == VisitorActionStatus.loading;
  bool get hasError => status == VisitorActionStatus.error && errorMessage != null;
  bool get isSuccess => status == VisitorActionStatus.success;

  VisitorState copyWith({
    VisitorActionStatus? status,
    String? errorMessage,
    String? successMessage,
    Map<String, dynamic>? data,
  }) {
    return VisitorState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
      data: data ?? this.data,
    );
  }

  factory VisitorState.initial() => const VisitorState();

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is VisitorState &&
          runtimeType == other.runtimeType &&
          status == other.status &&
          errorMessage == other.errorMessage &&
          successMessage == other.successMessage;

  @override
  int get hashCode => status.hashCode ^ errorMessage.hashCode ^ successMessage.hashCode;
}
