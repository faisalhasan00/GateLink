const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
const { CashfreePaymentProvider } = require("./cashfree_service");

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
 * Notifies security guards and writes audit logs.
 */
exports.notifyGuardOnVisitorDecision = onDocumentUpdated(
  "societies/{societyId}/visitors/{visitorId}",
  async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    const { societyId, visitorId } = event.params;

    if (beforeData.status === afterData.status) return;

    console.log(`Visitor ${visitorId} status changed from ${beforeData.status} to ${afterData.status}`);

    const db = getFirestore();

    // Audit Log Entry
    await db.collection(`societies/${societyId}/audit_logs`).add({
      action: `VISITOR_${afterData.status.toUpperCase()}`,
      targetType: "visitor",
      targetId: visitorId,
      oldStatus: beforeData.status,
      newStatus: afterData.status,
      updatedBy: afterData.approvedBy || afterData.rejectedBy || "system",
      timestamp: FieldValue.serverTimestamp(),
    });
  }
);

/**
 * Triggers when a new amenity booking is created.
 * Dispatches confirmation push & in-app notification to the resident.
 */
exports.notifyResidentOnAmenityBooking = onDocumentCreated(
  "societies/{societyId}/amenity_bookings/{bookingId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const booking = snapshot.data();
    const { societyId, bookingId } = event.params;

    const uid = booking.uid;
    const amenityName = booking.amenityName || "Amenity";
    const date = booking.date || "";
    const timeSlot = booking.timeSlot || "";

    if (!uid) return;

    const db = getFirestore();

    // In-App Notification
    const notifRef = db.collection(`societies/${societyId}/users/${uid}/notifications`).doc();
    await notifRef.set({
      title: "🎉 Amenity Booking Confirmed",
      body: `Your booking for ${amenityName} on ${date} (${timeSlot}) is confirmed!`,
      type: "amenity_booking",
      bookingId: bookingId,
      createdAt: FieldValue.serverTimestamp(),
      read: false,
    });

    // FCM Push Notification if token exists
    const userDoc = await db.doc(`societies/${societyId}/users/${uid}`).get();
    if (userDoc.exists && userDoc.data().fcmToken) {
      const fcmToken = userDoc.data().fcmToken;
      const messaging = getMessaging();
      await messaging.send({
        token: fcmToken,
        notification: {
          title: "🎉 Booking Confirmed",
          body: `${amenityName} on ${date} at ${timeSlot}`,
        },
        data: {
          type: "amenity_booking",
          bookingId: bookingId,
        },
      }).catch((err) => console.error("FCM Error:", err));
    }
  }
);

/**
 * Triggers when a maintenance bill is updated to 'paid'.
 * Dispatches payment receipt push notification, creates in-app notification, and logs audit trail.
 */
exports.notifyResidentOnPaymentSuccess = onDocumentUpdated(
  "societies/{societyId}/maintenance_bills/{billId}",
  async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    const { societyId, billId } = event.params;

    if (beforeData.status !== "paid" && afterData.status === "paid") {
      console.log(`Maintenance bill ${billId} marked as PAID`);

      const db = getFirestore();
      const uid = afterData.residentUid;
      const amount = afterData.amount || afterData.totalAmount || 0;
      const invoiceNumber = afterData.invoiceNumber || billId;

      // 1. Audit Log Entry
      await db.collection(`societies/${societyId}/audit_logs`).add({
        action: "BILL_PAYMENT_SUCCESS",
        targetType: "maintenance_bill",
        targetId: billId,
        amount: amount,
        paidBy: uid || "resident",
        paymentMethod: afterData.paymentMethod || "UPI",
        transactionId: afterData.transactionId || "",
        timestamp: FieldValue.serverTimestamp(),
      });

      if (!uid) return;

      // 2. In-App Notification
      const notifRef = db.collection(`societies/${societyId}/users/${uid}/notifications`).doc();
      await notifRef.set({
        title: "💳 Payment Received",
        body: `Payment of ₹${amount} for Invoice #${invoiceNumber} was successfully processed!`,
        type: "payment_success",
        billId: billId,
        transactionId: afterData.transactionId || "",
        createdAt: FieldValue.serverTimestamp(),
        read: false,
      });

      // 3. FCM Push Notification
      const userDoc = await db.doc(`societies/${societyId}/users/${uid}`).get();
      if (userDoc.exists && userDoc.data().fcmToken) {
        const fcmToken = userDoc.data().fcmToken;
        const messaging = getMessaging();
        await messaging.send({
          token: fcmToken,
          notification: {
            title: "💳 Payment Successful",
            body: `₹${amount} paid for Invoice #${invoiceNumber}`,
          },
          data: {
            type: "payment_success",
            billId: billId,
          },
        }).catch((err) => console.error("FCM Error:", err));
      }
    }
  }
);

/**
 * Triggers when a complaint document is updated (e.g. status changed, comment added, staff assigned).
 * Notifies the resident via FCM push and in-app notification.
 */
