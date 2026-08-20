import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/firestore_service.dart';
import '../services/notification_service.dart';
import 'auth_providers.dart';
import '../../features/visitor/providers/visitor_providers.dart';
import '../../features/maintenance/providers/maintenance_providers.dart';
import '../../features/visitor/domain/models/visitor_model.dart';
import '../../features/maintenance/domain/models/maintenance_bill_model.dart';
import '../../features/advertisement/models/ad_model.dart';
import '../../features/advertisement/repositories/ad_repository.dart';
import '../../features/advertisement/repositories/ad_repository_impl.dart';

export '../../features/complaint/providers/complaint_providers.dart';
export '../../features/notice/providers/notice_providers.dart';
export '../../features/amenity/providers/amenity_providers.dart';
export '../../features/parking/providers/parking_providers.dart';
export '../../features/notifications/providers/notification_providers.dart';
export '../../features/maintenance/providers/maintenance_providers.dart';
export '../../features/payment/providers/payment_providers.dart';

// ── SERVICE PROVIDER ─────────────────────────────────────────────────────────

final firestoreServiceProvider = Provider<FirestoreService>((ref) {
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? '';
  return FirestoreService(societyId: societyId);
});

// ── VISITOR PROVIDERS ─────────────────────────────────────────────────────────

/// A real-time stream provider for the live visitor log.
final visitorsStreamProvider = StreamProvider<List<VisitorModel>>((ref) {
  return ref.watch(visitorsProvider.stream);
});

/// Stream of pending visitors for the currently logged-in resident's flat.
final pendingVisitorsForFlatStreamProvider =
    StreamProvider<List<VisitorModel>>((ref) {
  return ref.watch(pendingVisitorsForFlatProvider.stream);
});

/// Notification watcher — ref.watch this high in the widget tree to start alerts.
final visitorNotificationWatcherProvider = StreamProvider<int>((ref) async* {
  final profile = ref.watch(userProfileProvider).value;
  if (profile == null) return;

  final seenIds = <String>{};
  final visitorRepo = ref.watch(visitorRepositoryProvider);
  final flatNumber = profile.flatNumber;
  final tower = profile.tower;
  final uid = profile.uid;

  if (flatNumber.isEmpty && uid.isEmpty) return;

  await for (final visitors in visitorRepo.watchPendingVisitorsForResident(
    residentUid: uid,
    flatNumber: flatNumber,
    tower: tower,
  )) {
    for (final visitor in visitors) {
      if (!seenIds.contains(visitor.id)) {
        seenIds.add(visitor.id);
        NotificationService.showVisitorAlert(
          visitorName: visitor.name,
          visitorType: visitor.type,
          flatNumber: visitor.hostFlat.isNotEmpty ? visitor.hostFlat : flatNumber,
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

final adRepositoryProvider = Provider<AdRepository>((ref) {
  return AdRepositoryImpl(FirebaseFirestore.instance);
});

/// A real-time stream provider for active ad campaigns.
final adCampaignsStreamProvider = StreamProvider<List<AdModel>>((ref) {
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? '';
  if (societyId.isEmpty) return Stream.value([]);
  final repository = ref.watch(adRepositoryProvider);
  return repository.watchAdCampaigns(societyId);
});

// ── MAINTENANCE BILLS PROVIDERS ───────────────────────────────────────────

final maintenanceBillsStreamProvider =
    StreamProvider<List<MaintenanceBillModel>>((ref) {
  return ref.watch(maintenanceBillsProvider.stream);
});

// ── DOCUMENTS PROVIDERS ───────────────────────────────────────────────────

final documentsStreamProvider = StreamProvider<QuerySnapshot>((ref) {
  final service = ref.watch(firestoreServiceProvider);
  return service.documentsStream();
});

// ── SOCIETY & SECURITY CONTACT PROVIDERS ─────────────────────────────────

final societyDetailsStreamProvider =
    StreamProvider<Map<String, dynamic>>((ref) {
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? '';
  if (societyId.isEmpty) return Stream.value({});

  return FirebaseFirestore.instance
      .collection('societies')
      .doc(societyId)
      .snapshots()
      .map((snap) => snap.data() ?? {});
});

final societySecurityPhoneProvider = Provider<String>((ref) {
  final societyDoc = ref.watch(societyDetailsStreamProvider).value ?? {};

  final securityPhone = (societyDoc['securityPhone'] ??
          societyDoc['gatePhone'] ??
          societyDoc['emergencyContact'] ??
          societyDoc['phone'] ??
          societyDoc['contactNumber'] ??
          '')
      .toString()
      .trim();

  if (securityPhone.isNotEmpty) return securityPhone;
  return 'Intercom 0';
});

