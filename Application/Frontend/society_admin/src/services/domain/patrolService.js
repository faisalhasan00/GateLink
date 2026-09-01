import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../../firebase';

export const patrolService = {
  /// Subscribe to checkpoints
  subscribeCheckpoints(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(
      collection(db, `societies/${societyId}/patrol_checkpoints`),
      orderBy('order', 'asc')
    );
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  /// Create a new checkpoint
  async createCheckpoint(societyId, checkpointData, logAuditAction) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(collection(db, `societies/${societyId}/patrol_checkpoints`));
    const code = checkpointData.code || `CP-${String(Date.now()).slice(-3)}`;
    
    // Encoded QR Code URI
    const qrPayload = `gatelink://patrol?sid=${societyId}&cid=${docRef.id}&code=${encodeURIComponent(code)}&name=${encodeURIComponent(checkpointData.name)}&area=${encodeURIComponent(checkpointData.area || 'Perimeter')}`;

    const fullData = {
      ...checkpointData,
      code,
      qrPayload,
      isActive: true,
      order: Number(checkpointData.order || 1),
      createdAt: new Date().toISOString(),
    };

    await setDoc(docRef, fullData);

    if (logAuditAction) {
      await logAuditAction(societyId, {
        action: 'Patrol Checkpoint Created',
        description: `Created checkpoint ${fullData.code}: ${fullData.name} (${fullData.area})`
      });
    }

    return docRef.id;
  },

  /// Update checkpoint
  async updateCheckpoint(societyId, checkpointId, updateData, logAuditAction) {
    if (!societyId || !checkpointId) throw new Error('Society ID and Checkpoint ID are required');
    const docRef = doc(db, `societies/${societyId}/patrol_checkpoints`, checkpointId);

    const code = updateData.code;
    const name = updateData.name;
    const area = updateData.area;
    const qrPayload = `gatelink://patrol?sid=${societyId}&cid=${checkpointId}&code=${encodeURIComponent(code)}&name=${encodeURIComponent(name)}&area=${encodeURIComponent(area || 'Perimeter')}`;

    const dataToSave = {
      ...updateData,
      qrPayload,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, dataToSave);

    if (logAuditAction) {
      await logAuditAction(societyId, {
        action: 'Patrol Checkpoint Updated',
        description: `Updated checkpoint ${code}: ${name}`
      });
    }
  },

  /// Delete checkpoint
  async deleteCheckpoint(societyId, checkpointId, checkpointCode, logAuditAction) {
    if (!societyId || !checkpointId) throw new Error('Society ID and Checkpoint ID are required');
    await deleteDoc(doc(db, `societies/${societyId}/patrol_checkpoints`, checkpointId));

    if (logAuditAction) {
      await logAuditAction(societyId, {
        action: 'Patrol Checkpoint Deleted',
        description: `Deleted checkpoint ${checkpointCode || checkpointId}`
      });
    }
  },

  /// Subscribe to live patrol scan logs
  subscribePatrolLogs(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(
      collection(db, `societies/${societyId}/patrol_logs`),
      orderBy('scannedAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  /// Subscribe to patrol incidents
  subscribePatrolIncidents(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(
      collection(db, `societies/${societyId}/patrol_incidents`),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  /// Update incident status (e.g. 'investigating', 'resolved')
  async updateIncidentStatus(societyId, incidentId, status, resolutionNotes, logAuditAction) {
    if (!societyId || !incidentId) throw new Error('Society ID and Incident ID are required');
    await updateDoc(doc(db, `societies/${societyId}/patrol_incidents`, incidentId), {
      status,
      resolutionNotes: resolutionNotes || '',
      resolvedAt: status === 'resolved' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    });

    if (logAuditAction) {
      await logAuditAction(societyId, {
        action: `Patrol Incident ${status.toUpperCase()}`,
        description: `Incident #${incidentId.slice(0, 6)} marked as ${status}`
      });
    }
  }
};
