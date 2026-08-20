import 'package:cloud_firestore/cloud_firestore.dart';

import 'visitor_service.dart';
import 'amenity_service.dart';
import 'complaint_service.dart';
import 'billing_service.dart';
import 'notice_service.dart';
import 'document_service.dart';
import 'parking_service.dart';
import 'ad_campaign_service.dart';
import 'user_notification_service.dart';

// Re-export all domain micro-services and models for seamless backward compatibility
export 'visitor_service.dart';
export 'amenity_service.dart';
export 'complaint_service.dart';
export 'billing_service.dart';
export 'notice_service.dart';
export 'document_service.dart';
export 'parking_service.dart';
export 'ad_campaign_service.dart';
export 'user_notification_service.dart';

/// Lightweight Facade / Composition Root for Guard App.
/// Composes isolated domain micro-services to preserve full backward compatibility
/// while enforcing strict Single Responsibility and fault isolation across all features.
class FirestoreService {
  final String societyId;
  final FirebaseFirestore _db;

  // Domain Micro-Services
  final VisitorService visitorService;
  final AmenityService amenityService;
  final ComplaintService complaintService;
  final BillingService billingService;
  final NoticeService noticeService;
  final DocumentService documentService;
  final ParkingService parkingService;
  final AdCampaignService adCampaignService;
  final UserNotificationService notificationService;

  FirestoreService({
    required this.societyId,
    FirebaseFirestore? db,
  })  : _db = db ?? FirebaseFirestore.instance,
        visitorService = VisitorService(societyId: societyId, db: db),
        amenityService = AmenityService(societyId: societyId, db: db),
        complaintService = ComplaintService(societyId: societyId, db: db),
        billingService = BillingService(societyId: societyId, db: db),
        noticeService = NoticeService(societyId: societyId, db: db),
        documentService = DocumentService(societyId: societyId, db: db),
        parkingService = ParkingService(societyId: societyId, db: db),
        adCampaignService = AdCampaignService(db: db),
        notificationService = UserNotificationService(societyId: societyId, db: db);

  // ── VISITORS DELEGATES ───────────────────────────────────────────────────

  Stream<QuerySnapshot> visitorsStream() => visitorService.visitorsStream();

  Stream<QuerySnapshot> pendingVisitorsStream() =>
      visitorService.pendingVisitorsStream();

  Stream<QuerySnapshot> pendingVisitorsForFlatStream(String flatNumber) =>
      visitorService.pendingVisitorsForFlatStream(flatNumber);

  Stream<QuerySnapshot> residentsStream() => visitorService.residentsStream();

  Future<FlatValidationResult> validateFlat(String hostFlat) =>
      visitorService.validateFlat(hostFlat);

  Future<String> logVisitorEntry({
    required String name,
    required String type,
    required String hostFlat,
    String? phone,
    String? vehicleNumber,
    String? vehicleType,
    String? company,
    String? gender,
    String? photoUrl,
    String? notes,
    String? guardUid,
    String? gateName,
  }) =>
      visitorService.logVisitorEntry(
        name: name,
        type: type,
        hostFlat: hostFlat,
        phone: phone,
        vehicleNumber: vehicleNumber,
        vehicleType: vehicleType,
        company: company,
        gender: gender,
        photoUrl: photoUrl,
        notes: notes,
        guardUid: guardUid,
        gateName: gateName,
      );

  Future<void> markVisitorExit(String visitorId) =>
      visitorService.markVisitorExit(visitorId);

  Future<Map<String, dynamic>> validateAndProcessQrScan(String code) =>
      visitorService.validateAndProcessQrScan(code);

  Future<void> updateVisitorStatus(String visitorId, String status) =>
      visitorService.updateVisitorStatus(visitorId, status);

  Future<void> updateVisitorApproval({
    required String visitorId,
    required String status,
    required String residentUid,
    String? rejectionReason,
  }) =>
      visitorService.updateVisitorApproval(
        visitorId: visitorId,
        status: status,
        residentUid: residentUid,
        rejectionReason: rejectionReason,
      );

  Future<Map<String, String>> inviteVisitor({
    required String name,
    required String phone,
    required String purpose,
    required String hostFlat,
    required String invitedBy,
    required String expectedDate,
    required String expectedTime,
  }) =>
      visitorService.inviteVisitor(
        name: name,
        phone: phone,
        purpose: purpose,
        hostFlat: hostFlat,
        invitedBy: invitedBy,
        expectedDate: expectedDate,
        expectedTime: expectedTime,
      );

