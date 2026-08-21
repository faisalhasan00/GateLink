import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase';

export const complaintService = {
  subscribeComplaints(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/complaints`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async updateComplaintStatus(societyId, complaintId, status, resolutionNotes = '') {
    if (!societyId || !complaintId) throw new Error('Society ID and Complaint ID are required');
    await updateDoc(doc(db, `societies/${societyId}/complaints`, complaintId), {
      status,
      resolutionNotes,
      updatedAt: new Date().toISOString(),
    });
  },

  async assignComplaintStaff(societyId, complaintId, assignedTo) {
    if (!societyId || !complaintId) throw new Error('Society ID and Complaint ID are required');
    await updateDoc(doc(db, `societies/${societyId}/complaints`, complaintId), {
      assignedTo,
      updatedAt: new Date().toISOString(),
    });
  },

  subscribeSosAlerts(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/sos_alerts`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async updateSosAlertStatus(societyId, alertId, status) {
    if (!societyId || !alertId) throw new Error('Society ID and Alert ID are required');
    await updateDoc(doc(db, `societies/${societyId}/sos_alerts`, alertId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  async logAuditAction(societyId, auditData) {
    if (!societyId) return;
    const docRef = doc(collection(db, `societies/${societyId}/audit_logs`));
    await setDoc(docRef, {
      ...auditData,
      timestamp: new Date().toISOString(),
    });
  }
};
