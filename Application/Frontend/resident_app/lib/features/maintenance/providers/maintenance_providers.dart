import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/maintenance_repository_impl.dart';
import '../domain/models/maintenance_bill_model.dart';
import '../domain/models/payment_receipt_model.dart';
import '../domain/repositories/maintenance_repository.dart';
import '../presentation/controllers/maintenance_controller.dart';

final maintenanceRepositoryProvider = Provider<MaintenanceRepository>((ref) {
  final firestoreService = ref.watch(firestoreServiceProvider);
  return MaintenanceRepositoryImpl(firestoreService);
});

final maintenanceControllerProvider =
    StateNotifierProvider<MaintenanceController, AsyncValue<void>>((ref) {
  final repo = ref.watch(maintenanceRepositoryProvider);
  return MaintenanceController(repo);
});

final maintenanceBillsProvider = StreamProvider<List<MaintenanceBillModel>>((ref) {
  final repo = ref.watch(maintenanceRepositoryProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return repo.watchMaintenanceBills(user.uid);
});

final paymentReceiptsProvider = StreamProvider<List<PaymentReceiptModel>>((ref) {
  final repo = ref.watch(maintenanceRepositoryProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return repo.watchPaymentReceipts(user.uid);
});
