const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { db, auth, FieldValue } = require("../config/firebase");
const { verifyActiveCallableUser } = require("../config/auth_middleware");

/**
 * SEC-P0: Server-Side Super Admin Custom Claim Assignment
 * Safe Admin SDK endpoint to assign { role: 'super_admin' } custom claims.
 * Client-side self-assignment is strictly blocked.
 */
const setSuperAdminRole = onCall(async (request) => {
  await verifyActiveCallableUser(request);

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

/**
 * SEC-P0: Safe Server-Side Staff / Guard User Provisioning
 */
const createStaffUser = onCall(async (request) => {
  await verifyActiveCallableUser(request);
  const { email, password, name, role, societyId, phone, department } = request.data || {};
  if (!email || !password || !societyId) {
    throw new HttpsError("invalid-argument", "email, password, and societyId are required.");
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanRole = role || "guard";

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(cleanEmail);
    // Update password if existing
    await auth.updateUser(userRecord.uid, {
      password: password.trim(),
      displayName: name || "Security Guard",
    });
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      userRecord = await auth.createUser({
        email: cleanEmail,
        password: password.trim(),
        displayName: name || "Security Guard",
      });
    } else {
      logger.error("Error creating staff auth record", { error: err.message });
      throw new HttpsError("internal", err.message);
    }
  }

  const uid = userRecord.uid;
  const timestamp = FieldValue.serverTimestamp();

  const userPayload = {
    uid,
    name: name || "Security Guard",
    email: cleanEmail,
    phone: phone || "",
    department: department || "Security & Gate",
    role: cleanRole,
    status: "active",
    societyId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const batch = db.batch();
  batch.set(db.doc(`users/${uid}`), userPayload, { merge: true });
  batch.set(db.doc(`societies/${societyId}/users/${uid}`), userPayload, { merge: true });
  await batch.commit();

  logger.info("Successfully provisioned staff account", { uid, email: cleanEmail, societyId });
  return { success: true, uid };
});

module.exports = {
  setSuperAdminRole,
  createStaffUser,
};
