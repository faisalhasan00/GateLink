import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase';

export const maintenanceService = {
  async getSocietyBankDetails(societyId) {
    if (!societyId) return null;
    const docRef = doc(db, `societies/${societyId}/metadata/bankDetails`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  async updateSocietyBankDetails(societyId, bankData, logAuditAction) {
    if (!societyId) throw new Error('Missing societyId');
    const docRef = doc(db, `societies/${societyId}/metadata/bankDetails`);
    const timestamp = new Date().toISOString();
    await setDoc(docRef, {
      ...bankData,
      updatedAt: timestamp,
      status: 'Verified',
      settlementMode: 'Cashfree Auto-Settlement (T+1)'
    }, { merge: true });

    if (logAuditAction) {
      await logAuditAction(societyId, {
        action: 'Bank Details Updated',
        description: `Updated settlement bank account: ${bankData.bankName} (Ending in ${bankData.accountNumber?.slice(-4) || '****'})`
      });
    }
    return true;
  },

  subscribeMaintenanceBills(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/maintenance_bills`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async createMaintenanceBill(societyId, billData) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(collection(db, `societies/${societyId}/maintenance_bills`));
    const fullData = {
      ...billData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, fullData);

    import('../fcmBroadcastService').then(async ({ sendFcmNotification, broadcastToSociety }) => {
      try {
        const title = `💳 Maintenance Bill: ₹${fullData.amount}`;
        const body = `Maintenance bill for ${fullData.month || 'this month'} has been generated. Due: ${fullData.dueDate || 'Soon'}.`;

        if (!fullData.residentUid || fullData.residentUid === 'ALL') {
          await broadcastToSociety(societyId, {
            title,
            body,
            category: 'bill',
            target: 'residents',
            data: {
              type: 'bill',
              billId: docRef.id,
              amount: String(fullData.amount)
            }
          });
        } else {
          let fcmToken = null;
          try {
            const uSnap = await getDoc(doc(db, `users/${fullData.residentUid}`));
            if (uSnap.exists() && uSnap.data().fcmToken) {
              fcmToken = uSnap.data().fcmToken;
            }
          } catch (_) {}

          if (!fcmToken) {
            try {
              const suSnap = await getDoc(doc(db, `societies/${societyId}/users/${fullData.residentUid}`));
              if (suSnap.exists() && suSnap.data().fcmToken) {
                fcmToken = suSnap.data().fcmToken;
              }
            } catch (_) {}
          }

          if (fcmToken) {
            await sendFcmNotification(fcmToken, {
              title,
              body,
              data: {
                type: 'bill',
                billId: docRef.id,
                amount: String(fullData.amount)
              }
            });
          }
        }
      } catch (err) {
        console.warn('Bill push notification dispatch error:', err);
      }
    }).catch((err) => {
      console.warn('Bill push notification dispatch exception:', err);
    });

    return docRef.id;
  },

  async updateBillStatus(societyId, billId, status, extraData = {}) {
    if (!societyId || !billId) throw new Error('Society ID and Bill ID are required');
    await updateDoc(doc(db, `societies/${societyId}/maintenance_bills`, billId), {
      status,
      ...extraData,
      updatedAt: new Date().toISOString(),
    });
  },

  async markBillPaid(societyId, billId, paymentData = {}) {
    if (!societyId || !billId) throw new Error('Society ID and Bill ID are required');
    await updateDoc(doc(db, `societies/${societyId}/maintenance_bills`, billId), {
      status: 'paid',
      paidAt: new Date().toISOString(),
      ...paymentData,
      updatedAt: new Date().toISOString(),
    });
  },

  async getBillingConfig(societyId) {
    if (!societyId) return null;
    const docRef = doc(db, `societies/${societyId}/metadata/billingConfig`);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return {
        isAutoBillingEnabled: true,
        billingDayOfMonth: 1,
        dueDayOfMonth: 15,
        baseMaintenanceCharge: 3500,
        parkingCharge: 500,
        waterCharge: 300,
        sinkingFund: 200,
        billingTitle: 'Monthly Maintenance & Society Facilities',
      };
    }
    return docSnap.data();
  },

  async updateBillingConfig(societyId, config, logAuditAction) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(db, `societies/${societyId}/metadata/billingConfig`);
    const updated = {
      isAutoBillingEnabled: config.isAutoBillingEnabled ?? true,
      billingDayOfMonth: Number(config.billingDayOfMonth ?? 1),
      dueDayOfMonth: Number(config.dueDayOfMonth ?? 15),
      baseMaintenanceCharge: Number(config.baseMaintenanceCharge ?? 3500),
      parkingCharge: Number(config.parkingCharge ?? 0),
      waterCharge: Number(config.waterCharge ?? 0),
      sinkingFund: Number(config.sinkingFund ?? 0),
      billingTitle: config.billingTitle || 'Monthly Maintenance & Society Facilities',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, updated, { merge: true });

    if (logAuditAction) {
      await logAuditAction(societyId, {
        action: 'Billing Configuration Updated',
        description: `Updated auto-invoicing rules (Auto: ${updated.isAutoBillingEnabled ? 'ON' : 'OFF'}, Base: ₹${updated.baseMaintenanceCharge}, Bill Day: ${updated.billingDayOfMonth}st/th, Due: ${updated.dueDayOfMonth}th)`
      });
    }
    return updated;
  },

  async triggerAutoInvoicing(societyId, options = {}) {
    if (!societyId) throw new Error('Society ID is required');
    const { httpsCallable } = await import('firebase/functions');
    const { functions } = await import('../../firebase');
    const triggerFn = httpsCallable(functions, 'triggerManualMonthlyInvoicing');
    const res = await triggerFn({ societyId, ...options });
    return res.data;
  }
};

