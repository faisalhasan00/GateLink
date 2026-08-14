const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { db, messaging, FieldValue } = require("../config/firebase");
const { CashfreePaymentProvider } = require("../cashfree_service");

const cashfreeClientId = defineSecret("CASHFREE_CLIENT_ID");
const cashfreeClientSecret = defineSecret("CASHFREE_CLIENT_SECRET");

const RECONCILIATION_BATCH_LIMIT = 50;
const PENDING_AGE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Scheduled Cloud Function: Automatic Payment Reconciliation Worker
 * Runs every 30 minutes to scan for dangling/orphaned PENDING orders older than 15 minutes.
 * Performs independent S2S queries against Cashfree API and reconciles Firestore ledger atomically.
 */
async function processOrderReconciliation(orderDoc, options = {}) {
  const orderId = orderDoc.id;
  const paymentData = orderDoc.data() || {};
  const { isDryRun = false, customS2SVerifier = null } = options;

  if (
    paymentData.status === "SUCCESS" ||
    paymentData.status === "FAILED" ||
    paymentData.status === "OVERPAYMENT_RECORDED" ||
    paymentData.status === "FLAGGED_AMOUNT_MISMATCH"
  ) {
    return { status: paymentData.status, processed: false, reason: "ALREADY_TERMINAL" };
  }

  const societyId = paymentData.societyId;
  const billId = paymentData.maintenanceBillId;
  const paymentRef = db.collection("payments").doc(orderId);
  const billRef = db.doc(`societies/${societyId}/maintenance_bills/${billId}`);
  const receiptRef = db.collection("payments").doc(orderId).collection("receipts").doc("receipt_latest");

  // 1. Query Cashfree S2S API
  const cfVerify = customS2SVerifier
    ? await customS2SVerifier(orderId)
    : await CashfreePaymentProvider.verifyPaymentWithCashfree(orderId);

  // Case C: No payment attempts found yet -> Keep PENDING
  if (!cfVerify.isSuccess) {
    if (cfVerify.message === "No payment attempts found for this order") {
      logger.info("Reconciliation: No payment attempts found yet, leaving as PENDING", {
        functionName: "reconcilePendingPayments",
        orderId,
        societyId,
        maintenanceBillId: billId,
      });
      return { status: "PENDING", processed: true, message: "No attempts found" };
    }

    // Case D: Actual failed payment attempt confirmed by Gateway
    if (!isDryRun) {
      await paymentRef.update({
        status: "FAILED",
        verificationSource: "RECONCILIATION",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    logger.info("Reconciliation: Payment confirmed FAILED", {
      functionName: "reconcilePendingPayments",
      orderId,
      societyId,
      maintenanceBillId: billId,
    });
    return { status: "FAILED", processed: true };
  }

  // Case E: Amount Mismatch Detection
  if (cfVerify.paymentAmount !== paymentData.amount) {
    logger.error("Reconciliation: Amount mismatch detected", {
      functionName: "reconcilePendingPayments",
      orderId,
      expected: paymentData.amount,
      received: cfVerify.paymentAmount,
    });
    if (!isDryRun) {
      await paymentRef.update({
        status: "FLAGGED_AMOUNT_MISMATCH",
        verificationSource: "RECONCILIATION",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    return { status: "FLAGGED_AMOUNT_MISMATCH", processed: true };
  }

  // Case A & B: Atomic Settlement & Overpayment Protection
  let isOverpayment = false;

  if (!isDryRun) {
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
        // Overpayment / Duplicate Order: Preserve original bill settlement
        transaction.update(paymentRef, {
          status: "OVERPAYMENT_RECORDED",
          cashfreePaymentId: cfVerify.cashfreePaymentId,
          paymentMethod: cfVerify.paymentMethod,
          webhookVerified: true,
          apiVerified: true,
          verificationSource: "RECONCILIATION",
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
          verificationSource: "RECONCILIATION",
          issuedAt: new Date().toISOString(),
        });
      } else {
        // Normal Settlement Path
        transaction.update(paymentRef, {
          status: "SUCCESS",
          cashfreePaymentId: cfVerify.cashfreePaymentId,
          paymentMethod: cfVerify.paymentMethod,
          webhookVerified: true,
          apiVerified: true,
          verificationSource: "RECONCILIATION",
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
          verificationSource: "RECONCILIATION",
          issuedAt: new Date().toISOString(),
        });
      }
    });
  }

  logger.info(
    isOverpayment
      ? "Reconciliation: Overpayment recorded"
      : "Reconciliation: Payment confirmed and settled",
    {
      functionName: "reconcilePendingPayments",
      orderId,
      societyId,
      maintenanceBillId: billId,
      residentUid: paymentData.residentUid,
      isOverpayment,
      verificationSource: "RECONCILIATION",
    }
  );

  // Dispatch FCM Notification outside transaction
  try {
    const residentUid = paymentData.residentUid;
    const userDoc = await db.doc(`societies/${societyId}/users/${residentUid}`).get();
    const fcmToken = userDoc.exists ? userDoc.data().fcmToken : null;

    if (fcmToken) {
      if (isOverpayment) {
        await messaging.send({
          token: fcmToken,
          notification: {
            title: "Duplicate Payment Reconciled",
            body: `A payment of ₹${paymentData.amount} (Ref: ${cfVerify.cashfreePaymentId}) for bill ${billId} was reconciled as a duplicate and logged for administrative review.`,
          },
          data: {
            type: "PAYMENT_OVERPAYMENT_RECORDED",
            billId,
            orderId,
          },
        });
      } else {
        await messaging.send({
          token: fcmToken,
          notification: {
            title: "Payment Confirmed via Reconciliation",
            body: `Your maintenance bill payment of ₹${paymentData.amount} (Ref: ${cfVerify.cashfreePaymentId}) was confirmed and settled!`,
          },
          data: {
            type: "MAINTENANCE_PAYMENT_RECONCILED",
            billId,
            orderId,
          },
        });
      }
    }
  } catch (fcmErr) {
    logger.error("FCM Notification error during reconciliation", {
      functionName: "reconcilePendingPayments",
      orderId,
      error: fcmErr.message,
    });
  }

  return {
    status: isOverpayment ? "OVERPAYMENT_RECORDED" : "SUCCESS",
    processed: true,
    isOverpayment,
    cashfreePaymentId: cfVerify.cashfreePaymentId,
  };
}

/**
 * Cloud Function Cron Handler: Runs every 30 minutes
 */
const reconcilePendingPayments = onSchedule(
  {
    schedule: "every 30 minutes",
    secrets: [cashfreeClientId, cashfreeClientSecret],
  },
  async (event) => {
    logger.info("Starting Scheduled Cashfree Payment Reconciliation Job", {
      functionName: "reconcilePendingPayments",
      timestamp: new Date().toISOString(),
    });

    try {
      const thresholdDate = new Date(Date.now() - PENDING_AGE_THRESHOLD_MS);

      const pendingOrdersSnapshot = await db
        .collection("payments")
        .where("status", "==", "PENDING")
        .where("createdAt", "<=", thresholdDate)
        .limit(RECONCILIATION_BATCH_LIMIT)
        .get();

      if (pendingOrdersSnapshot.empty) {
        logger.info("No eligible pending orders found for reconciliation", {
          functionName: "reconcilePendingPayments",
        });
        return;
      }

      logger.info(`Found ${pendingOrdersSnapshot.docs.length} pending orders for reconciliation`, {
        functionName: "reconcilePendingPayments",
        count: pendingOrdersSnapshot.docs.length,
      });

      // Sequential execution to avoid bursting Cashfree API
      let successCount = 0;
      let overpaymentCount = 0;
      let failedCount = 0;
      let pendingCount = 0;
      let errorCount = 0;

      for (const orderDoc of pendingOrdersSnapshot.docs) {
        try {
          const res = await processOrderReconciliation(orderDoc);
          if (res.status === "SUCCESS") successCount++;
          else if (res.status === "OVERPAYMENT_RECORDED") overpaymentCount++;
          else if (res.status === "FAILED") failedCount++;
          else if (res.status === "PENDING") pendingCount++;
        } catch (orderErr) {
          errorCount++;
          logger.error(`Error reconciling order ${orderDoc.id}: ${orderErr.message}`, {
            functionName: "reconcilePendingPayments",
            orderId: orderDoc.id,
            error: orderErr.message,
          });
        }
      }

      logger.info("Scheduled Cashfree Payment Reconciliation Job Completed", {
        functionName: "reconcilePendingPayments",
        totalProcessed: pendingOrdersSnapshot.docs.length,
        successCount,
        overpaymentCount,
        failedCount,
        pendingCount,
        errorCount,
      });
    } catch (err) {
      logger.error(`Reconciliation worker fatal error: ${err.message}`, {
        functionName: "reconcilePendingPayments",
        error: err.message,
        stack: err.stack,
      });
    }
  }
);

module.exports = {
  reconcilePendingPayments,
  processOrderReconciliation,
  RECONCILIATION_BATCH_LIMIT,
  PENDING_AGE_THRESHOLD_MS,
};