exports.notifyResidentOnComplaintUpdate = onDocumentUpdated(
  "societies/{societyId}/complaints/{complaintId}",
  async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    const { societyId, complaintId } = event.params;

    if (beforeData.status === afterData.status && beforeData.assignedTo === afterData.assignedTo) return;

    console.log(`Complaint ${complaintId} updated: status ${beforeData.status} -> ${afterData.status}`);

    const db = getFirestore();
    const uid = afterData.raisedBy;
    const title = afterData.title || "Complaint";
    const newStatus = afterData.status || "Updated";

    // 1. Audit Log Entry
    await db.collection(`societies/${societyId}/audit_logs`).add({
      action: `COMPLAINT_${newStatus.toUpperCase()}`,
      targetType: "complaint",
      targetId: complaintId,
      oldStatus: beforeData.status,
      newStatus: newStatus,
      timestamp: FieldValue.serverTimestamp(),
    });

    if (!uid) return;

    // 2. In-App Notification
    const notifRef = db.collection(`societies/${societyId}/users/${uid}/notifications`).doc();
    await notifRef.set({
      title: `🛠️ Complaint ${newStatus}`,
      body: `Your complaint "${title}" status has been updated to ${newStatus}.`,
      type: "complaint_update",
      complaintId: complaintId,
      createdAt: FieldValue.serverTimestamp(),
      read: false,
    });

    // 3. FCM Push Notification
    const userDoc = await db.doc(`societies/${societyId}/users/${uid}`).get();
    if (userDoc.exists && userDoc.data().fcmToken) {
      const fcmToken = userDoc.data().fcmToken;
      const messaging = getMessaging();
      await messaging.send({
        token: fcmToken,
        notification: {
          title: `🛠️ Complaint ${newStatus}`,
          body: `"${title}" is now ${newStatus}`,
        },
        data: {
          type: "complaint_update",
          complaintId: complaintId,
        },
      }).catch((err) => console.error("FCM Error:", err));
    }
  }
);

/**
 * 1. Centralized Platform API: Create Cashfree Payment Order
 * Server-side bill amount fetching, multi-tenant isolation, and active PENDING order reuse.
 */
