const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const { db, auth, FieldValue } = require("../config/firebase");
const { verifyActiveCallableUser } = require("../config/auth_middleware");

const ALLOWED_DELETION_ROLES = ["resident", "guard", "security", "staff"];
const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000; // 7-day grace period in milliseconds

/**
 * SEC-P0: Request Account Deletion (Self-Service)
 * 1. Authenticates caller & enforces target user == request.auth.uid
 * 2. Reads trusted role & societyId from Firestore /users/{uid}
 * 3. Soft-deactivates user account (status = 'deactivated', clears FCM token)
 * 4. Revokes Firebase refresh tokens immediately (auth.revokeRefreshTokens)
 * 5. Queues request in /account_deletion_requests/{requestId} for 7-day grace period
 */
const requestAccountDeletion = onCall(
  { cors: true, enforceAppCheck: process.env.ENFORCE_APP_CHECK === "true" },
  async (request) => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }

    const uid = request.auth.uid;

    // Strict security check: Prevent requesting deletion for another user
    if (request.data && request.data.targetUid && request.data.targetUid !== uid) {
      logger.warn("Security violation: Attempt to request deletion for another user", {
        callerUid: uid,
        targetUid: request.data.targetUid,
      });
      throw new HttpsError("permission-denied", "You can only request account deletion for your own account.");
    }

    // Read trusted user record from /users/{uid}
    const userDocRef = db.doc(`users/${uid}`);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User account record not found.");
    }

    const userData = userDoc.data() || {};
    const userRole = (userData.role || "resident").toLowerCase().trim();
    const societyId = userData.societyId || "";

    if (!ALLOWED_DELETION_ROLES.includes(userRole)) {
      logger.warn("Self-service deletion rejected for administrative role", {
        uid,
        userRole,
      });
      throw new HttpsError(
        "permission-denied",
        "Administrative accounts cannot be self-deleted via mobile request. Please contact Super Admin."
      );
    }

    // Check for existing pending request (Idempotency)
    const existingRequests = await db
      .collection("account_deletion_requests")
      .where("userId", "==", uid)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existingRequests.empty) {
      const existingDoc = existingRequests.docs[0];
      const existingData = existingDoc.data();
      logger.info("Account deletion request already pending (Idempotent response)", {
        uid,
        requestId: existingDoc.id,
      });

      return {
        success: true,
        idempotent: true,
        requestId: existingDoc.id,
        scheduledDeletionAt: existingData.scheduledDeletionAt,
        message: "Account deletion request is already pending.",
      };
    }

    const timestamp = FieldValue.serverTimestamp();
    const nowMs = Date.now();
    const scheduledDeletionAt = new Date(nowMs + GRACE_PERIOD_MS).toISOString();
    const requestId = `DEL_REQ_${uid}`;
    const createdVia = request.data?.createdVia === "web" ? "web" : "app";

    const requestPayload = {
      requestId,
      userId: uid,
      userRole,
      societyId,
      status: "pending",
      createdVia,
      requestedAt: timestamp,
      scheduledDeletionAt,
      cancelledAt: null,
      processedAt: null,
      failureReason: null,
      retryCount: 0,
    };

    const batch = db.batch();

    // 1. Write deletion request record
    batch.set(db.doc(`account_deletion_requests/${requestId}`), requestPayload, { merge: true });

    // 2. Soft-deactivate user in root /users/{uid} & clear FCM token
    batch.set(
      userDocRef,
      {
        status: "deactivated",
        fcmToken: "",
        updatedAt: timestamp,
      },
      { merge: true }
    );

    // 3. Soft-deactivate user in society sub-collection /societies/{societyId}/users/{uid}
    if (societyId) {
      const societyUserRef = db.doc(`societies/${societyId}/users/${uid}`);
      batch.set(
        societyUserRef,
        {
          status: "deactivated",
          fcmToken: "",
          updatedAt: timestamp,
        },
        { merge: true }
      );

      // If user is a security guard, also deactivate guard doc
      if (userRole === "guard" || userRole === "security") {
        const guardRef = db.doc(`societies/${societyId}/guards/${uid}`);
        batch.set(
          guardRef,
          {
            status: "deactivated",
            fcmToken: "",
            gateAssigned: null,
            updatedAt: timestamp,
          },
          { merge: true }
        );
      }
    }

    await batch.commit();

    // 4. Revoke Firebase refresh tokens to immediately block further authenticated calls
    try {
      await auth.revokeRefreshTokens(uid);
      logger.info("Successfully revoked Firebase refresh tokens for deactivated user", { uid });
    } catch (tokenErr) {
      logger.warn("Non-fatal token revocation warning", { uid, error: tokenErr.message });
    }

    logger.info("Account deletion request logged and user soft-deactivated", {
      uid,
      requestId,
      userRole,
      societyId,
    });

    return {
      success: true,
      requestId,
      scheduledDeletionAt,
      message: "Account deletion request submitted. Account soft-deactivated for 7-day grace period.",
    };
  }
);

