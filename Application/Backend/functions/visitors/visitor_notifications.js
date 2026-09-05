const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { db, messaging, FieldValue } = require("../config/firebase");

const testVisitorArrivalHttp = onRequest({ cors: true }, async (req, res) => {
  const societyId = req.query.societyId || (req.body && req.body.societyId) || "SOC-KSR543";
  const hostFlat = req.query.hostFlat || (req.body && req.body.hostFlat) || "201";
  const hostResidentUid = req.query.hostResidentUid || (req.body && req.body.hostResidentUid) || "6NwDHQgtfpMVKcWjWfzqTzYjBuq2";
  const name = req.query.name || (req.body && req.body.name) || "Live Test Delivery";

  const nowIso = new Date().toISOString();
  const docRef = await db.collection(`societies/${societyId}/visitors`).add({
    name: name,
    type: "Delivery",
    company: "Zomato",
    hostFlat: hostFlat,
    hostResidentUid: hostResidentUid,
    status: "pending",
    gateName: "Gate 1 — Main Entry",
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  logger.info("Created test visitor via HTTP", { visitorId: docRef.id, societyId, hostFlat, hostResidentUid });
  res.json({ success: true, visitorId: docRef.id, societyId, hostFlat, hostResidentUid });
});

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

    function normalizeFlat(s) {
      if (!s) return "";
      return s
        .toLowerCase()
        .replace(/block/g, "")
        .replace(/tower/g, "")
        .replace(/flat/g, "")
        .replace(/unit/g, "")
        .replace(/apt/g, "")
        .replace(/apartment/g, "")
        .replace(/[^a-z0-9]/g, "");
    }

    const cleanHostFlat = normalizeFlat(hostFlat);
    const hostResidentUid = visitor.hostResidentUid;
    const residentDocs = [];

    // 1. Direct hostResidentUid lookup
    if (hostResidentUid) {
      try {
        const rootUser = await db.doc(`users/${hostResidentUid}`).get();
        if (rootUser.exists) residentDocs.push({ id: rootUser.id, ...rootUser.data() });
      } catch (_) {}

      try {
        const subUser = await db.doc(`societies/${societyId}/users/${hostResidentUid}`).get();
        if (subUser.exists && !residentDocs.some(r => r.id === subUser.id)) {
          residentDocs.push({ id: subUser.id, ...subUser.data() });
        }
      } catch (_) {}
    }

    // 2. Query all residents in society matching hostFlat with normalized matching
    if (cleanHostFlat) {
      try {
        const subUsers = await db.collection(`societies/${societyId}/users`).get();
        subUsers.docs.forEach(doc => {
          const data = doc.data();
          const userFlat = normalizeFlat(data.flatNumber);
          if (userFlat && (userFlat === cleanHostFlat || userFlat.includes(cleanHostFlat) || cleanHostFlat.includes(userFlat))) {
            if (!residentDocs.some(r => r.id === doc.id)) {
              residentDocs.push({ id: doc.id, ...data });
            }
          }
        });
      } catch (_) {}

      try {
        const rootUsers = await db.collection("users").where("societyId", "==", societyId).get();
        rootUsers.docs.forEach(doc => {
          const data = doc.data();
          const userFlat = normalizeFlat(data.flatNumber);
          if (userFlat && (userFlat === cleanHostFlat || userFlat.includes(cleanHostFlat) || cleanHostFlat.includes(userFlat))) {
            if (!residentDocs.some(r => r.id === doc.id)) {
              residentDocs.push({ id: doc.id, ...data });
            }
          }
        });
      } catch (_) {}
    }

    if (residentDocs.length === 0) {
      logger.warn("No resident found for visitor host flat", {
        functionName: "notifyResidentOnVisitorArrival",
        societyId,
        visitorId,
        hostFlat,
        hostResidentUid,
      });
      return;
    }

    const promises = [];

    for (const resident of residentDocs) {
      const residentId = resident.id;
      const fcmToken = resident.fcmToken;

      // 1. Create In-App Notification document
      const notifData = {
        title: "🔔 Visitor at Gate",
        body: `${visitorName} (${visitorType}) is waiting at the gate for your approval.`,
        type: "visitor_pending",
        visitorId: visitorId,
        hostFlat: hostFlat,
        createdAt: FieldValue.serverTimestamp(),
        read: false,
      };

      promises.push(
        db.collection(`societies/${societyId}/users/${residentId}/notifications`).add(notifData)
      );
      // 2. Dispatch High-Priority Push Notification for Doorbell Alert
      if (fcmToken) {
        const message = {
          token: fcmToken,
          notification: {
            title: `🚪 Visitor at Gate — Flat ${hostFlat}`,
            body: `${visitorName} (${visitorType}) is waiting for your entry approval.`,
          },
          data: {
            type: "visitor_pending",
            title: `🚪 Visitor at Gate — Flat ${hostFlat}`,
            body: `${visitorName} (${visitorType}) is waiting for your entry approval.`,
            visitorId: visitorId,
            societyId: societyId,
            hostFlat: hostFlat,
            visitorName: visitorName,
            visitorType: visitorType,
            company: visitor.company || visitor.deliveryCompany || visitor.vendor || "",
            vehicleNumber: visitor.vehicleNumber || visitor.vehicleNo || visitor.plateNumber || "",
            gateName: visitor.gateName || "Main Gate",
            photoUrl: visitor.photoUrl || visitor.imageUrl || visitor.avatar || "",
            createdAt: visitor.createdAt || new Date().toISOString(),
            click_action: "FLUTTER_NOTIFICATION_CLICK",
          },
          android: {
            priority: "high",
            notification: {
              channelId: "gatelink_resident_doorbell_v5",
              priority: "max",
              sound: "resident_bell",
              defaultSound: false,
              defaultVibrateTimings: true,
              visibility: "public",
            },
          },
        };

        promises.push(
          messaging
            .send(message)
            .then((res) => {
              logger.info("FCM push notification sent successfully", {
                functionName: "notifyResidentOnVisitorArrival",
                residentId,
                visitorId,
                messageId: res,
              });
            })
            .catch((err) => {
              logger.error("Failed to send FCM push notification", {
                functionName: "notifyResidentOnVisitorArrival",
                residentId,
                error: err.message,
              });
            })
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
              data: {
                type: status === "approved" ? "visitor_approved" : "visitor_rejected",
                visitorId,
                status,
                societyId,
                visitorName,
                hostFlat: after.hostFlat || "",
                click_action: "FLUTTER_NOTIFICATION_CLICK",
              },
              android: {
                priority: "high",
                notification: {
                  channelId: "gatelink_guard_alarm_v3",
                  priority: "max",
                  sound: "guard_alert",
                  defaultSound: false,
                  defaultVibrateTimings: true,
                  visibility: "public",
                },
              },
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
  testVisitorArrivalHttp,
};
