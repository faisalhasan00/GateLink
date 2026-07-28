import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/firestore_service.dart';
import '../services/notification_service.dart';

import 'auth_providers.dart';

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
final visitorsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  return service.visitorsStream();
});

/// Stream of pending visitors for the currently logged-in resident's flat.
final pendingVisitorsForFlatStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  final profile = ref.watch(userProfileProvider).value;
  final flatNumber = profile?['flatNumber'] as String? ?? '';
  final tower = profile?['tower'] as String? ?? '';
  if (flatNumber.isEmpty || tower.isEmpty) return const Stream.empty();
  
  // Guard app saves hostFlat as "Tower-FlatNumber" (e.g., "A-101")
  final hostFlat = '$tower-$flatNumber';
  return service.pendingVisitorsForFlatStream(hostFlat);
});

/// Notification watcher — ref.watch this high in the widget tree to start alerts.
final visitorNotificationWatcherProvider = StreamProvider<int>((ref) async* {
  final profile = ref.watch(userProfileProvider).value;
  if (profile == null || profile['role'] != 'resident') return;

  final seenIds = <String>{};
  final service = ref.watch(firestoreServiceProvider);
  final flatNumber = profile['flatNumber'] as String? ?? '';
  final tower = profile['tower'] as String? ?? '';
  if (flatNumber.isEmpty || tower.isEmpty) return;

  final hostFlat = '$tower-$flatNumber';

  await for (final snapshot in service.pendingVisitorsForFlatStream(hostFlat)) {
    for (final doc in snapshot.docs) {
      if (!seenIds.contains(doc.id)) {
        seenIds.add(doc.id);
        final data = doc.data() as Map<String, dynamic>;
        // Skip documents older than 30 seconds (avoid triggering on old data at login)
        final entryTime = data['entryTime'] as String?;
        if (entryTime != null) {
          try {
            final dt = DateTime.parse(entryTime);
            if (DateTime.now().difference(dt).inSeconds > 30) continue;
          } catch (_) {}
        }
        final name = data['name'] as String? ?? 'Someone';
        final type = data['type'] as String? ?? 'Visitor';
        NotificationService.showVisitorAlert(
          visitorName: name,
          visitorType: type,
          flatNumber: flatNumber,
        );
      }
    }
    yield snapshot.docs.length;
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

final maintenanceBillsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return service.maintenanceBillsStream(user.uid);
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
