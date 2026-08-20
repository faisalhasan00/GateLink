const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const { db, messaging, FieldValue } = require("../config/firebase");

/**
 * Triggers when a new notice is published in a society.
 * Broadcasts a high-priority push notification to all residents & guards of that society.
 */
const notifyOnNoticeCreated = onDocumentCreated(
  "societies/{societyId}/notices/{noticeId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const notice = snapshot.data();
    const { societyId, noticeId } = event.params;

    const title = notice.title || "New Society Notice";
    const body = notice.body || "A new official notice has been posted.";
    const category = notice.category || "General";

    const categoryIcon = category === "Emergency" ? "🚨" : category === "Maintenance" ? "🔧" : "📢";
    const formattedTitle = `${categoryIcon} ${title}`;

    logger.info("New notice published, broadcasting push notification", {
      societyId,
      noticeId,
      title,
      category,
    });

    const tokens = new Set();

    try {
      // 1. Query root /users where societyId matches
      const rootUsersSnap = await db.collection("users").where("societyId", "==", societyId).get();
      rootUsersSnap.docs.forEach((docSnap) => {
        const u = docSnap.data();
        if (u.fcmToken && typeof u.fcmToken === "string" && u.fcmToken.trim().length > 10) {
          tokens.add(u.fcmToken.trim());
        }
      });

      // 2. Query subcollection /societies/{societyId}/users
      const subUsersSnap = await db.collection(`societies/${societyId}/users`).get();
      subUsersSnap.docs.forEach((docSnap) => {
        const u = docSnap.data();
        if (u.fcmToken && typeof u.fcmToken === "string" && u.fcmToken.trim().length > 10) {
          tokens.add(u.fcmToken.trim());
        }
      });

      // 3. Query subcollection /societies/{societyId}/guards
      const guardsSnap = await db.collection(`societies/${societyId}/guards`).get();
      guardsSnap.docs.forEach((docSnap) => {
        const g = docSnap.data();
        if (g.fcmToken && typeof g.fcmToken === "string" && g.fcmToken.trim().length > 10) {
          tokens.add(g.fcmToken.trim());
        }
      });

      const tokenList = Array.from(tokens);
      if (tokenList.length === 0) {
        logger.warn("No active FCM tokens found in society for notice broadcast", { societyId });
        return;
      }

      logger.info(`Dispatching notice push to ${tokenList.length} devices`, { societyId });

      const messages = tokenList.map((token) => ({
        token,
        notification: {
          title: formattedTitle,
          body,
        },
        data: {
          type: "notice",
          category,
          societyId,
          noticeId,
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        android: {
          priority: "high",
          notification: {
            channelId: "gate_security_channel",
            notificationPriority: "PRIORITY_MAX",
            defaultSound: true,
            defaultVibrateTimings: true,
            visibility: "PUBLIC",
          },
        },
      }));

      // Send multicast batch
      const response = await messaging.sendEach(messages);
      logger.info("Notice push broadcast complete", {
        societyId,
        successCount: response.successCount,
        failureCount: response.failureCount,
      });
    } catch (err) {
      logger.error("Error in notifyOnNoticeCreated function:", err);
    }
  }
);

/**
 * Triggers when a Super Admin or Society Admin publishes a platform broadcast.
 */
const notifyOnBroadcastCreated = onDocumentCreated(
  "broadcasts/{broadcastId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const broadcast = snapshot.data();
    const { broadcastId } = event.params;

    const title = broadcast.title || "GateLink Announcement";
    const body = broadcast.body || "New update available on GateLink.";
    const category = broadcast.category || "offer";
    const scope = broadcast.scope || "all";
    const targetSocietyId = broadcast.societyId || "";

    const categoryIcon = category === "offer" ? "🎁" : category === "emergency" ? "🚨" : category === "update" ? "⚡" : "📢";
    const formattedTitle = `${categoryIcon} ${title}`;

    logger.info("New platform broadcast created", {
      broadcastId,
      title,
      scope,
      category,
      targetSocietyId,
    });

    const tokens = new Set();

    try {
      let queryRef;
      if (scope === "society" && targetSocietyId) {
        queryRef = db.collection("users").where("societyId", "==", targetSocietyId);
      } else if (scope === "residents") {
        queryRef = db.collection("users").where("role", "==", "resident");
      } else if (scope === "guards") {
        queryRef = db.collection("users").where("role", "==", "guard");
      } else {
        queryRef = db.collection("users");
      }

      const usersSnap = await queryRef.get();
      usersSnap.docs.forEach((docSnap) => {
        const u = docSnap.data();
        if (u.fcmToken && typeof u.fcmToken === "string" && u.fcmToken.trim().length > 10) {
          tokens.add(u.fcmToken.trim());
        }
      });

      const tokenList = Array.from(tokens);
      if (tokenList.length === 0) {
        logger.warn("No active FCM tokens found for platform broadcast", { scope });
        return;
      }

      logger.info(`Broadcasting platform message to ${tokenList.length} devices`, { scope });

      const messages = tokenList.map((token) => ({
        token,
        notification: {
          title: formattedTitle,
          body,
        },
        data: {
          type: category,
          broadcastId,
          scope,
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        android: {
          priority: "high",
          notification: {
            channelId: "gate_security_channel",
            notificationPriority: "PRIORITY_MAX",
            defaultSound: true,
            defaultVibrateTimings: true,
            visibility: "PUBLIC",
          },
        },
      }));

      const response = await messaging.sendEach(messages);
      logger.info("Platform broadcast complete", {
        broadcastId,
        successCount: response.successCount,
        failureCount: response.failureCount,
      });

      // Update broadcast doc with delivery count
      await snapshot.ref.update({
        deliveredCount: response.successCount,
        failedCount: response.failureCount,
        deliveredAt: FieldValue.serverTimestamp(),
      });
    } catch (err) {
      logger.error("Error in notifyOnBroadcastCreated function:", err);
    }
  }
);

module.exports = {
  notifyOnNoticeCreated,
  notifyOnBroadcastCreated,
};
