const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

/**
 * Triggers when a new visitor document is created in Firestore.
 * If the visitor status is 'pending', sends a push notification
 * to the resident of the target flat.
 */
exports.notifyResidentOnVisitorArrival = onDocumentCreated(
  "societies/{societyId}/visitors/{visitorId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data in snapshot.");
      return;
    }

    const visitor = snapshot.data();
    const { societyId } = event.params;

    // Only notify for pending walk-in visitors
    if (visitor.status !== "pending") {
      console.log(`Visitor status is '${visitor.status}', skipping notification.`);
      return;
    }

    const hostFlat = visitor.hostFlat;
    const visitorName = visitor.name || "Someone";
    const visitorType = visitor.type || "Visitor";

    if (!hostFlat) {
      console.log("No hostFlat specified, skipping.");
      return;
    }

    console.log(`New pending visitor '${visitorName}' for flat '${hostFlat}' in society '${societyId}'`);

    // Look up the resident for this flat
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

    // Send notification to all residents of that flat (could be multiple)
    const messaging = getMessaging();
    const sendPromises = [];

    for (const residentDoc of residentsQuery.docs) {
      const resident = residentDoc.data();
      const fcmToken = resident.fcmToken;

      if (!fcmToken) {
        console.log(`Resident ${residentDoc.id} has no FCM token, skipping.`);
        continue;
      }

      const message = {
        token: fcmToken,
        notification: {
          title: "🔔 Visitor at Gate",
          body: `${visitorName} (${visitorType}) is waiting for your approval`,
        },
        data: {
          type: "visitor_pending",
          visitorId: event.params.visitorId,
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

      sendPromises.push(
        messaging
          .send(message)
          .then((response) => {
            console.log(`Notification sent to ${residentDoc.id}: ${response}`);
          })
          .catch((error) => {
            console.error(`Error sending to ${residentDoc.id}:`, error);
          })
      );
    }

    await Promise.all(sendPromises);
    console.log("Notification dispatch complete.");
  }
);
