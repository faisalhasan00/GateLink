/**
 * SocietySphere Cloud Functions Entrypoint
 * Clean Monorepo Modular Architecture
 */

// 1. Visitor Triggers & Callables
const {
  notifyResidentOnVisitorArrival,
  notifyGuardOnVisitorDecision,
} = require("./visitors/visitor_notifications");

const {
  generateVisitorPasscode,
  validateVisitorPasscode,
} = require("./visitors/visitor_passcode");

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
} = require("./notices/notice_notifications");

module.exports = {
  // Visitor Management
  notifyResidentOnVisitorArrival,
  notifyGuardOnVisitorDecision,
  generateVisitorPasscode,
  validateVisitorPasscode,

  // Admin & Staff Management
  setSuperAdminRole,
  createStaffUser,

  // Notice & Broadcast Notifications
  notifyOnNoticeCreated,
  notifyOnBroadcastCreated,

  // Payment Processing & Payouts
  createCashfreeOrder,
  verifyCashfreePaymentStatus,
  cashfreeWebhook,
  approveOfflinePayment,
  rejectOfflinePayment,
  reconcilePendingPayments,
  triggerCashfreePayout,
  scheduledMonthlyPartnerPayouts,
};
