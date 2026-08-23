const { HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { db, auth } = require("./firebase");

/**
 * Authoritative Status Validator
 * Accepted active statuses: 'active', 'approved'
 * Rejected statuses: 'pending_approval', 'suspended', 'inactive', 'deleted', null/empty
 */
function isApprovedStatus(status) {
  const clean = (status || "").toLowerCase().trim();
  return clean === "active" || clean === "approved";
}

/**
 * Helper to determine if the incoming argument is a Callable (onCall) request
 */
function isCallableRequest(reqOrRequest) {
  return Boolean(reqOrRequest && typeof reqOrRequest === "object" && "auth" in reqOrRequest);
}

/**
 * Authoritative Backend Authentication & Active User Verification Middleware (HTTP onRequest)
 * Enforces:
 * 1. Valid Firebase Auth Bearer Token
 * 2. Token revocation check
 * 3. Authoritative Firestore user record presence in /users/{uid}
 * 4. Active/approved user status ('active', 'approved')
 * 5. Optional Role-Based Access Control (RBAC) validation
 */
async function verifyActiveUser(req, allowedRoles = null) {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      statusCode: 401,
      error: "Unauthorized: Missing or malformed Bearer authorization token.",
    };
  }

  const idToken = authHeader.split("Bearer ")[1];
  let authUser = null;

  try {
    // Check revocation to ensure deleted/logged-out sessions are immediately rejected
    authUser = await auth.verifyIdToken(idToken, true);
  } catch (authErr) {
    logger.warn("ID Token verification / revocation check failed", {
      error: authErr.message,
      code: authErr.code,
    });
    return {
      authenticated: false,
      statusCode: 401,
      error: "Unauthorized: Invalid or revoked authentication token.",
    };
  }

  if (!authUser || !authUser.uid) {
    return {
      authenticated: false,
      statusCode: 401,
      error: "Unauthorized: Authentication required.",
    };
  }

  // Authoritative Database User Lookup from root /users/{uid}
  const userDocRef = db.doc(`users/${authUser.uid}`);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    logger.warn("Request rejected: User document does not exist in database", {
      uid: authUser.uid,
      email: authUser.email,
    });
    return {
      authenticated: false,
      statusCode: 401,
      error: "Unauthorized: Account not found or account is no longer active.",
    };
  }

  const userData = userDoc.data() || {};
  const status = userData.status;

  if (!isApprovedStatus(status)) {
    logger.warn("Request rejected: User account is not active/approved", {
      uid: authUser.uid,
      status,
    });
    return {
      authenticated: false,
      statusCode: 403,
      error: "Forbidden: Account is pending approval, suspended, or inactive.",
    };
  }

  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRole = userData.role || authUser.role;
    if (!allowedRoles.includes(userRole)) {
      logger.warn("Request rejected: Forbidden role access attempt", {
        uid: authUser.uid,
        userRole,
        allowedRoles,
      });
      return {
        authenticated: false,
        statusCode: 403,
        error: "Forbidden: Insufficient permissions for this operation.",
      };
    }
  }

  return {
    authenticated: true,
    uid: authUser.uid,
    authUser,
    userData,
    userDoc,
  };
}

/**
 * Authoritative Backend Authentication & Active User Verification for onCall Callables
 */
async function verifyActiveCallableUser(request, allowedRoles = null) {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const uid = request.auth.uid;
  const userDocRef = db.doc(`users/${uid}`);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    logger.warn("Callable rejected: User document does not exist in database", {
      uid,
    });
    throw new HttpsError(
      "unauthenticated",
      "Account not found or account is no longer active."
    );
  }

  const userData = userDoc.data() || {};
  const status = userData.status;

  if (!isApprovedStatus(status)) {
    logger.warn("Callable rejected: User account is not active/approved", {
      uid,
      status,
    });
    throw new HttpsError(
      "permission-denied",
      "Forbidden: Account is pending approval, suspended, or inactive."
    );
  }

  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRole = userData.role || request.auth.token?.role;
    if (!allowedRoles.includes(userRole)) {
      logger.warn("Callable rejected: Forbidden role access attempt", {
        uid,
        userRole,
        allowedRoles,
      });
      throw new HttpsError(
        "permission-denied",
        "Forbidden: Insufficient permissions."
      );
    }
  }

  return {
    uid,
    authUser: request.auth,
    userData,
    userDoc,
  };
}

/**
 * Authoritative Active Resident Verification Helper
 * Requires:
 * 1. Authenticated user
 * 2. Status is 'active' or 'approved'
 * 3. Role is 'resident'
 * 4. Authoritative user societyId matches requested societyId
 */
