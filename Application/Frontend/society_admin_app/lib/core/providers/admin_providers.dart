import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/society_model.dart';
import '../models/resident_model.dart';
import '../models/visitor_model.dart';
import '../models/complaint_model.dart';
import '../models/maintenance_model.dart';
import '../models/notice_model.dart';
import '../models/sos_model.dart';
import '../models/facility_models.dart';
import '../services/admin_firestore_service.dart';

// Services
final firestoreServiceProvider = Provider<AdminFirestoreService>((ref) {
  return AdminFirestoreService();
});

final firebaseAuthProvider = Provider<FirebaseAuth>((ref) {
  return FirebaseAuth.instance;
});

// Auth State Provider
final authStateProvider = StreamProvider<User?>((ref) {
  return ref.watch(firebaseAuthProvider).authStateChanges();
});

// Active Society Notifier
class ActiveSocietyNotifier extends StateNotifier<SocietyModel?> {
  static const String _prefKey = 'selected_society_id';
  final AdminFirestoreService _firestoreService;

  ActiveSocietyNotifier(this._firestoreService) : super(null) {
    _loadSavedSociety();
  }

  Future<void> _loadSavedSociety() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedId = prefs.getString(_prefKey);
      if (savedId != null && savedId.isNotEmpty) {
        final society = await _firestoreService.getSocietyDetails(savedId);
        if (society != null) {
          state = society;
        }
      }
    } catch (_) {}
  }

  Future<void> setSociety(SocietyModel society) async {
    state = society;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, society.id);
  }

  Future<void> clearSociety() async {
    state = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefKey);
  }
}

final activeSocietyProvider =
    StateNotifierProvider<ActiveSocietyNotifier, SocietyModel?>((ref) {
  final firestore = ref.watch(firestoreServiceProvider);
  return ActiveSocietyNotifier(firestore);
});

// Admin Societies List Provider
final adminSocietiesProvider = FutureProvider<List<SocietyModel>>((ref) async {
  final user = ref.watch(firebaseAuthProvider).currentUser;
  if (user == null) return [];
  final firestore = ref.watch(firestoreServiceProvider);
  return await firestore.getAdminSocieties(uid: user.uid, email: user.email);
});

// Real-Time Data Streams Scoped to Active Society
final residentsStreamProvider = StreamProvider<List<ResidentModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamResidents(society.id);
});

final visitorsStreamProvider = StreamProvider<List<VisitorModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamVisitors(society.id);
});

final complaintsStreamProvider = StreamProvider<List<ComplaintModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamComplaints(society.id);
});

final maintenanceBillsStreamProvider =
    StreamProvider<List<MaintenanceBillModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamMaintenanceBills(society.id);
});

final noticesStreamProvider = StreamProvider<List<NoticeModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamNotices(society.id);
});

final sosAlertsStreamProvider = StreamProvider<List<SosAlertModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamActiveSosAlerts(society.id);
});

final amenitiesStreamProvider = StreamProvider<List<AmenityModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamAmenities(society.id);
});

final amenityBookingsStreamProvider =
    StreamProvider<List<AmenityBookingModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamAmenityBookings(society.id);
});

final staffStreamProvider = StreamProvider<List<StaffModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamStaff(society.id);
});

final helpersStreamProvider = StreamProvider<List<HelperModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamHelpers(society.id);
});

final pollsStreamProvider = StreamProvider<List<PollModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamPolls(society.id);
});

final parkingSlotsStreamProvider =
    StreamProvider<List<ParkingSlotModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamParkingSlots(society.id);
});

final documentsStreamProvider =
    StreamProvider<List<DocumentRecordModel>>((ref) {
  final society = ref.watch(activeSocietyProvider);
  if (society == null) return const Stream.empty();
  return ref.watch(firestoreServiceProvider).streamDocuments(society.id);
});
