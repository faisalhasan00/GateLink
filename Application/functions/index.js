const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

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
