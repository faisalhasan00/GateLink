const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const crypto = require("crypto");
const { db } = require("../config/firebase");

/**
 * SEC-P0: Trusted Server-Side Visitor Passcode Generation
 * Generates a cryptographically secure 6-digit numeric passcode and 24-hour expiration timestamp.
 */
const generateVisitorPasscode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required to generate visitor passcode.");
  }

  const { societyId, name, phone, purpose, hostFlat, expectedDate, expectedTime } = request.data || {};
  if (!societyId || !name || !hostFlat) {
    throw new HttpsError("invalid-argument", "societyId, name, and hostFlat are required.");
  }

  // Cryptographically secure random 6-digit passcode
  const passCode = crypto.randomInt(100000, 999999).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours validity

  const visitorRef = db.collection(`societies/${societyId}/visitors`).doc();

  await visitorRef.set({
    name,
    phone: phone || "",
    type: purpose || "Guest",
    hostFlat,
    invitedBy: request.auth.uid,
    expectedDate: expectedDate || now.toISOString().split("T")[0],
    expectedTime: expectedTime || "12:00 PM",
    passCode,
    qrCode: passCode,
    passCodeExpiresAt: expiresAt,
    entryTime: null,
    exitTime: null,
    status: "expected",
    createdAt: now.toISOString(),
  });

  logger.info("Visitor passcode generated", {
    functionName: "generateVisitorPasscode",
    societyId,
    visitorId: visitorRef.id,
    residentUid: request.auth.uid,
    hostFlat,
  });

  return {
    visitorId: visitorRef.id,
    passCode,
    expiresAt,
  };
});

/**
 * SEC-P0: Atomic Server-Side Visitor Passcode Validation & Entry Scanner
 * Validates passcode, checks 24h expiration, enforces atomic state transition from 'expected' to 'inside'.
 * Prevents passcode replay attacks and concurrent scan race conditions using Firestore Transaction.
 */
const validateVisitorPasscode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required to validate visitor passcode.");
  }

  const { societyId, passCode } = request.data || {};
  if (!societyId || !passCode) {
    throw new HttpsError("invalid-argument", "societyId and passCode are required.");
  }

  const querySnapshot = await db
    .collection(`societies/${societyId}/visitors`)
    .where("passCode", "==", passCode.trim())
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    logger.warn("Visitor passcode validation failed: Invalid passcode", {
      functionName: "validateVisitorPasscode",
      societyId,
      guardUid: request.auth.uid,
    });
    return { isValid: false, message: "Invalid visitor passcode." };
  }

  const visitorRef = querySnapshot.docs[0].ref;

  // Execute atomic transaction to prevent replay and concurrent scan race conditions
  return await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(visitorRef);
    if (!doc.exists) {
      return { isValid: false, message: "Visitor record not found." };
    }

    const data = doc.data();

    if (data.status !== "expected") {
      logger.warn("Visitor passcode already used or invalid status", {
        functionName: "validateVisitorPasscode",
        societyId,
        visitorId: doc.id,
        status: data.status,
        guardUid: request.auth.uid,
      });
      return {
        isValid: false,
        message: `Passcode already used or invalid status: ${data.status.toUpperCase()}`,
      };
    }

    if (data.passCodeExpiresAt) {
      const expiresAt = new Date(data.passCodeExpiresAt);
      if (new Date() > expiresAt) {
        transaction.update(visitorRef, { status: "expired" });
        logger.info("Visitor pass expired", {
          functionName: "validateVisitorPasscode",
          societyId,
          visitorId: doc.id,
          guardUid: request.auth.uid,
        });
        return { isValid: false, message: "Visitor pass has expired." };
      }
    }

    const nowIso = new Date().toISOString();
    transaction.update(visitorRef, {
      status: "inside",
      entryTime: nowIso,
      scannedByGuardUid: request.auth.uid,
      updatedAt: nowIso,
    });

    logger.info("Visitor passcode validated and entry granted", {
      functionName: "validateVisitorPasscode",
      societyId,
      visitorId: doc.id,
      guardUid: request.auth.uid,
      hostFlat: data.hostFlat,
    });

    return {
      isValid: true,
      visitorId: doc.id,
      name: data.name,
      hostFlat: data.hostFlat,
      type: data.type,
      entryTime: nowIso,
      message: "Passcode verified successfully. Entry granted.",
    };
  });
});

module.exports = {
  generateVisitorPasscode,
  validateVisitorPasscode,
};
