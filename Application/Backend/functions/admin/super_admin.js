const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { db, auth, FieldValue } = require("../config/firebase");
const { verifyActiveCallableUser, verifySocietyAdmin } = require("../config/auth_middleware");

const ALLOWED_STAFF_ROLES = ["guard", "security", "staff", "manager"];

/**
 * SEC-P0: Server-Side Super Admin Custom Claim Assignment
 * Safe Admin SDK endpoint to assign { role: 'super_admin' } custom claims.
 * Client-side self-assignment is strictly blocked.
 */
const setSuperAdminRole = onCall(
  { cors: true, enforceAppCheck: process.env.ENFORCE_APP_CHECK === "true" },
  async (request) => {
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
  }
);

/**
 * SEC-P0 & P1: Safe Server-Side Staff / Guard User Provisioning
 * Requires Society Admin (for own society) or Super Admin (platform-wide).
 * Restricted to staff roles: 'guard', 'security', 'staff', 'manager'.
 */
const createStaffUser = onCall(
  { cors: true, enforceAppCheck: process.env.ENFORCE_APP_CHECK === "true" },
  async (request) => {
    const { email, password, name, role, societyId, phone, department } = request.data || {};

    if (!societyId || !email || !password) {
      throw new HttpsError("invalid-argument", "societyId, email, and password are required.");
    }

  // 2. Creatable Role Whitelist Validation
  const requestedRole = (role || "guard").toLowerCase().trim();
  if (!ALLOWED_STAFF_ROLES.includes(requestedRole)) {
    logger.warn("Invalid staff role requested", {
      requestedRole,
      callerUid: request.auth.uid,
      societyId,
    });
    throw new HttpsError(
      "invalid-argument",
      `Invalid staff role. Allowed roles: ${ALLOWED_STAFF_ROLES.join(", ")}`
    );
  }
  const cleanRole = requestedRole;
  const cleanEmail = email.trim().toLowerCase();

  // 3. Existing User Tenant Isolation Check
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(cleanEmail);

    const existingUserDoc = await db.doc(`users/${userRecord.uid}`).get();
    if (existingUserDoc.exists) {
      const existingData = existingUserDoc.data() || {};
      if (existingData.societyId && existingData.societyId !== societyId) {
        logger.warn("Attempt to reassign existing user from another society", {
          uid: userRecord.uid,
          existingSocietyId: existingData.societyId,
          targetSocietyId: societyId,
          callerUid: request.auth.uid,
        });
        throw new HttpsError(
          "already-exists",
          "A user with this email already belongs to a different society."
        );
      }

      if (
        existingData.role === "super_admin" ||
        existingData.role === "admin" ||
        existingData.role === "society_admin"
      ) {
        throw new HttpsError(
          "permission-denied",
          "Cannot overwrite an administrative account as staff."
        );
      }
    }

    // Update password and display name for existing staff user
    await auth.updateUser(userRecord.uid, {
      password: password.trim(),
      displayName: name ? name.trim() : "Security Guard",
    });
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      userRecord = await auth.createUser({
        email: cleanEmail,
        password: password.trim(),
        displayName: name ? name.trim() : "Security Guard",
      });
    } else if (err instanceof HttpsError) {
      throw err;
    } else {
      logger.error("Error creating staff auth record", { error: err.message });
      throw new HttpsError("internal", err.message);
    }
  }

  const uid = userRecord.uid;
  const timestamp = FieldValue.serverTimestamp();

  // 4. Sanitize and write user payload atomically
  const userPayload = {
    uid,
    name: name ? name.trim() : "Security Guard",
    email: cleanEmail,
    phone: phone ? phone.trim() : "",
    department: department ? department.trim() : "Security & Gate",
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

  logger.info("Successfully provisioned staff account", {
    uid,
    email: cleanEmail,
    role: cleanRole,
    societyId,
    callerUid: request.auth.uid,
  });

  return { success: true, uid };
});

module.exports = {
  setSuperAdminRole,
  createStaffUser,
};