/**
 * SEC-P0: Cancel Account Deletion (Self-Service)
 * 1. Authenticates caller & verifies target userId == request.auth.uid
 * 2. Checks if pending deletion request exists and scheduledDeletionAt > now
 * 3. Restores user status to 'active'
 * 4. Sets request status to 'cancelled'
 */
const cancelAccountDeletion = onCall(
  { cors: true, enforceAppCheck: process.env.ENFORCE_APP_CHECK === "true" },
  async (request) => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }

    const uid = request.auth.uid;

    if (request.data && request.data.targetUid && request.data.targetUid !== uid) {
      throw new HttpsError("permission-denied", "You can only cancel your own account deletion request.");
    }

    const pendingRequests = await db
      .collection("account_deletion_requests")
      .where("userId", "==", uid)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (pendingRequests.empty) {
      throw new HttpsError("not-found", "No pending deletion request found for this account.");
    }

    const requestDoc = pendingRequests.docs[0];
    const requestData = requestDoc.data();
    const scheduledAtMs = new Date(requestData.scheduledDeletionAt).getTime();

    if (Date.now() > scheduledAtMs) {
      logger.warn("Attempt to cancel deletion after grace period expired", {
        uid,
        requestId: requestDoc.id,
      });
      throw new HttpsError(
        "failed-precondition",
        "Grace period has expired. Account deletion can no longer be cancelled."
      );
    }

    const userDocRef = db.doc(`users/${uid}`);
    const userDoc = await userDocRef.get();
    const userData = userDoc.exists ? userDoc.data() || {} : {};
    const societyId = userData.societyId || requestData.societyId || "";
    const userRole = (userData.role || requestData.userRole || "").toLowerCase();
    const timestamp = FieldValue.serverTimestamp();

    const batch = db.batch();

    // 1. Update request status to 'cancelled'
    batch.set(
      requestDoc.ref,
      {
        status: "cancelled",
        cancelledAt: timestamp,
      },
      { merge: true }
    );

    // 2. Restore user status to 'active' in root /users/{uid}
    batch.set(
      userDocRef,
      {
        status: "active",
        updatedAt: timestamp,
      },
      { merge: true }
    );

    // 3. Restore user status in society sub-collection
    if (societyId) {
      batch.set(
        db.doc(`societies/${societyId}/users/${uid}`),
        {
          status: "active",
          updatedAt: timestamp,
        },
        { merge: true }
      );

      if (userRole === "guard" || userRole === "security") {
        batch.set(
          db.doc(`societies/${societyId}/guards/${uid}`),
          {
            status: "active",
            updatedAt: timestamp,
          },
          { merge: true }
        );
      }
    }

    await batch.commit();

    logger.info("Account deletion request successfully cancelled", {
      uid,
      requestId: requestDoc.id,
    });

    return {
      success: true,
      requestId: requestDoc.id,
      message: "Account deletion request cancelled. Account access restored to active.",
    };
  }
);

/**
 * Worker helper to process a single account deletion request safely.
 * DEFAULT MODE: DRY-RUN ENABLED (No real deletions occur unless explicitly disabled).
 */