  // ── AMENITIES DELEGATES ──────────────────────────────────────────────────

  Stream<QuerySnapshot> amenitiesStream() => amenityService.amenitiesStream();

  Stream<QuerySnapshot> myBookingsStream(String uid) =>
      amenityService.myBookingsStream(uid);

  Future<List<String>> getBookedSlotsForDate(String amenityId, String date) =>
      amenityService.getBookedSlotsForDate(amenityId, date);

  Future<void> bookAmenity({
    required String amenityId,
    required String amenityName,
    required String uid,
    required String userName,
    required String date,
    required String timeSlot,
    int guests = 1,
    String? specialNotes,
    String? flatNumber,
    String? phone,
  }) =>
      amenityService.bookAmenity(
        amenityId: amenityId,
        amenityName: amenityName,
        uid: uid,
        userName: userName,
        date: date,
        timeSlot: timeSlot,
        guests: guests,
        specialNotes: specialNotes,
        flatNumber: flatNumber,
        phone: phone,
      );

  Future<void> cancelAmenityBooking(String bookingId, String userUid) =>
      amenityService.cancelAmenityBooking(bookingId, userUid);

  // ── COMPLAINTS DELEGATES ─────────────────────────────────────────────────

  Stream<QuerySnapshot> complaintsStream(String uid) =>
      complaintService.complaintsStream(uid);

  Stream<DocumentSnapshot> complaintDetailStream(String complaintId) =>
      complaintService.complaintDetailStream(complaintId);

  Future<String> raiseComplaint({
    required String title,
    required String description,
    required String category,
    required String uid,
    String? block,
    String? floor,
    String? priority,
    String? photoUrl,
    String? residentName,
    String? flatNumber,
  }) =>
      complaintService.raiseComplaint(
        title: title,
        description: description,
        category: category,
        uid: uid,
        block: block,
        floor: floor,
        priority: priority,
        photoUrl: photoUrl,
        residentName: residentName,
        flatNumber: flatNumber,
      );

  // ── BILLING & PAYMENTS DELEGATES ─────────────────────────────────────────

  Stream<QuerySnapshot> maintenanceBillsStream(String uid) =>
      billingService.maintenanceBillsStream(uid);

  Stream<QuerySnapshot> paymentReceiptsStream(String uid) =>
      billingService.paymentReceiptsStream(uid);

  Future<void> payMaintenanceBill({
    required String billId,
    required String residentUid,
    required double amount,
    required String paymentMethod,
    required String invoiceNumber,
    required String billingPeriod,
  }) =>
      billingService.payMaintenanceBill(
        billId: billId,
        residentUid: residentUid,
        amount: amount,
        paymentMethod: paymentMethod,
        invoiceNumber: invoiceNumber,
        billingPeriod: billingPeriod,
      );

  // ── NOTICES DELEGATES ────────────────────────────────────────────────────

  Stream<QuerySnapshot> noticesStream() => noticeService.noticesStream();

  // ── DOCUMENTS DELEGATES ──────────────────────────────────────────────────

  Stream<QuerySnapshot> documentsStream() => documentService.documentsStream();

  Future<void> seedDocumentsIfEmpty() => documentService.seedDocumentsIfEmpty();

  // ── PARKING DELEGATES ────────────────────────────────────────────────────

  Stream<QuerySnapshot> parkingStream(String uid) =>
      parkingService.parkingStream(uid);

  // ── AD CAMPAIGNS DELEGATES ───────────────────────────────────────────────

  Stream<QuerySnapshot> adCampaignsStream() =>
      adCampaignService.adCampaignsStream();

  // ── USER NOTIFICATIONS DELEGATES ─────────────────────────────────────────

  Stream<QuerySnapshot> notificationsStream(String uid) =>
      notificationService.notificationsStream(uid);

  Stream<int> unreadNotificationsCountStream(String uid) =>
      notificationService.unreadNotificationsCountStream(uid);

  Future<void> markNotificationAsRead(String notifId, String uid) =>
      notificationService.markNotificationAsRead(notifId, uid);

  Future<void> markAllNotificationsAsRead(String uid) =>
      notificationService.markAllNotificationsAsRead(uid);

  Future<void> updateNotificationPreferences(
          String uid, Map<String, bool> prefs) =>
      notificationService.updateNotificationPreferences(uid, prefs);

  Future<void> deleteNotification(String notifId, String uid) =>
      notificationService.deleteNotification(notifId, uid);

  Future<void> clearAllNotifications(String uid) =>
      notificationService.clearAllNotifications(uid);
}
