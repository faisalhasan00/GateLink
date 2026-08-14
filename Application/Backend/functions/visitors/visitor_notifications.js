const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const { db, messaging, FieldValue } = require("../config/firebase");

/**
 * Triggers when a new visitor document is created in Firestore.
 * If the visitor status is 'pending', sends a push notification AND creates an in-app notification.
 */
const notifyResidentOnVisitorArrival = onDocumentCreated(
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

    logger.info("New pending visitor arrival", {
      functionName: "notifyResidentOnVisitorArrival",
      societyId,
      visitorId,
      hostFlat,
      visitorType,
    });

    const residentsQuery = await db
      .collection(`societies/${societyId}/users`)
      .where("flatNumber", "==", hostFlat)
      .where("role", "==", "resident")
      .get();

    if (residentsQuery.empty) {
      logger.warn("No resident found for visitor host flat", {
        functionName: "notifyResidentOnVisitorArrival",
        societyId,
        visitorId,
        hostFlat,
      });
      return;
    }

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
        promises.push(
          messaging.send(message).catch((err) =>
            logger.error("FCM Send Error", {
              functionName: "notifyResidentOnVisitorArrival",
              societyId,
              visitorId,
              residentUid: residentId,
              error: err.message,
            })
          )
        );
      }
    }

    await Promise.all(promises);
    logger.info("Visitor notification dispatch complete", {
      functionName: "notifyResidentOnVisitorArrival",
      societyId,
      visitorId,
    });
  }
);

/**
 * Triggers when a visitor document status changes (e.g., approved/rejected by resident).
 */
const notifyGuardOnVisitorDecision = onDocumentUpdated(
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

    logger.info("Visitor decision status changed", {
      functionName: "notifyGuardOnVisitorDecision",
      societyId,
      visitorId,
      previousStatus: before.status,
      newStatus: status,
    });

    const guardsQuery = await db
      .collection(`societies/${societyId}/users`)
      .where("role", "==", "guard")
      .get();

    if (guardsQuery.empty) return;

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
            .catch((err) =>
              logger.error("FCM Guard Notify Error", {
                functionName: "notifyGuardOnVisitorDecision",
                societyId,
                visitorId,
                guardId: guardDoc.id,
                error: err.message,
              })
            )
        );
      }
    }

    await Promise.all(promises);
  }
);

module.exports = {
  notifyResidentOnVisitorArrival,
  notifyGuardOnVisitorDecision,
};
