const { HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { db, auth } = require("./firebase");

/**
 * Authoritative Backend Authentication & Active User Verification Middleware (HTTP onRequest)
 * Enforces:
 * 1. Valid Firebase Auth Bearer Token
 * 2. Token revocation check
 * 3. Authoritative Firestore user record presence in /users/{uid}
 * 4. Active user status (rejects deleted, suspended, or inactive users)
 * 5. Optional Role-Based Access Control (RBAC) validation
 */
async function verifyActiveUser(req, allowedRoles = null) {
  const authHeader = req.headers.authorization;
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

  // Authoritative Database User Lookup
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
  const status = (userData.status || "active").toLowerCase();

  if (status === "deleted" || status === "suspended" || status === "inactive") {
    logger.warn("Request rejected: User account is inactive, suspended, or deleted", {
      uid: authUser.uid,
      status,
    });
    return {
      authenticated: false,
      statusCode: 401,
      error: "Unauthorized: Account is suspended or no longer active.",
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
  const status = (userData.status || "active").toLowerCase();

  if (status === "deleted" || status === "suspended" || status === "inactive") {
    logger.warn("Callable rejected: User account status inactive/deleted", {
      uid,
      status,
    });
    throw new HttpsError(
      "permission-denied",
      "Account is suspended or no longer active."
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

module.exports = {
  verifyActiveUser,
  verifyActiveCallableUser,
};
