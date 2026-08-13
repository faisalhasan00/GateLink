const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { getMessaging } = require("firebase-admin/messaging");
const { CashfreePaymentProvider } = require("./cashfree_service");
const crypto = require("crypto");

initializeApp();

/**
 * Triggers when a new visitor document is created in Firestore.
 * If the visitor status is 'pending', sends a push notification AND creates an in-app notification.
 */
exports.notifyResidentOnVisitorArrival = onDocumentCreated(
  "societies/{societyId}/visitors/{visitorId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const visitor = snapshot.data();
    const { societyId, visitorId } = event.params;

    if (visitor.status !== "pending") return;

    const hostFlat = visitor.hostFlat;
    const visitorName = visitor.name || "Someone";
    const visitorType = visitor.type || "Visitor";

    if (!hostFlat) return;

    console.log(`New pending visitor '${visitorName}' for flat '${hostFlat}' in society '${societyId}'`);

    const db = getFirestore();
    const residentsQuery = await db
      .collection(`societies/${societyId}/users`)
      .where("flatNumber", "==", hostFlat)
      .where("role", "==", "resident")
      .get();

    if (residentsQuery.empty) {
      console.log(`No resident found for flat ${hostFlat}`);
      return;
    }

    const messaging = getMessaging();
    const promises = [];

    for (const residentDoc of residentsQuery.docs) {
      const residentId = residentDoc.id;
      const resident = residentDoc.data();
      const fcmToken = resident.fcmToken;

      // 1. Create In-App Notification document
      const notifRef = db.collection(`societies/${societyId}/users/${residentId}/notifications`).doc();
      promises.push(
        notifRef.set({
          title: "🔔 Visitor at Gate",
          body: `${visitorName} (${visitorType}) is waiting at the gate for your approval.`,
          type: "visitor_pending",
          visitorId: visitorId,
          hostFlat: hostFlat,
          createdAt: FieldValue.serverTimestamp(),
          read: false,
        })
      );

      // 2. Dispatch FCM Push Notification
      if (fcmToken) {
        const message = {
          token: fcmToken,
          notification: {
            title: "🔔 New Visitor Request",
            body: `${visitorName} (${visitorType}) is waiting for Flat ${hostFlat}`,
          },
          data: {
            type: "visitor_pending",
            visitorId: visitorId,
            societyId: societyId,
            hostFlat: hostFlat,
          },
          android: {
            priority: "high",
            notification: {
              channelId: "visitors",
              sound: "default",
              priority: "high",
            },
          },
        };
        promises.push(messaging.send(message).catch((err) => console.error("FCM Send Error:", err)));
      }
    }

    await Promise.all(promises);
    console.log("Visitor notification dispatch complete.");
  }
);

/**
 * Triggers when a visitor document status changes (e.g., approved/rejected by resident).
 */
exports.notifyGuardOnVisitorDecision = onDocumentUpdated(
  "societies/{societyId}/visitors/{visitorId}",
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after) return;

    if (before.status === after.status) return;

    const { societyId, visitorId } = event.params;
    const visitorName = after.name || "Visitor";
    const status = after.status;

    if (status !== "approved" && status !== "denied" && status !== "rejected") return;

    console.log(`Visitor ${visitorId} status changed from ${before.status} to ${status}`);

    const db = getFirestore();
    const guardsQuery = await db
      .collection(`societies/${societyId}/users`)
      .where("role", "==", "guard")
      .get();

    if (guardsQuery.empty) return;

    const messaging = getMessaging();
    const promises = [];
    const title = status === "approved" ? "✅ Entry Approved" : "❌ Entry Denied";
    const body = `Resident has ${status} entry for ${visitorName} (Flat ${after.hostFlat || ""}).`;

    for (const guardDoc of guardsQuery.docs) {
      const fcmToken = guardDoc.data().fcmToken;
      if (fcmToken) {
        promises.push(
          messaging
            .send({
              token: fcmToken,
              notification: { title, body },
              data: { type: "visitor_decision", visitorId, status, societyId },
            })
            .catch((err) => console.error("FCM Guard Notify Error:", err))
        );
      }
    }

    await Promise.all(promises);
  }
);

