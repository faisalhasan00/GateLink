import '../../domain/models/payment_order_model.dart';

enum PaymentActionStatus { initial, loading, success, error }

class PaymentState {
  final PaymentActionStatus status;
  final PaymentOrderModel? activeOrder;
  final String? successMessage;
  final String? errorMessage;

  const PaymentState({
    this.status = PaymentActionStatus.initial,
    this.activeOrder,
    this.successMessage,
    this.errorMessage,
  });

  bool get isLoading => status == PaymentActionStatus.loading;
  bool get isSuccess => status == PaymentActionStatus.success;
  bool get isError => status == PaymentActionStatus.error;

  PaymentState copyWith({
    PaymentActionStatus? status,
    PaymentOrderModel? activeOrder,
    String? successMessage,
    String? errorMessage,
  }) {
    return PaymentState(
      status: status ?? this.status,
      activeOrder: activeOrder ?? this.activeOrder,
      successMessage: successMessage,
      errorMessage: errorMessage,
    );
  }
}
