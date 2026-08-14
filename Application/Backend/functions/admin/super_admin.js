const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { db, auth, FieldValue } = require("../config/firebase");

/**
 * SEC-P0: Server-Side Super Admin Custom Claim Assignment
 * Safe Admin SDK endpoint to assign { role: 'super_admin' } custom claims.
 * Client-side self-assignment is strictly blocked.
 */
const setSuperAdminRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  // Security check: Only existing super_admin or bootstrap master key allowed
  const callerClaims = request.auth.token || {};
  const isExistingSuperAdmin = callerClaims.role === "super_admin";
  const isBootstrapKeyMatch =
    request.data.bootstrapKey && request.data.bootstrapKey === process.env.SUPER_ADMIN_BOOTSTRAP_KEY;

  if (!isExistingSuperAdmin && !isBootstrapKeyMatch) {
    logger.error("Unauthorized attempt to assign super_admin role", {
      functionName: "setSuperAdminRole",
      callerUid: request.auth.uid,
    });
    throw new HttpsError("permission-denied", "Unauthorized to assign super_admin role.");
  }

  const { targetUid } = request.data || {};
  if (!targetUid) {
    throw new HttpsError("invalid-argument", "targetUid is required.");
  }

  await auth.setCustomUserClaims(targetUid, { role: "super_admin" });

  await db
    .doc(`users/${targetUid}`)
    .set({ role: "super_admin", updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  logger.info("Successfully assigned super_admin claim", {
    functionName: "setSuperAdminRole",
    callerUid: request.auth.uid,
    targetUid,
  });

  return { success: true, message: `Successfully assigned super_admin claim to user ${targetUid}` };
});

module.exports = {
  setSuperAdminRole,
};
