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

module.exports = {
  // Visitor Management
  notifyResidentOnVisitorArrival,
  notifyGuardOnVisitorDecision,
  generateVisitorPasscode,
  validateVisitorPasscode,

  // Admin & Staff Management
  setSuperAdminRole,
  createStaffUser,

  // Payment Processing
  createCashfreeOrder,
  verifyCashfreePaymentStatus,
  cashfreeWebhook,
  approveOfflinePayment,
  rejectOfflinePayment,
  reconcilePendingPayments,
};
