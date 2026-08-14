const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { db, messaging, FieldValue } = require("../config/firebase");
const { CashfreePaymentProvider } = require("../cashfree_service");

const cashfreeClientId = defineSecret("CASHFREE_CLIENT_ID");
const cashfreeClientSecret = defineSecret("CASHFREE_CLIENT_SECRET");

/**
 * 2. Cashfree Webhook Handler
 * SEC-P0 & P1: Atomic Firestore Transaction, Server-to-Server Verification, Idempotent Receipts & FCM Notifications.
 */
const cashfreeWebhook = onRequest(
  { secrets: [cashfreeClientId, cashfreeClientSecret] },
  async (req, res) => {
    try {
      const signature = req.headers["x-webhook-signature"];
      const timestamp = req.headers["x-webhook-timestamp"];
      const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);

      if (!signature || !timestamp) {
        return res.status(400).send("Missing webhook headers");
      }

      const isSigValid = CashfreePaymentProvider.verifyWebhookSignature(rawBody, timestamp, signature);
      if (!isSigValid) {
        logger.error("Cashfree Webhook HMAC SHA256 Signature Verification FAILED!", {
          functionName: "cashfreeWebhook",
        });
        return res.status(401).send("Invalid signature");
      }

      const payload = JSON.parse(rawBody);
      const orderId = payload.data?.order?.order_id || payload.order_id;
      if (!orderId) {
        return res.status(400).send("Missing order_id");
      }

      const paymentRef = db.collection("payments").doc(orderId);
      const paymentDoc = await paymentRef.get();

      if (!paymentDoc.exists) {
        logger.warn("Webhook received for unknown order", {
          functionName: "cashfreeWebhook",
          orderId,
        });
        return res.status(200).send("ORDER_NOT_FOUND");
      }

      const paymentData = paymentDoc.data();
      if (paymentData.status === "SUCCESS") {
        return res.status(200).send("ALREADY_PROCESSED");
      }

      // Server-to-Server Independent API Verification
      const cfVerify = await CashfreePaymentProvider.verifyPaymentWithCashfree(orderId);
      if (!cfVerify.isSuccess) {
        logger.warn("Cashfree API verification failed", {
          functionName: "cashfreeWebhook",
          orderId,
          verificationMessage: cfVerify.message,
        });
        await paymentRef.update({ status: "FAILED", updatedAt: FieldValue.serverTimestamp() });
        return res.status(200).send("PAYMENT_NOT_SUCCESSFUL");
      }

      if (cfVerify.paymentAmount !== paymentData.amount) {
        logger.error("Cashfree payment amount mismatch flagged", {
          functionName: "cashfreeWebhook",
          orderId,
          receivedAmount: cfVerify.paymentAmount,
          expectedAmount: paymentData.amount,
        });
        await paymentRef.update({ status: "FLAGGED_AMOUNT_MISMATCH", updatedAt: FieldValue.serverTimestamp() });
        return res.status(200).send("AMOUNT_MISMATCH_FLAGGED");
      }

      const societyId = paymentData.societyId;
      const billId = paymentData.maintenanceBillId;
      const billRef = db.doc(`societies/${societyId}/maintenance_bills/${billId}`);
      const receiptRef = db.collection("payments").doc(orderId).collection("receipts").doc("receipt_latest");

      // Atomic Transaction for Idempotency
      await db.runTransaction(async (transaction) => {
        const freshPaymentSnap = await transaction.get(paymentRef);
        if (freshPaymentSnap.exists && freshPaymentSnap.data().status === "SUCCESS") {
          return;
        }

        transaction.update(paymentRef, {
          status: "SUCCESS",
          cashfreePaymentId: cfVerify.cashfreePaymentId,
          paymentMethod: cfVerify.paymentMethod,
          webhookVerified: true,
          apiVerified: true,
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
          issuedAt: new Date().toISOString(),
        });
      });

      logger.info("Payment verified and processed atomically", {
        functionName: "cashfreeWebhook",
        orderId,
        societyId,
        maintenanceBillId: billId,
        residentUid: paymentData.residentUid,
      });

      // Dispatch FCM Notification to Resident User
      try {
        const residentUid = paymentData.residentUid;
        const userDoc = await db.doc(`societies/${societyId}/users/${residentUid}`).get();
        const fcmToken = userDoc.exists ? userDoc.data().fcmToken : null;

        if (fcmToken) {
          await messaging.send({
            token: fcmToken,
            notification: {
              title: "Payment Received & Verified",
              body: `Your maintenance bill payment of ₹${paymentData.amount} (Ref: ${cfVerify.cashfreePaymentId}) was confirmed!`,
            },
            data: {
              type: "MAINTENANCE_PAID",
              billId,
              orderId,
            },
          });
        }
      } catch (fcmErr) {
        logger.error("FCM Notification error on payment success", {
          functionName: "cashfreeWebhook",
          orderId,
          societyId,
          error: fcmErr.message,
        });
      }

      return res.status(200).send("OK");
    } catch (err) {
      logger.error("cashfreeWebhook error", {
        functionName: "cashfreeWebhook",
        error: err.message,
        stack: err.stack,
      });
      return res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = {
  cashfreeWebhook,
};