/**
 * SEC-P0: Trusted Server-Side Visitor Passcode Generation
 * Generates a cryptographically secure 6-digit numeric passcode and 24-hour expiration timestamp.
 */
exports.generateVisitorPasscode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required to generate visitor passcode.");
  }

  const { societyId, name, phone, purpose, hostFlat, expectedDate, expectedTime } = request.data || {};
  if (!societyId || !name || !hostFlat) {
    throw new HttpsError("invalid-argument", "societyId, name, and hostFlat are required.");
  }

  // Cryptographically secure random 6-digit passcode
  const passCode = crypto.randomInt(100000, 999999).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours validity

  const db = getFirestore();
  const visitorRef = db.collection(`societies/${societyId}/visitors`).doc();

  await visitorRef.set({
    name,
    phone: phone || "",
    type: purpose || "Guest",
    hostFlat,
    invitedBy: request.auth.uid,
    expectedDate: expectedDate || now.toISOString().split("T")[0],
    expectedTime: expectedTime || "12:00 PM",
    passCode,
    qrCode: passCode,
    passCodeExpiresAt: expiresAt,
    entryTime: null,
    exitTime: null,
    status: "expected",
    createdAt: now.toISOString(),
  });

  return {
    visitorId: visitorRef.id,
    passCode,
    expiresAt,
  };
});

/**
 * SEC-P0: Atomic Server-Side Visitor Passcode Validation & Entry Scanner
 * Validates passcode, checks 24h expiration, enforces atomic state transition from 'expected' to 'inside'.
 * Prevents passcode replay attacks and concurrent scan race conditions using Firestore Transaction.
 */
exports.validateVisitorPasscode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required to validate visitor passcode.");
  }

  const { societyId, passCode } = request.data || {};
  if (!societyId || !passCode) {
    throw new HttpsError("invalid-argument", "societyId and passCode are required.");
  }

  const db = getFirestore();
  const querySnapshot = await db
    .collection(`societies/${societyId}/visitors`)
    .where("passCode", "==", passCode.trim())
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    return { isValid: false, message: "Invalid visitor passcode." };
  }

  const visitorRef = querySnapshot.docs[0].ref;

  // Execute atomic transaction to prevent replay and concurrent scan race conditions
  return await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(visitorRef);
    if (!doc.exists) {
      return { isValid: false, message: "Visitor record not found." };
    }

    const data = doc.data();

    if (data.status !== "expected") {
      return {
        isValid: false,
        message: `Passcode already used or invalid status: ${data.status.toUpperCase()}`,
      };
    }

    if (data.passCodeExpiresAt) {
      const expiresAt = new Date(data.passCodeExpiresAt);
      if (new Date() > expiresAt) {
        transaction.update(visitorRef, { status: "expired" });
        return { isValid: false, message: "Visitor pass has expired." };
      }
    }

    const nowIso = new Date().toISOString();
    transaction.update(visitorRef, {
      status: "inside",
      entryTime: nowIso,
      scannedByGuardUid: request.auth.uid,
      updatedAt: nowIso,
    });

    return {
      isValid: true,
      visitorId: doc.id,
      name: data.name,
      hostFlat: data.hostFlat,
      type: data.type,
      entryTime: nowIso,
      message: "Passcode verified successfully. Entry granted.",
    };
  });
});

/**
 * SEC-P0: Server-Side Super Admin Custom Claim Assignment
 * Safe Admin SDK endpoint to assign { role: 'super_admin' } custom claims.
 * Client-side self-assignment is strictly blocked.
 */
exports.setSuperAdminRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  // Security check: Only existing super_admin or bootstrap master key allowed
  const callerClaims = request.auth.token || {};
  const isExistingSuperAdmin = callerClaims.role === "super_admin";
  const isBootstrapKeyMatch = request.data.bootstrapKey && request.data.bootstrapKey === process.env.SUPER_ADMIN_BOOTSTRAP_KEY;

  if (!isExistingSuperAdmin && !isBootstrapKeyMatch) {
    throw new HttpsError("permission-denied", "Unauthorized to assign super_admin role.");
  }

  const { targetUid } = request.data || {};
  if (!targetUid) {
    throw new HttpsError("invalid-argument", "targetUid is required.");
  }

  await getAuth().setCustomUserClaims(targetUid, { role: "super_admin" });

  const db = getFirestore();
  await db.doc(`users/${targetUid}`).set({ role: "super_admin", updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  return { success: true, message: `Successfully assigned super_admin claim to user ${targetUid}` };
});

