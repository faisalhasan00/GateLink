const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { db, auth, FieldValue } = require("../config/firebase");
const { CashfreePaymentProvider } = require("../cashfree_service");

const cashfreeClientId = defineSecret("CASHFREE_CLIENT_ID");
const cashfreeClientSecret = defineSecret("CASHFREE_CLIENT_SECRET");

/**
 * 1. Centralized Platform API: Create Cashfree Payment Order
 * SEC-P0: Hardened with Firebase Auth, Tenant Ownership Verification, and Secret Manager bindings.
 */
const createCashfreeOrder = onRequest(
  { cors: true, secrets: [cashfreeClientId, cashfreeClientSecret] },
  async (req, res) => {
    try {
      // 1. Firebase Authentication Verification
      let authUser = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const idToken = authHeader.split("Bearer ")[1];
        try {
          authUser = await auth.verifyIdToken(idToken);
        } catch (authErr) {
          logger.error("Firebase Auth ID Token verification failed", {
            functionName: "createCashfreeOrder",
            error: authErr.message,
          });
        }
      }

      if (!authUser) {
        return res.status(401).json({ error: "Unauthorized: Valid Firebase Auth Bearer token required" });
      }

      const { societyId, maintenanceBillId, residentUid } = req.body || {};

      if (!societyId || !maintenanceBillId || !residentUid) {
        return res.status(400).json({ error: "Missing required fields: societyId, maintenanceBillId, residentUid" });
      }

      // Enforce user ownership match
      if (authUser.uid !== residentUid) {
        logger.warn("Forbidden payment order creation attempt for different user", {
          functionName: "createCashfreeOrder",
          authUserUid: authUser.uid,
          residentUid,
          societyId,
        });
        return res.status(403).json({ error: "Forbidden: You can only create payment orders for your own account" });
      }

      const billRef = db.doc(`societies/${societyId}/maintenance_bills/${maintenanceBillId}`);
      const billDoc = await billRef.get();

      if (!billDoc.exists) {
        return res.status(404).json({ error: "Maintenance bill not found" });
      }

      const billData = billDoc.data();
      if (billData.status === "paid") {
        return res.status(400).json({ error: "Maintenance bill is already paid" });
      }

      const officialAmount = Number(billData.totalAmount || billData.amount || 0);
      if (officialAmount <= 0) {
        return res.status(400).json({ error: "Invalid bill amount" });
      }

      const userDoc = await db.doc(`societies/${societyId}/users/${residentUid}`).get();
      if (!userDoc.exists) {
        return res.status(403).json({ error: "Resident user does not belong to the specified society" });
      }

      const userData = userDoc.data() || {};
      const customerName = userData.name || billData.residentName || "Resident Owner";
      const customerPhone = userData.phone || "9876543210";
      const customerEmail = userData.email || "resident@societysphere.com";

      const orderId = `CF_${societyId}_${maintenanceBillId}_${Date.now()}`;

      // Reuse existing active PENDING payment session if available
      const existingPaymentQuery = await db
        .collection("payments")
        .where("societyId", "==", societyId)
        .where("maintenanceBillId", "==", maintenanceBillId)
        .where("status", "==", "PENDING")
        .limit(1)
        .get();

      if (!existingPaymentQuery.empty) {
        const existingDoc = existingPaymentQuery.docs[0];
        const existingData = existingDoc.data();
        if (existingData.cashfreeOrderId && existingData.cashfreePaymentSessionId) {
          logger.info("Existing active Cashfree payment session reused", {
            functionName: "createCashfreeOrder",
            societyId,
            residentUid,
            maintenanceBillId,
            orderId: existingData.cashfreeOrderId,
          });
          return res.status(200).json({
            status: "SUCCESS",
            orderId: existingData.cashfreeOrderId,
            paymentSessionId: existingData.cashfreePaymentSessionId,
            amount: existingData.amount,
            currency: "INR",
            message: "Existing active payment session reused",
          });
        }
      }

      const cfResult = await CashfreePaymentProvider.createPaymentOrder({
        orderId,
        amount: officialAmount,
        customerId: residentUid,
        customerName,
        customerPhone,
        customerEmail,
      });

      await db.collection("payments").doc(orderId).set({
        cashfreeOrderId: orderId,
        cashfreePaymentId: null,
        cashfreeRefundId: null,
        cashfreePaymentSessionId: cfResult.paymentSessionId,
        societyId,
        maintenanceBillId,
        residentUid,
        amount: officialAmount,
        currency: "INR",
        status: "PENDING",
        webhookVerified: false,
        apiVerified: false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      logger.info("Cashfree order created successfully", {
        functionName: "createCashfreeOrder",
        societyId,
        residentUid,
        maintenanceBillId,
        orderId,
        amount: officialAmount,
      });

      return res.status(200).json({
        status: "SUCCESS",
        orderId: cfResult.cashfreeOrderId,
        paymentSessionId: cfResult.paymentSessionId,
        amount: officialAmount,
        currency: "INR",
      });
    } catch (err) {
      logger.error("createCashfreeOrder error", {
        functionName: "createCashfreeOrder",
        error: err.message,
        stack: err.stack,
      });
      return res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

module.exports = {
  createCashfreeOrder,
};
