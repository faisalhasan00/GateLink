import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/auth_providers.dart';
import '../data/repositories/notification_repository_impl.dart';
import '../domain/models/notification_model.dart';
import '../domain/repositories/notification_repository.dart';
import '../presentation/controllers/notification_controller.dart';
import '../presentation/controllers/notification_state.dart';

final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepositoryImpl(FirebaseFirestore.instance);
});

final notificationsStreamProvider =
    StreamProvider<List<NotificationModel>>((ref) {
  final repository = ref.watch(notificationRepositoryProvider);
  final user = ref.watch(currentUserProvider);
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  if (user == null) return const Stream.empty();
  return repository.watchNotifications(societyId, user.uid);
});

final unreadNotificationsCountStreamProvider = StreamProvider<int>((ref) {
  final repository = ref.watch(notificationRepositoryProvider);
  final user = ref.watch(currentUserProvider);
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  if (user == null) return Stream.value(0);
  return repository.watchUnreadCount(societyId, user.uid);
});

final notificationControllerProvider =
    StateNotifierProvider<NotificationController, NotificationState>((ref) {
  final repository = ref.watch(notificationRepositoryProvider);
  return NotificationController(repository);
});