/**
 * 1. Centralized Platform API: Create Cashfree Payment Order
 */
exports.createCashfreeOrder = onRequest({ cors: true }, async (req, res) => {
  try {
    const { societyId, maintenanceBillId, residentUid } = req.body || {};

    if (!societyId || !maintenanceBillId || !residentUid) {
      return res.status(400).json({ error: "Missing required fields: societyId, maintenanceBillId, residentUid" });
    }

    const db = getFirestore();

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
    const userData = userDoc.data() || {};
    const customerName = userData.name || billData.residentName || "Resident Owner";
    const customerPhone = userData.phone || "9876543210";
    const customerEmail = userData.email || "resident@societysphere.com";

    const orderId = `CF_${societyId}_${maintenanceBillId}_${Date.now()}`;

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
      if (existingData.cashfreeOrderId) {
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      status: "SUCCESS",
      orderId: cfResult.cashfreeOrderId,
      paymentSessionId: cfResult.paymentSessionId,
      amount: officialAmount,
      currency: "INR",
    });
  } catch (err) {
    console.error("createCashfreeOrder error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

/**
 * 2. Cashfree Webhook Handler
 */
exports.cashfreeWebhook = onRequest(async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);

    if (!signature || !timestamp) {
      return res.status(400).send("Missing webhook headers");
    }

    const isSigValid = CashfreePaymentProvider.verifyWebhookSignature(rawBody, timestamp, signature);
    if (!isSigValid) {
      console.error("Cashfree Webhook HMAC SHA256 Signature Verification FAILED!");
      return res.status(401).send("Invalid signature");
    }

    const payload = JSON.parse(rawBody);
    const orderId = payload.data?.order?.order_id || payload.order_id;
    if (!orderId) {
      return res.status(400).send("Missing order_id");
    }

    const db = getFirestore();
    const paymentQuery = await db.collection("payments").where("cashfreeOrderId", "==", orderId).limit(1).get();

    if (paymentQuery.empty) {
      console.warn(`Webhook received for unknown order: ${orderId}`);
      return res.status(200).send("ORDER_NOT_FOUND");
    }

    const paymentDoc = paymentQuery.docs[0];
    const paymentData = paymentDoc.data();

    if (paymentData.status === "SUCCESS") {
      return res.status(200).send("ALREADY_PROCESSED");
    }

    await paymentDoc.ref.update({ webhookVerified: true });

    const cfVerify = await CashfreePaymentProvider.verifyPaymentWithCashfree(orderId);
    if (!cfVerify.isSuccess) {
      console.warn(`Cashfree API verification failed for ${orderId}: ${cfVerify.message}`);
      await paymentDoc.ref.update({ status: "FAILED", updatedAt: FieldValue.serverTimestamp() });
      return res.status(200).send("PAYMENT_NOT_SUCCESSFUL");
    }

    if (cfVerify.paymentAmount !== paymentData.amount) {
      console.error(`AMOUNT MISMATCH! Cashfree=${cfVerify.paymentAmount}, Expected=${paymentData.amount}`);
      await paymentDoc.ref.update({ status: "FLAGGED_AMOUNT_MISMATCH", updatedAt: FieldValue.serverTimestamp() });
      return res.status(200).send("AMOUNT_MISMATCH_FLAGGED");
    }

    await paymentDoc.ref.update({
      status: "SUCCESS",
      cashfreePaymentId: cfVerify.cashfreePaymentId,
      paymentMethod: cfVerify.paymentMethod,
      apiVerified: true,
      paidAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const societyId = paymentData.societyId;
    const billId = paymentData.maintenanceBillId;

    await db.doc(`societies/${societyId}/maintenance_bills/${billId}`).set(
      {
        status: "paid",
        paymentMethod: "Cashfree Online",
        transactionId: cfVerify.cashfreePaymentId,
        paidAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.status(200).send("OK");
  } catch (err) {
    console.error("cashfreeWebhook error:", err);
    return res.status(500).send("Internal Server Error");
  }
});
