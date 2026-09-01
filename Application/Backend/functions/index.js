/**
 * SocietySphere Cloud Functions Entrypoint
 * Clean Monorepo Modular Architecture
 */
const dns = require("dns");
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (_) {}

// 1. Visitor Triggers & Callables
const {
  notifyResidentOnVisitorArrival,
  notifyGuardOnVisitorDecision,
} = require("./visitors/visitor_notifications");

const {
  generateVisitorPasscode,
  validateVisitorPasscode,
} = require("./visitors/visitor_passcode");

// 1b. Domestic Staff Attendance Triggers
const {
  notifyResidentOnHelperLog,
} = require("./helpers/helper_notifications");

// 2. Super Admin Authorization & Staff Provisioning
const { setSuperAdminRole, createStaffUser } = require("./admin/super_admin");

// 3. Payment Gateway & Webhook Handlers
const {
  createCashfreeOrder,
  verifyCashfreePaymentStatus,
} = require("./payments/cashfree_orders");
const { cashfreeWebhook } = require("./payments/cashfree_webhook");
const {
  approveOfflinePayment,
  rejectOfflinePayment,
} = require("./payments/offline_payments");
const {
  reconcilePendingPayments,
} = require("./payments/payment_reconciliation");
const { triggerCashfreePayout } = require("./payments/cashfree_payouts");
const { scheduledMonthlyPartnerPayouts } = require("./payments/scheduled_payouts");

// 4. Notice & Broadcast Notification Triggers
const {
  notifyOnNoticeCreated,
  notifyOnBroadcastCreated,
  sendAdminFcmBroadcast,
} = require("./notices/notice_notifications");

// 5. Automated Backup Schedules
const { scheduledFirestoreBackup } = require("./backup/scheduled_backup");

// 6. Account Deletion & Privacy Workflows
const {
  requestAccountDeletion,
  cancelAccountDeletion,
  processScheduledAccountDeletion,
} = require("./admin/account_deletion");

// 7. Automated Monthly Invoicing & Billing Configuration
const {
  scheduledMonthlyInvoicing,
  triggerManualMonthlyInvoicing,
  getBillingConfig,
  updateBillingConfig,
} = require("./maintenance/scheduled_invoicing");

module.exports = {
  // Visitor Management
  notifyResidentOnVisitorArrival,
  notifyGuardOnVisitorDecision,
  generateVisitorPasscode,
  validateVisitorPasscode,

  // Staff & Helper Attendance Management
  notifyResidentOnHelperLog,

  // Admin & Staff Management
  setSuperAdminRole,
  createStaffUser,

  // Account Deletion & Self-Service Privacy Workflows
  requestAccountDeletion,
  cancelAccountDeletion,
  processScheduledAccountDeletion,

  // Notice & Broadcast Notifications
  notifyOnNoticeCreated,
  notifyOnBroadcastCreated,
  sendAdminFcmBroadcast,

  // Payment Processing & Payouts
  createCashfreeOrder,
  verifyCashfreePaymentStatus,
  cashfreeWebhook,
  approveOfflinePayment,
  rejectOfflinePayment,
  reconcilePendingPayments,
  triggerCashfreePayout,
  scheduledMonthlyPartnerPayouts,

  // Automated Monthly Maintenance Invoicing
  scheduledMonthlyInvoicing,
  triggerManualMonthlyInvoicing,
  getBillingConfig,
  updateBillingConfig,

  // Automated System Backups
  scheduledFirestoreBackup,
};
