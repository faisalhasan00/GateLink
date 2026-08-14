import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/maintenance_repository_impl.dart';
import '../domain/models/maintenance_bill_model.dart';
import '../domain/models/payment_receipt_model.dart';
import '../domain/repositories/maintenance_repository.dart';
import '../presentation/controllers/maintenance_controller.dart';
import '../presentation/controllers/maintenance_state.dart';

final maintenanceRepositoryProvider = Provider<MaintenanceRepository>((ref) {
  final firestoreService = ref.watch(firestoreServiceProvider);
  return MaintenanceRepositoryImpl(firestoreService);
});

final maintenanceControllerProvider =
    StateNotifierProvider<MaintenanceController, MaintenanceState>((ref) {
  final repo = ref.watch(maintenanceRepositoryProvider);
  return MaintenanceController(repo);
});

/// Dedicated Query Provider for active pending maintenance bill.
final pendingBillProvider = FutureProvider<MaintenanceBillModel?>((ref) async {
  final repo = ref.watch(maintenanceRepositoryProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;
  return repo.getPendingBill(user.uid);
});

/// Real-time stream provider of all maintenance bills for the current resident.
final maintenanceBillsProvider =
    StreamProvider<List<MaintenanceBillModel>>((ref) {
  final repo = ref.watch(maintenanceRepositoryProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return repo.watchMaintenanceBills(user.uid);
});

/// Real-time stream provider of payment receipts for the current resident.
final paymentReceiptsProvider =
    StreamProvider<List<PaymentReceiptModel>>((ref) {
  final repo = ref.watch(maintenanceRepositoryProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return repo.watchPaymentReceipts(user.uid);
});