async function verifyActiveResident(reqOrRequest, societyId) {
  if (!societyId) {
    if (isCallableRequest(reqOrRequest)) {
      throw new HttpsError("invalid-argument", "societyId is required.");
    }
    return { authenticated: false, statusCode: 400, error: "Missing societyId." };
  }

  let authResult;
  if (isCallableRequest(reqOrRequest)) {
    authResult = await verifyActiveCallableUser(reqOrRequest, ["resident"]);
  } else {
    authResult = await verifyActiveUser(reqOrRequest, ["resident"]);
    if (!authResult.authenticated) return authResult;
  }

  const userData = authResult.userData || {};
  const userSocietyId = userData.societyId;

  if (userSocietyId !== societyId) {
    logger.warn("Active resident society tenant mismatch", {
      uid: authResult.uid,
      userSocietyId,
      requestedSocietyId: societyId,
    });
    if (isCallableRequest(reqOrRequest)) {
      throw new HttpsError("permission-denied", "Forbidden: Tenant isolation mismatch.");
    }
    return {
      authenticated: false,
      statusCode: 403,
      error: "Forbidden: You do not belong to the specified society.",
    };
  }

  return authResult;
}

/**
 * Authoritative Society Admin Verification Helper
 * Requires:
 * 1. Authenticated user
 * 2. Status is 'active' or 'approved'
 * 3. Role is 'admin', 'society_admin', or 'super_admin'
 * 4. Tenant match (super_admin has platform-wide cross-society access; society admin must match societyId)
 */
async function verifySocietyAdmin(reqOrRequest, societyId) {
  if (!societyId) {
    if (isCallableRequest(reqOrRequest)) {
      throw new HttpsError("invalid-argument", "societyId is required.");
    }
    return { authenticated: false, statusCode: 400, error: "Missing societyId." };
  }

  let authResult;
  if (isCallableRequest(reqOrRequest)) {
    authResult = await verifyActiveCallableUser(reqOrRequest, ["admin", "society_admin", "super_admin"]);
  } else {
    authResult = await verifyActiveUser(reqOrRequest, ["admin", "society_admin", "super_admin"]);
    if (!authResult.authenticated) return authResult;
  }

  const userData = authResult.userData || {};
  const userRole = userData.role || (isCallableRequest(reqOrRequest) ? reqOrRequest.auth.token?.role : authResult.authUser?.role);

  // Super Admin possesses platform-wide administrative authority
  if (userRole === "super_admin") {
    return authResult;
  }

  const userSocietyId = userData.societyId;
  if (userSocietyId !== societyId) {
    logger.warn("Society admin tenant mismatch", {
      uid: authResult.uid,
      userSocietyId,
      requestedSocietyId: societyId,
    });
    if (isCallableRequest(reqOrRequest)) {
      throw new HttpsError("permission-denied", "Forbidden: Cross-tenant administration not allowed.");
    }
    return {
      authenticated: false,
      statusCode: 403,
      error: "Forbidden: You are not authorized to administer this society.",
    };
  }

  return authResult;
}

/**
 * Authoritative Guard Verification Helper
 * Requires:
 * 1. Authenticated user
 * 2. Status is 'active' or 'approved'
 * 3. Role is 'guard' or 'security'
 * 4. Authoritative user societyId matches requested societyId
 */
async function verifyGuard(reqOrRequest, societyId) {
  if (!societyId) {
    if (isCallableRequest(reqOrRequest)) {
      throw new HttpsError("invalid-argument", "societyId is required.");
    }
    return { authenticated: false, statusCode: 400, error: "Missing societyId." };
  }

  let authResult;
  if (isCallableRequest(reqOrRequest)) {
    authResult = await verifyActiveCallableUser(reqOrRequest, ["guard", "security"]);
  } else {
    authResult = await verifyActiveUser(reqOrRequest, ["guard", "security"]);
    if (!authResult.authenticated) return authResult;
  }

  const userData = authResult.userData || {};
  const userSocietyId = userData.societyId;

  if (userSocietyId !== societyId) {
    logger.warn("Guard tenant mismatch", {
      uid: authResult.uid,
      userSocietyId,
      requestedSocietyId: societyId,
    });
    if (isCallableRequest(reqOrRequest)) {
      throw new HttpsError("permission-denied", "Forbidden: Guard does not belong to specified society.");
    }
    return {
      authenticated: false,
      statusCode: 403,
      error: "Forbidden: You are not registered as a guard for this society.",
    };
  }

  return authResult;
}

module.exports = {
  isApprovedStatus,
  verifyActiveUser,
  verifyActiveCallableUser,
  verifyActiveResident,
  verifySocietyAdmin,
  verifyGuard,
};
