/**
 * GateLink Society Admin Data Service Layer
 * 
 * ARCHITECTURE & BUSINESS RULES:
 * 1. Multi-Tenant Isolation: Every method requires or validates a `societyId`.
 * 2. Modular Domain Architecture: Refactored into clean domain services under `src/services/domain/`.
 * 3. Backward Compatibility: Re-exports all domain methods under `societyAdminService`.
 */

import { residentService } from './domain/residentService';
import { maintenanceService } from './domain/maintenanceService';
import { complaintService } from './domain/complaintService';
import { facilityService } from './domain/facilityService';
import { pollService } from './domain/pollService';

export const societyAdminService = {
  // ── RESIDENTS & STAFF ──────────────────────────────────────────────────
  subscribeResidents: residentService.subscribeResidents,
  addResident: residentService.addResident,
  updateResidentStatus: residentService.updateResidentStatus,
  deleteResident: residentService.deleteResident,
  subscribeGuards: residentService.subscribeGuards,
  createGuardUser: residentService.createGuardUser,
  updateGuardStatus: residentService.updateGuardStatus,
  deleteGuardUser: residentService.deleteGuardUser,
  subscribeHelpers: residentService.subscribeHelpers,
  createHelper: residentService.createHelper,
  updateHelperStatus: residentService.updateHelperStatus,
  deleteHelper: residentService.deleteHelper,
  subscribeStaff: residentService.subscribeStaff,
  addStaff: residentService.addStaff,

  // ── MAINTENANCE & BANK SETTLEMENTS ────────────────────────────────────
  getSocietyBankDetails: maintenanceService.getSocietyBankDetails,
  updateSocietyBankDetails: (societyId, bankData) => 
    maintenanceService.updateSocietyBankDetails(societyId, bankData, complaintService.logAuditAction),
  subscribeMaintenanceBills: maintenanceService.subscribeMaintenanceBills,
  createMaintenanceBill: maintenanceService.createMaintenanceBill,
  updateBillStatus: maintenanceService.updateBillStatus,
  markBillPaid: maintenanceService.markBillPaid,

  // ── COMPLAINTS, SOS & AUDIT ───────────────────────────────────────────
  subscribeComplaints: complaintService.subscribeComplaints,
  updateComplaintStatus: complaintService.updateComplaintStatus,
  assignComplaintStaff: complaintService.assignComplaintStaff,
  subscribeSosAlerts: complaintService.subscribeSosAlerts,
  updateSosAlertStatus: complaintService.updateSosAlertStatus,
  subscribeAuditLogs: complaintService.subscribeAuditLogs,
  logAuditAction: complaintService.logAuditAction,

  // ── FACILITIES, NOTICES, POLLS & SEARCH ────────────────────────────────
  getSocietyDetails: facilityService.getSocietyDetails,
  onboardSocietyBatch: facilityService.onboardSocietyBatch,
  subscribeVisitors: facilityService.subscribeVisitors,
  createVisitorPass: facilityService.createVisitorPass,
  updateVisitorStatus: facilityService.updateVisitorStatus,
  subscribeAmenities: facilityService.subscribeAmenities,
  createAmenity: facilityService.createAmenity,
  subscribeAmenityBookings: facilityService.subscribeAmenityBookings,
  updateAmenityBookingStatus: facilityService.updateAmenityBookingStatus,
  subscribeNotices: facilityService.subscribeNotices,
  createNotice: facilityService.createNotice,
  deleteNotice: facilityService.deleteNotice,
  subscribePolls: pollService.subscribePolls,
  createPoll: pollService.createPoll,
  closePoll: pollService.closePoll,
  deletePoll: pollService.deletePoll,
  getPollVotes: pollService.getPollVotes,
  subscribeDocuments: facilityService.subscribeDocuments,
  createDocumentRecord: facilityService.createDocumentRecord,
  subscribeParkingSlots: facilityService.subscribeParkingSlots,
  assignParkingSlot: facilityService.assignParkingSlot,
  subscribeNotifications: facilityService.subscribeNotifications,
  markNotificationRead: facilityService.markNotificationRead,
  markAllNotificationsRead: facilityService.markAllNotificationsRead,
  searchSocietyData: facilityService.searchSocietyData,
  createLead: facilityService.createLead,
};
