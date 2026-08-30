const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const { db, messaging, FieldValue } = require("../config/firebase");

/**
 * Triggers when a domestic helper check-in or check-out log is created.
 * Sends real-time push notification and in-app activity alert to the resident.
 */
const notifyResidentOnHelperLog = onDocumentCreated(
  "societies/{societyId}/helper_logs/{logId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const log = snapshot.data();
    const { societyId, logId } = event.params;

    const flatNumber = log.flatNumber;
    const helperName = log.helperName || "Domestic Staff";
    const helperType = log.helperType || "Maid";
    const isEntry = log.type === "ENTRY";
    const gateName = log.gateName || "Main Gate";
    const residentUid = log.residentUid;

    logger.info("New helper attendance log", {
      societyId,
      logId,
      flatNumber,
      helperName,
      type: log.type,
    });

    // 1. Resolve Resident Users for this flat
    const recipientUids = new Set();
    if (residentUid) {
      recipientUids.add(residentUid);
    }

    if (flatNumber) {
      try {
        const flatUsersSnap = await db
          .collection("users")
          .where("societyId", "==", societyId)
          .where("flatNumber", "==", flatNumber)
          .get();

        flatUsersSnap.forEach((doc) => recipientUids.add(doc.id));
      } catch (err) {
        logger.warn("Could not query flat residents", { error: err.message });
      }
    }

    if (recipientUids.size === 0) {
      logger.info("No resident found to notify for helper log", { flatNumber });
      return;
    }

    const title = isEntry
      ? `🧹 Staff Arrived — Flat ${flatNumber}`
      : `👋 Staff Departed — Flat ${flatNumber}`;
    const body = isEntry
      ? `${helperName} (${helperType}) checked in at ${gateName}.`
      : `${helperName} (${helperType}) checked out from ${gateName}.`;

    const nowIso = new Date().toISOString();
    const promises = [];

    for (const uid of recipientUids) {
      // Create In-App Notification in resident document
      const notifPromise = db
        .collection("societies")
        .doc(societyId)
        .collection("residents")
        .doc(uid)
        .collection("notifications")
        .add({
          title,
          body,
          type: isEntry ? "helper_entry" : "helper_exit",
          helperId: log.helperId || "",
          helperName,
          flatNumber,
          gateName,
          createdAt: nowIso,
          read: false,
        })
        .catch((e) => logger.warn("Error creating in-app helper notif", { uid, error: e.message }));

      promises.push(notifPromise);

      // Send Push Notification via FCM
      const fcmPromise = db
        .collection("users")
        .doc(uid)
        .get()
        .then((userDoc) => {
          if (!userDoc.exists) return null;
          const fcmToken = userDoc.data().fcmToken;
          if (!fcmToken) return null;

          return messaging.send({
            token: fcmToken,
            notification: { title, body },
            data: {
              type: isEntry ? "helper_entry" : "helper_exit",
              helperId: log.helperId || "",
              helperName,
              flatNumber: flatNumber || "",
              societyId,
              click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
            android: {
              priority: "high",
              notification: {
                channelId: "gatelink_resident_doorbell_v3",
                priority: "max",
                sound: "resident_bell",
                defaultSound: false,
                defaultVibrateTimings: true,
                visibility: "public",
              },
            },
          });
        })
        .catch((e) => logger.warn("Error sending helper push FCM", { uid, error: e.message }));

      promises.push(fcmPromise);
    }

    await Promise.allSettled(promises);
    logger.info("Helper attendance notifications dispatched successfully", {
      recipientsCount: recipientUids.size,
    });
  }
);

module.exports = {
  notifyResidentOnHelperLog,
};
