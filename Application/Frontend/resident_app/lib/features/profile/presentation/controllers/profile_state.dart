enum ProfileActionStatus { initial, loading, success, error }

class ProfileState {
  final ProfileActionStatus status;
  final String? errorMessage;
  final String? successMessage;

  const ProfileState({
    required this.status,
    this.errorMessage,
    this.successMessage,
  });

  factory ProfileState.initial() => const ProfileState(
        status: ProfileActionStatus.initial,
      );

  bool get isLoading => status == ProfileActionStatus.loading;
  bool get isSuccess => status == ProfileActionStatus.success;
  bool get isError => status == ProfileActionStatus.error;

  ProfileState copyWith({
    ProfileActionStatus? status,
    String? errorMessage,
    String? successMessage,
  }) {
    return ProfileState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}
