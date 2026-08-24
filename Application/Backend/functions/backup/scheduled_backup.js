const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const { GoogleAuth } = require("google-auth-library");

/**
 * SEC-P1: Automated Daily Managed Firestore Export
 * Triggers Google Cloud Firestore Managed Export API once daily at 02:00 AM IST (Asia/Kolkata).
 * Backups are stored in a configurable GCS bucket (env var: FIRESTORE_BACKUP_BUCKET).
 */
const scheduledFirestoreBackup = onSchedule(
  {
    schedule: "0 2 * * *",
    timeZone: "Asia/Kolkata",
    retryCount: 3,
  },
  async (event) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT || "societysphere-b2538";
    const databaseId = "(default)";
    const rawBucket = process.env.FIRESTORE_BACKUP_BUCKET || `${projectId}-firestore-backups`;
    const bucketName = rawBucket.startsWith("gs://") ? rawBucket : `gs://${rawBucket}`;

    logger.info("Initiating scheduled managed Firestore export", {
      functionName: "scheduledFirestoreBackup",
      projectId,
      databaseId,
      bucketName,
      timestamp: new Date().toISOString(),
    });

    try {
      const auth = new GoogleAuth({
        scopes: [
          "https://www.googleapis.com/auth/datastore",
          "https://www.googleapis.com/auth/cloud-platform",
        ],
      });

      const client = await auth.getClient();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const outputUriPrefix = `${bucketName}/${timestamp}`;

      const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}:exportDocuments`;

      const res = await client.request({
        url: endpoint,
        method: "POST",
        data: {
          outputUriPrefix,
        },
      });

      logger.info("Firestore export operation successfully initiated", {
        functionName: "scheduledFirestoreBackup",
        operationName: res.data?.name,
        outputUriPrefix,
      });

      return res.data;
    } catch (err) {
      logger.error("Error executing scheduled Firestore export", {
        functionName: "scheduledFirestoreBackup",
        error: err.message,
      });
      throw err;
    }
  }
);

module.exports = { scheduledFirestoreBackup };
