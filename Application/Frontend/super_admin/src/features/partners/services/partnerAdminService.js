import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

/**
 * Super Admin Partner & Referral Deals Firestore Service
 */
export const partnerAdminService = {
  /**
   * Listen to real-time partner leads and sort safely in memory
   */
  subscribePartnerLeads(onSuccess, onError) {
    const leadsRef = collection(db, 'partner_leads');
    return onSnapshot(
      leadsRef,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        fetched.sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return tB - tA;
        });
        onSuccess(fetched);
      },
      onError
    );
  },

  /**
   * Listen to global dynamic commission configuration
   */
  subscribeCommissionConfig(onSuccess, onError) {
    const configDocRef = doc(db, 'system_config', 'partner_program');
    return onSnapshot(
      configDocRef,
      (snap) => {
        if (snap.exists()) {
          onSuccess(snap.data());
        }
      },
      onError
    );
  },

  /**
   * Update pipeline stage for a lead
   */
  async updateLeadStatus(leadId, newStatus) {
    return updateDoc(doc(db, 'partner_leads', leadId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Delete a partner lead
   */
  async deleteLead(leadId) {
    return deleteDoc(doc(db, 'partner_leads', leadId));
  },

  /**
   * Save recorded UPI payout with Bank UTR Reference proof
   */
  async recordPayout(leadId, payoutData) {
    return updateDoc(doc(db, 'partner_leads', leadId), {
      payoutTotal: Number(payoutData.amount) || 500,
      payoutStatus: 'paid',
      utrNumber: payoutData.utrNumber.trim(),
      payoutNotes: payoutData.notes?.trim() || '',
      lastPayoutAt: serverTimestamp(),
    });
  },

  /**
   * Create a manual lead from Super Admin
   */
  async createManualLead(leadData) {
    const generatedRef = `LEAD-${Date.now().toString().slice(-6)}`;
    const docRef = await addDoc(collection(db, 'partner_leads'), {
      ...leadData,
      referenceId: generatedRef,
      source: 'super_admin_manual_entry',
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, referenceId: generatedRef };
  },

  /**
   * Save dynamic commission percentage rates
   */
  async saveCommissionRates(rates) {
    return setDoc(
      doc(db, 'system_config', 'partner_program'),
      {
        ...rates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },
};