exports.createCashfreeOrder = onRequest({ cors: true }, async (req, res) => {
  try {
    const { societyId, billId, residentUid } = req.body || {};
    if (!societyId || !billId || !residentUid) {
      return res.status(400).json({ error: "Missing required parameters: societyId, billId, residentUid" });
    }

    const db = getFirestore();
    const billRef = db.doc(`societies/${societyId}/maintenance_bills/${billId}`);
    const billDoc = await billRef.get();

    if (!billDoc.exists) {
      return res.status(404).json({ error: "Maintenance bill not found" });
    }

    const billData = billDoc.data();
    if (billData.status === "paid") {
      return res.status(400).json({ error: "This bill has already been paid." });
    }

    // Server-side bill amount fetching (never trust client-passed amount)
    const serverAmount = Number(billData.amount || billData.totalAmount || 3500);

    // Reuse existing active PENDING payment order if available
    const existingPayments = await db
      .collection("payments")
      .where("maintenanceBillId", "==", billId)
      .where("status", "==", "PENDING")
      .limit(1)
      .get();

    if (!existingPayments.empty) {
      const existingData = existingPayments.docs[0].data();
      if (existingData.paymentSessionId) {
        console.log(`Reusing existing active Cashfree order ${existingData.cashfreeOrderId} for bill ${billId}`);
        return res.status(200).json({
          status: "SUCCESS",
          orderId: existingData.cashfreeOrderId,
          internalPaymentId: existingData.internalPaymentId,
          paymentSessionId: existingData.paymentSessionId,
          amount: serverAmount,
          currency: "INR",
        });
      }
    }

    const timestamp = Date.now();
    const orderId = `order_${timestamp}_${billId.substring(0, 6)}`;
    const internalPaymentId = `PAY-${timestamp}-${Math.floor(1000 + Math.random() * 9000)}`;

    const userDoc = await db.doc(`societies/${societyId}/users/${residentUid}`).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // Call Cashfree Payment Provider
    const cfResult = await CashfreePaymentProvider.createPaymentOrder({
      orderId: orderId,
      amount: serverAmount,
      customerId: residentUid,
      customerName: userData.name || "Resident",
      customerPhone: userData.phone || "9876543210",
      customerEmail: userData.email || "resident@societysphere.com",
    });

    // Create Payment Record with explicit verification flags
    const paymentRecord = {
      internalPaymentId: internalPaymentId,
      cashfreeOrderId: orderId,
      cashfreePaymentId: null,
      cashfreeRefundId: null,
      societyId: societyId,
      maintenanceBillId: billId,
      residentUid: residentUid,
      flatNumber: userData.flatNumber || billData.flatNumber || "A-101",
      amount: serverAmount,
      currency: "INR",
      status: "PENDING",
      paymentSessionId: cfResult.paymentSessionId,
      webhookVerified: false,
      apiVerified: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await db.collection("payments").doc(internalPaymentId).set(paymentRecord);

    return res.status(200).json({
      status: "SUCCESS",
      orderId: orderId,
      internalPaymentId: internalPaymentId,
      paymentSessionId: cfResult.paymentSessionId,
      amount: serverAmount,
      currency: "INR",
    });
  } catch (err) {
    console.error("createCashfreeOrder error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

/**
 * 2. Secure Offline Payment Endpoint
 * Validates resident tenant access before setting bill to pending_verification.
 */
exports.submitOfflinePayment = onRequest({ cors: true }, async (req, res) => {
  try {
    const { societyId, billId, residentUid, referenceNumber, paymentMethod } = req.body || {};
    if (!societyId || !billId || !residentUid || !referenceNumber) {
      return res.status(400).json({ error: "Missing required parameters: societyId, billId, residentUid, referenceNumber" });
    }

    const db = getFirestore();
    const billRef = db.doc(`societies/${societyId}/maintenance_bills/${billId}`);
    const billDoc = await billRef.get();

    if (!billDoc.exists) {
      return res.status(404).json({ error: "Maintenance bill not found" });
    }

    if (billDoc.data().status === "paid") {
      return res.status(400).json({ error: "This bill has already been paid." });
    }

    const userDoc = await db.doc(`societies/${societyId}/users/${residentUid}`).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const residentName = userData.name || "Resident";
    const flatNumber = userData.flatNumber || billDoc.data().flatNumber || "A-101";

    await billRef.set(
      {
        status: "pending_verification",
        utrNumber: referenceNumber,
        transactionId: referenceNumber,
        paymentMethod: paymentMethod || "Offline Payment",
        submittedAt: new Date().toISOString(),
        residentUid: residentUid,
        residentName: residentName,
        flatNumber: flatNumber,
      },
      { merge: true }
    );

    // Notify Treasurer
    await db.collection(`societies/${societyId}/notifications`).add({
      title: "New Offline Payment Submitted",
      body: `Flat ${flatNumber} (${residentName}) submitted ref ${referenceNumber} for Treasurer verification.`,
      type: "billing_verification",
      billId: billId,
      createdAt: new Date().toISOString(),
      isRead: false,
    });

    return res.status(200).json({
      status: "SUCCESS",
      message: "Offline payment reference submitted for Treasurer verification.",
    });
  } catch (err) {
    console.error("submitOfflinePayment error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

/**
 * 3. Cashfree Webhook Handler
 * 2-Step Verification: HMAC SHA256 Signature + Server-to-Server Cashfree API Query.
 */
exports.cashfreeWebhook = onRequest(async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);

    if (!signature || !timestamp) {
      return res.status(400).send("Missing webhook headers");
    }

    // 1. Signature Verification
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

    // Idempotency: If already SUCCESS, return 200 OK immediately
    if (paymentData.status === "SUCCESS") {
      console.log(`Order ${orderId} already processed as SUCCESS. Skipping.`);
      return res.status(200).send("ALREADY_PROCESSED");
    }

    // Mark webhook verified flag
    await paymentDoc.ref.update({ webhookVerified: true });

    // 2. Server Query Verification (GET /pg/orders/{order_id}/payments)
    const cfVerify = await CashfreePaymentProvider.verifyPaymentWithCashfree(orderId);
    if (!cfVerify.isSuccess) {
      console.warn(`Cashfree API verification failed for ${orderId}: ${cfVerify.reason}`);
      await paymentDoc.ref.update({ status: "FAILED", updatedAt: FieldValue.serverTimestamp() });
      return res.status(200).send("PAYMENT_NOT_SUCCESSFUL");
    }

    // 3. Strict Server Amount & Currency Verification
    if (cfVerify.paymentAmount !== paymentData.amount || cfVerify.paymentCurrency !== "INR") {
      console.error(
        `AMOUNT/CURRENCY MISMATCH! Cashfree=${cfVerify.paymentAmount} ${cfVerify.paymentCurrency}, Expected=${paymentData.amount} INR`
      );
      await paymentDoc.ref.update({ status: "FLAGGED_AMOUNT_MISMATCH", updatedAt: FieldValue.serverTimestamp() });
      return res.status(200).send("AMOUNT_MISMATCH_FLAGGED");
    }

    // 4. Update Payment Record to SUCCESS
    await paymentDoc.ref.update({
      status: "SUCCESS",
      cashfreePaymentId: cfVerify.cashfreePaymentId,
      paymentMethod: cfVerify.paymentMethod,
      apiVerified: true,
      paidAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 5. Update Maintenance Bill to PAID (Triggers notifyResidentOnPaymentSuccess automatically)
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

    console.log(`Payment SUCCESS verified for bill ${billId} via Cashfree payment ${cfVerify.cashfreePaymentId}`);
    return res.status(200).send("OK");
  } catch (err) {
    console.error("cashfreeWebhook error:", err);
    return res.status(500).send("Internal Server Error");
  }
});