async function processSingleAccountDeletion(requestDoc, options = {}) {
  const isDryRun = options.isDryRun !== false && process.env.ACCOUNT_DELETION_DRY_RUN !== "false";
  const requestData = requestDoc.data() || {};
  const { requestId, userId, userRole, societyId, scheduledDeletionAt, status } = requestData;

  // 1. Safety Verifications
  if (!requestId || !userId || !userRole) {
    logger.error("Account deletion request failed safety verification: Missing critical fields", { requestId });
    await requestDoc.ref.set(
      {
        status: "failed",
        failureReason: "Safety verification failed: Missing required fields.",
        retryCount: (requestData.retryCount || 0) + 1,
        lastAttemptAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { success: false, requestId, reason: "Missing required fields" };
  }

  if (status !== "pending") {
    logger.warn("Skipping account deletion request that is no longer pending", { requestId, status });
    return { success: false, requestId, reason: `Request status is '${status}', not 'pending'` };
  }

  const scheduledAtMs = new Date(scheduledDeletionAt).getTime();
  if (Date.now() < scheduledAtMs) {
    logger.info("Skipping request whose grace period has not yet expired", { requestId, scheduledDeletionAt });
    return { success: false, requestId, reason: "Grace period has not expired" };
  }

  const userDocRef = db.doc(`users/${userId}`);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    logger.error("Safety verification failed: User document does not exist", { userId, requestId });
    await requestDoc.ref.set(
      {
        status: "failed",
        failureReason: "Safety verification failed: Target user document not found.",
        retryCount: (requestData.retryCount || 0) + 1,
        lastAttemptAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { success: false, requestId, reason: "User document not found" };
  }

  const userData = userDoc.data() || {};
  const currentStatus = (userData.status || "").toLowerCase();

  if (currentStatus !== "deactivated") {
    logger.error("Safety verification failed: User status is not deactivated", { userId, currentStatus });
    await requestDoc.ref.set(
      {
        status: "failed",
        failureReason: `Safety verification failed: Account status is '${currentStatus}', expected 'deactivated'.`,
        retryCount: (requestData.retryCount || 0) + 1,
        lastAttemptAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { success: false, requestId, reason: "User status not deactivated" };
  }

  // 2. Dry-Run Mode Execution (Default)
  if (isDryRun) {
    const dryRunPlan = {
      userId,
      userRole,
      societyId: societyId || userData.societyId || "",
      documentsToKeep: [
        "/payments/*",
        societyId ? `/societies/${societyId}/maintenance_bills/*` : "/maintenance_bills/*",
        societyId ? `/societies/${societyId}/audit_logs/*` : "/audit_logs/*",
      ],
      documentsToDelete: [
        `/users/${userId}`,
        societyId ? `/societies/${societyId}/users/${userId}` : null,
        societyId ? `/societies/${societyId}/users/${userId}/notifications/*` : null,
        societyId ? `/societies/${societyId}/users/${userId}/activity_logs/*` : null,
        (userRole === "guard" || userRole === "security") && societyId ? `/societies/${societyId}/guards/${userId}` : null,
      ].filter(Boolean),
      documentsToAnonymize: [
        societyId ? `/societies/${societyId}/visitors/*` : null,
        societyId ? `/societies/${societyId}/complaints/*` : null,
        societyId ? `/societies/${societyId}/amenity_bookings/*` : null,
        societyId ? `/societies/${societyId}/sos_alerts/*` : null,
        societyId ? `/societies/${societyId}/parking/*` : null,
        societyId ? `/societies/${societyId}/helpers/*` : null,
      ].filter(Boolean),
      storageFilesToDelete: [
        `profile_photos/${userId}.jpg`,
        societyId ? `societies/${societyId}/registrations/${userId}/*` : null,
      ].filter(Boolean),
      firebaseAuthToDelete: userId,
    };

    logger.info("DRY-RUN DELETION PLAN GENERATED (No production data modified)", {
      requestId,
      dryRunPlan,
    });

    await requestDoc.ref.set(
      {
        dryRunPlan,
        lastAttemptAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Audit log entry for dry-run
    await db.collection("system_audit_logs").add({
      requestId,
      userId,
      role: userRole,
      societyId: societyId || "",
      action: "account_deletion_dry_run",
      timestamp: FieldValue.serverTimestamp(),
      result: "dry_run_plan_generated",
      dryRun: true,
    });

    return {
      success: true,
      isDryRun: true,
      requestId,
      plan: dryRunPlan,
    };
  }

  // 3. Destructive Production Execution Mode (Requires ACCOUNT_DELETION_DRY_RUN="false")
  logger.warn("EXECUTING DESTRUCTIVE PRODUCTION ACCOUNT ERASURE", { requestId, userId });

  await requestDoc.ref.set(
    {
      status: "processing",
      lastAttemptAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  try {
    // 3.1 Anonymize referential records in society
    if (societyId) {
      const batchAnonymize = db.batch();

      // Visitors
      const visitorsSnap = await db
        .collection(`societies/${societyId}/visitors`)
        .where("hostResidentUid", "==", userId)
        .get();
      visitorsSnap.forEach((doc) => {
        batchAnonymize.update(doc.ref, {
          hostResidentUid: "DELETED_USER",
          invitedBy: "DELETED_USER",
          createdBy: "DELETED_USER",
        });
      });

      // Complaints
      const complaintsSnap = await db
        .collection(`societies/${societyId}/complaints`)
        .where("raisedBy", "==", userId)
        .get();
      complaintsSnap.forEach((doc) => {
        batchAnonymize.update(doc.ref, {
          raisedBy: "DELETED_USER",
          residentUid: "DELETED_USER",
        });
      });

      // Amenity Bookings
      const bookingsSnap = await db
        .collection(`societies/${societyId}/amenity_bookings`)
        .where("uid", "==", userId)
        .get();
      bookingsSnap.forEach((doc) => {
        batchAnonymize.update(doc.ref, { uid: "DELETED_USER" });
      });

      // SOS Alerts
      const sosSnap = await db
        .collection(`societies/${societyId}/sos_alerts`)
        .where("residentUid", "==", userId)
        .get();
      sosSnap.forEach((doc) => {
        batchAnonymize.update(doc.ref, {
          residentUid: "DELETED_USER",
          userId: "DELETED_USER",
          triggeredBy: "DELETED_USER",
        });
      });

      // Parking Slots
      const parkingSnap = await db
        .collection(`societies/${societyId}/parking`)
        .where("assignedTo", "==", userId)
        .get();
      parkingSnap.forEach((doc) => {
        batchAnonymize.update(doc.ref, {
          assignedTo: null,
          residentUid: null,
          uid: null,
          status: "available",
        });
      });

      // Helpers
      const helpersSnap = await db
        .collection(`societies/${societyId}/helpers`)
        .where("residentUid", "==", userId)
        .get();
      helpersSnap.forEach((doc) => {
        batchAnonymize.update(doc.ref, {
          residentUid: null,
          uid: null,
        });
      });

      await batchAnonymize.commit();
    }

    // 3.2 Erase Firestore user documents
    const eraseBatch = db.batch();
    eraseBatch.delete(userDocRef);

    if (societyId) {
      eraseBatch.delete(db.doc(`societies/${societyId}/users/${userId}`));
      if (userRole === "guard" || userRole === "security") {
        eraseBatch.delete(db.doc(`societies/${societyId}/guards/${userId}`));
      }
    }
    await eraseBatch.commit();

    // 3.3 Erase Firebase Auth user
    try {
      await auth.deleteUser(userId);
    } catch (authErr) {
      logger.error("Firebase Auth user deletion failed", { userId, error: authErr.message });
      throw new Error(`Firebase Auth deletion failed: ${authErr.message}`);
    }

    // 3.4 Mark request completed
    await requestDoc.ref.set(
      {
        status: "completed",
        processedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Audit log entry for destructive execution
    await db.collection("system_audit_logs").add({
      requestId,
      userId,
      role: userRole,
      societyId: societyId || "",
      action: "account_deletion_execution",
      timestamp: FieldValue.serverTimestamp(),
      result: "completed",
      dryRun: false,
    });

    logger.info("Successfully executed account deletion pipeline", { requestId, userId });

    return { success: true, isDryRun: false, requestId };
  } catch (err) {
    logger.error("Account deletion execution failed", { requestId, userId, error: err.message });
    await requestDoc.ref.set(
      {
        status: "failed",
        failureReason: err.message,
        retryCount: (requestData.retryCount || 0) + 1,
        lastAttemptAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { success: false, requestId, error: err.message };
  }
}

/**
 * SEC-P0 & DPDP Compliance: Scheduled Account Deletion Worker
 * Runs daily to process account deletion requests whose 7-day grace period has elapsed.
 * Default mode: DRY-RUN ENABLED (ACCOUNT_DELETION_DRY_RUN !== "false").
 * Destructive execution requires ACCOUNT_DELETION_DRY_RUN="false".
 */
const processScheduledAccountDeletion = onSchedule(
  {
    schedule: "0 3 * * *", // Daily at 03:00 UTC
    timeZone: "UTC",
    retryCount: 1,
  },
  async (event) => {
    logger.info("Starting scheduled account deletion worker task");
    const isDryRun = process.env.ACCOUNT_DELETION_DRY_RUN !== "false";

    if (isDryRun) {
      logger.info("ACCOUNT DELETION WORKER RUNNING IN SAFE DRY-RUN MODE (No data will be deleted)");
    } else {
      logger.warn("ACCOUNT DELETION WORKER RUNNING IN DESTRUCTIVE PRODUCTION MODE");
    }

    const nowIso = new Date().toISOString();
    const pendingRequestsSnap = await db
      .collection("account_deletion_requests")
      .where("status", "==", "pending")
      .where("scheduledDeletionAt", "<=", nowIso)
      .get();

    logger.info(`Found ${pendingRequestsSnap.size} pending account deletion request(s) eligible for processing`);

    const summary = {
      totalFound: pendingRequestsSnap.size,
      processedCount: 0,
      failedCount: 0,
      isDryRun,
      results: [],
    };

    for (const doc of pendingRequestsSnap.docs) {
      try {
        const result = await processSingleAccountDeletion(doc, { isDryRun });
        summary.results.push(result);
        if (result.success) {
          summary.processedCount++;
        } else {
          summary.failedCount++;
        }
      } catch (err) {
        summary.failedCount++;
        summary.results.push({
          requestId: doc.id,
          success: false,
          error: err.message,
        });
      }
    }

    logger.info("Completed scheduled account deletion task", summary);
    return summary;
  }
);

module.exports = {
  requestAccountDeletion,
  cancelAccountDeletion,
  processScheduledAccountDeletion,
  processSingleAccountDeletion,
};
