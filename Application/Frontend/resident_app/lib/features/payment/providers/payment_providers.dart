import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/repositories/payment_repository_impl.dart';
import '../domain/models/payment_order_model.dart';
import '../domain/repositories/payment_repository.dart';
import '../presentation/controllers/payment_controller.dart';
import '../presentation/controllers/payment_state.dart';

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  return PaymentRepositoryImpl();
});

final paymentControllerProvider =
    StateNotifierProvider<PaymentController, PaymentState>((ref) {
  final repository = ref.watch(paymentRepositoryProvider);
  return PaymentController(repository);
});

final paymentStatusStreamProvider =
    StreamProvider.family<PaymentOrderModel?, String>((ref, orderId) {
  final repository = ref.watch(paymentRepositoryProvider);
  return repository.watchPaymentStatus(orderId);
});
