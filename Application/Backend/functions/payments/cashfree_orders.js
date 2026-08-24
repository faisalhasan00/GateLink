const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { db, auth, FieldValue } = require("../config/firebase");
const { verifyActiveUser } = require("../config/auth_middleware");
const { CashfreePaymentProvider } = require("../cashfree_service");

const cashfreeClientId = defineSecret("CASHFREE_CLIENT_ID");
const cashfreeClientSecret = defineSecret("CASHFREE_CLIENT_SECRET");

const allowedOrigins = [
  "https://gatelink.in",
  "https://app.gatelink.in",
  "https://admin.gatelink.in",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

/**
 * 1. Centralized Platform API: Create Cashfree Payment Order
 * SEC-P0 & P1: Hardened with Firebase Auth, Tenant Ownership Verification, Secret Manager bindings, and explicit CORS origin allowlist.
 */
const createCashfreeOrder = onRequest(
  { cors: allowedOrigins, secrets: [cashfreeClientId, cashfreeClientSecret] },
  async (req, res) => {
    try {
      // 1. Authoritative Backend Authentication & User Verification
      const authResult = await verifyActiveUser(req);
      if (!authResult.authenticated) {
        return res.status(authResult.statusCode || 401).json({ error: authResult.error });
      }
      const authUser = authResult.authUser;

      const { societyId, maintenanceBillId, residentUid } = req.body || {};

      if (!societyId || !maintenanceBillId || !residentUid) {
        return res.status(400).json({ error: "Missing required fields: societyId, maintenanceBillId, residentUid" });
      }

      // 2. Tenant Ownership Verification: Validate bill belongs to caller or active society resident
      if (authUser.role === "resident" && authUser.uid !== residentUid) {
        return res.status(403).json({ error: "Forbidden: You can only create payment orders for your own bills." });
      }

      const billRef = db.doc(`societies/${societyId}/maintenance_bills/${maintenanceBillId}`);
      const billDoc = await billRef.get();

      if (!billDoc.exists) {
        return res.status(404).json({ error: "Maintenance bill not found." });
      }

      const billData = billDoc.data();
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

/**
 * 2. Centralized Platform API: On-Demand Cashfree S2S Payment Verification
 * SEC-P0: Authenticated, Tenant Isolated, Direct S2S Query & Atomic Ledger Reconciliation.
 */
const verifyCashfreePaymentStatus = onRequest(
  { cors: allowedOrigins, secrets: [cashfreeClientId, cashfreeClientSecret] },
  async (req, res) => {
    try {
      // 1. Authoritative Backend Authentication & User Verification
      const authResult = await verifyActiveUser(req);
      if (!authResult.authenticated) {
        return res.status(authResult.statusCode || 401).json({ error: authResult.error });
      }
      const authUser = authResult.authUser;

      const { societyId, orderId } = req.body || {};

      if (!societyId || !orderId) {
        return res.status(400).json({ error: "Missing required fields: societyId, orderId" });
      }

      const paymentRef = db.collection("payments").doc(orderId);
      const paymentDoc = await paymentRef.get();

      if (!paymentDoc.exists) {
        return res.status(404).json({ error: "Payment record not found" });
      }

      const paymentData = paymentDoc.data() || {};

      // 2. Authorization & Ownership Checks
      if (paymentData.residentUid !== authUser.uid) {
        logger.warn("Forbidden verify payment attempt for different user", {
          functionName: "verifyCashfreePaymentStatus",
          authUserUid: authUser.uid,
          paymentResidentUid: paymentData.residentUid,
          orderId,
        });
        return res.status(403).json({ error: "Forbidden: You can only verify your own payment orders" });
      }

      if (paymentData.societyId !== societyId) {
        logger.warn("Forbidden verify payment attempt for wrong society", {
          functionName: "verifyCashfreePaymentStatus",
          societyId,
          paymentSocietyId: paymentData.societyId,
          orderId,
        });
        return res.status(403).json({ error: "Forbidden: Society ID mismatch" });
      }

      // 3. Check existing terminal states
      if (paymentData.status === "SUCCESS") {
        return res.status(200).json({
          status: "SUCCESS",
          orderId,
          paymentId: paymentData.cashfreePaymentId,
          amount: paymentData.amount,
          message: "Payment already confirmed",
        });
      }

      if (paymentData.status === "OVERPAYMENT_RECORDED") {
        return res.status(200).json({
          status: "OVERPAYMENT_RECORDED",
          orderId,
          paymentId: paymentData.cashfreePaymentId,
          amount: paymentData.amount,
          message: "Payment recorded as duplicate/overpayment",
        });
      }

      if (paymentData.status === "FLAGGED_AMOUNT_MISMATCH") {
        return res.status(200).json({
          status: "FLAGGED_AMOUNT_MISMATCH",
          orderId,
          amount: paymentData.amount,
          message: "Payment amount could not be verified",
        });
      }

      // 4. Query Cashfree Official API (S2S)
      const cfVerify = await CashfreePaymentProvider.verifyPaymentWithCashfree(orderId);

      if (!cfVerify.isSuccess) {
        // If no payment attempts have been made yet, keep the payment record as PENDING
        if (cfVerify.message === "No payment attempts found for this order") {
          return res.status(200).json({
            status: "PENDING",
            orderId,
            message: "No payment attempt has been recorded yet.",
          });
        }

        await paymentRef.update({
          status: "FAILED",
          updatedAt: FieldValue.serverTimestamp(),
        });
        return res.status(200).json({
          status: "FAILED",
          orderId,
          message: cfVerify.message || "Payment attempt failed or not found",
        });
      }

      // 5. Amount Anti-Tamper Verification
      if (cfVerify.paymentAmount !== paymentData.amount) {
        logger.error("Cashfree S2S payment amount mismatch flagged", {
          functionName: "verifyCashfreePaymentStatus",
          orderId,
          receivedAmount: cfVerify.paymentAmount,
          expectedAmount: paymentData.amount,
        });
        await paymentRef.update({
          status: "FLAGGED_AMOUNT_MISMATCH",
          updatedAt: FieldValue.serverTimestamp(),
        });
        return res.status(200).json({
          status: "FLAGGED_AMOUNT_MISMATCH",
          orderId,
          message: "Payment amount mismatch flagged",
        });
      }

      // 6. Atomic Ledger Reconciliation & Overpayment Guard
      const billId = paymentData.maintenanceBillId;
      const billRef = db.doc(`societies/${societyId}/maintenance_bills/${billId}`);
      const receiptRef = db.collection("payments").doc(orderId).collection("receipts").doc("receipt_latest");

      let isOverpayment = false;

      await db.runTransaction(async (transaction) => {
        const freshPaymentSnap = await transaction.get(paymentRef);
        if (
          freshPaymentSnap.exists &&
          (freshPaymentSnap.data().status === "SUCCESS" ||
            freshPaymentSnap.data().status === "OVERPAYMENT_RECORDED")
        ) {
          return;
        }

        const billSnap = await transaction.get(billRef);
        const isBillAlreadyPaid =
          billSnap.exists && billSnap.data().status === "paid";

        if (isBillAlreadyPaid) {
          isOverpayment = true;
          transaction.update(paymentRef, {
            status: "OVERPAYMENT_RECORDED",
            cashfreePaymentId: cfVerify.cashfreePaymentId,
            paymentMethod: cfVerify.paymentMethod,
            webhookVerified: false,
            apiVerified: true,
            verificationSource: "MANUAL_S2S",
            overpaymentReason: "DUPLICATE_ORDER_ALREADY_PAID",
            originalBillTransactionId: billSnap.data().transactionId || null,
            paidAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });

          transaction.set(receiptRef, {
            orderId,
            cashfreePaymentId: cfVerify.cashfreePaymentId,
            societyId,
            maintenanceBillId: billId,
            residentUid: paymentData.residentUid,
            amount: paymentData.amount,
            currency: "INR",
            paymentMethod: cfVerify.paymentMethod,
            isOverpayment: true,
            overpaymentReason: "DUPLICATE_ORDER_ALREADY_PAID",
            verificationSource: "MANUAL_S2S",
            issuedAt: new Date().toISOString(),
          });
        } else {
          transaction.update(paymentRef, {
            status: "SUCCESS",
            cashfreePaymentId: cfVerify.cashfreePaymentId,
            paymentMethod: cfVerify.paymentMethod,
            webhookVerified: false,
            apiVerified: true,
            verificationSource: "MANUAL_S2S",
            paidAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });

          transaction.set(
            billRef,
            {
              status: "paid",
              paymentMethod: "Cashfree Online",
              transactionId: cfVerify.cashfreePaymentId,
              paidAt: new Date().toISOString(),
            },
            { merge: true }
          );

          transaction.set(receiptRef, {
            orderId,
            cashfreePaymentId: cfVerify.cashfreePaymentId,
            societyId,
            maintenanceBillId: billId,
            residentUid: paymentData.residentUid,
            amount: paymentData.amount,
            currency: "INR",
            paymentMethod: cfVerify.paymentMethod,
            isOverpayment: false,
            verificationSource: "MANUAL_S2S",
            issuedAt: new Date().toISOString(),
          });
        }
      });

      logger.info(
        isOverpayment
          ? "On-Demand verification: Overpayment recorded"
          : "On-Demand verification: Payment confirmed and reconciled",
        {
          functionName: "verifyCashfreePaymentStatus",
          orderId,
          societyId,
          maintenanceBillId: billId,
          residentUid: paymentData.residentUid,
          isOverpayment,
        }
      );

      return res.status(200).json({
        status: isOverpayment ? "OVERPAYMENT_RECORDED" : "SUCCESS",
        orderId,
        paymentId: cfVerify.cashfreePaymentId,
        amount: paymentData.amount,
        isOverpayment,
        message: isOverpayment
          ? "Payment recorded as duplicate/overpayment"
          : "Payment verified successfully",
      });
    } catch (err) {
      logger.error("verifyCashfreePaymentStatus error", {
        functionName: "verifyCashfreePaymentStatus",
        error: err.message,
        stack: err.stack,
      });
      return res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

module.exports = {
  createCashfreeOrder,
  verifyCashfreePaymentStatus,
};
