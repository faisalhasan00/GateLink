import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/firestore_service.dart';
import '../services/notification_service.dart';
import 'auth_providers.dart';
import '../../features/visitor/providers/visitor_providers.dart';
import '../../features/maintenance/providers/maintenance_providers.dart';
import '../../features/visitor/domain/models/visitor_model.dart';
import '../../features/maintenance/domain/models/maintenance_bill_model.dart';

// ── SERVICE PROVIDER ─────────────────────────────────────────────────────────

final firestoreServiceProvider = Provider<FirestoreService>((ref) {
  final profile = ref.watch(userProfileProvider).value;
  final societyId = (profile?['societyId'] as String?)?.isNotEmpty == true
      ? profile!['societyId'] as String
      : 'SOC-001';
  return FirestoreService(societyId: societyId);
});

// ── VISITOR PROVIDERS ─────────────────────────────────────────────────────────

/// A real-time stream provider for the live visitor log.
final visitorsStreamProvider = StreamProvider<List<VisitorModel>>((ref) {
  return ref.watch(visitorsProvider.stream);
});

/// Stream of pending visitors for the currently logged-in resident's flat.
final pendingVisitorsForFlatStreamProvider = StreamProvider<List<VisitorModel>>((ref) {
  return ref.watch(pendingVisitorsForFlatProvider.stream);
});

/// Notification watcher — ref.watch this high in the widget tree to start alerts.
final visitorNotificationWatcherProvider = StreamProvider<int>((ref) async* {
  final profile = ref.watch(userProfileProvider).value;
  if (profile == null || profile['role'] != 'resident') return;

  final seenIds = <String>{};
  final visitorRepo = ref.watch(visitorRepositoryProvider);
  final flatNumber = profile['flatNumber'] as String? ?? '';
  final tower = profile['tower'] as String? ?? '';
  if (flatNumber.isEmpty || tower.isEmpty) return;

  final hostFlat = '$tower-$flatNumber';

  await for (final visitors in visitorRepo.watchPendingVisitorsForFlat(hostFlat)) {
    for (final visitor in visitors) {
      if (!seenIds.contains(visitor.id)) {
        seenIds.add(visitor.id);
        final entryTime = visitor.entryTime;
        if (entryTime != null) {
          try {
            final dt = DateTime.parse(entryTime);
            if (DateTime.now().difference(dt).inSeconds > 30) continue;
          } catch (_) {}
        }
        NotificationService.showVisitorAlert(
          visitorName: visitor.name,
          visitorType: visitor.type,
          flatNumber: flatNumber,
        );
      }
    }
    yield visitors.length;
  }
});


// ── RESIDENT PROVIDERS ────────────────────────────────────────────────────────

/// A real-time stream provider for all residents in the current society.
final residentsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  return service.residentsStream();
});

// ── AD CAMPAIGN PROVIDERS ─────────────────────────────────────────────────────

/// A real-time stream provider for active ad campaigns.
final adCampaignsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  return service.adCampaignsStream();
});

// ── COMPLAINTS PROVIDERS ──────────────────────────────────────────────────────

/// A real-time stream provider for complaints of the current user.
final complaintsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return service.complaintsStream(user.uid);
});

// ── NOTICES PROVIDERS ─────────────────────────────────────────────────────────

/// A real-time stream provider for all notices in the current society.
final noticesStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  return service.noticesStream();
});

// ── MAINTENANCE BILLS PROVIDERS ───────────────────────────────────────────

final maintenanceBillsStreamProvider = StreamProvider<List<MaintenanceBillModel>>((ref) {
  return ref.watch(maintenanceBillsProvider.stream);
});

// ── AMENITIES PROVIDERS ───────────────────────────────────────────────────

final amenitiesStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  return service.amenitiesStream();
});

// ── AMENITY BOOKINGS PROVIDERS ────────────────────────────────────────────

final myBookingsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return service.myBookingsStream(user.uid);
});

// ── PARKING PROVIDERS ─────────────────────────────────────────────────────

final parkingStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return service.parkingStream(user.uid);
});

// ── DOCUMENTS PROVIDERS ───────────────────────────────────────────────────

final documentsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  return service.documentsStream();
});

// ── NOTIFICATIONS PROVIDERS ───────────────────────────────────────────────

final notificationsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return service.notificationsStream(user.uid);
});

final unreadNotificationsCountStreamProvider = StreamProvider<int>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value(0);
  return service.unreadNotificationsCountStream(user.uid);
});
