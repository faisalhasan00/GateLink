import { collection, addDoc, query, where, getDocs, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

/**
 * GateLink Partner & Lead Firestore Service
 */
export const submitPartnerLead = async (leadData) => {
  const generatedRef = `LEAD-${Date.now().toString().slice(-6)}`;
  
  const docRef = await addDoc(collection(db, 'partner_leads'), {
    referenceId: generatedRef,
    partnerName: leadData.partnerName.trim(),
    partnerPhone: leadData.partnerPhone.trim(),
    partnerEmail: leadData.partnerEmail.trim(),
    partnerCity: leadData.partnerCity.trim(),
    partnerUpi: leadData.partnerUpi.trim(),
    partnerType: leadData.partnerType || 'broker',
    referredByCode: leadData.referredByCode?.trim() || null,
    targetSocietyName: leadData.targetSocietyName.trim(),
    targetCity: leadData.targetCity.trim(),
    contactPerson: leadData.contactPerson.trim(),
    contactRole: leadData.contactRole || 'RWA Secretary',
    contactPhone: leadData.contactPhone.trim(),
    approxFlats: leadData.approxFlats || '100-250',
    notes: leadData.notes?.trim() || '',
    status: 'new',
    assignedTier: leadData.assignedTier || 'growth',
    source: 'website_partners_portal',
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, referenceId: generatedRef };
};

/**
 * Fetch all leads submitted by a partner's phone number or Reference ID
 */
export const lookupPartnerLeads = async (searchQuery) => {
  const cleanQuery = searchQuery.trim();
  const leadsRef = collection(db, 'partner_leads');
  
  // Try querying by phone first
  const qPhone = query(leadsRef, where('partnerPhone', '==', cleanQuery));
  const phoneSnap = await getDocs(qPhone);
  
  if (!phoneSnap.empty) {
    return phoneSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Fallback: Query by referenceId (e.g. LEAD-123456)
  const qRef = query(leadsRef, where('referenceId', '==', cleanQuery.toUpperCase()));
  const refSnap = await getDocs(qRef);

  return refSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Real-time listener for dynamic partner commission percentage rates
 */
export const subscribeCommissionRates = (onUpdate) => {
  const configDocRef = doc(db, 'system_config', 'partner_program');
  return onSnapshot(
    configDocRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data());
      }
    },
    (err) => {
      console.warn('Notice: system_config/partner_program using default rates:', err);
    }
  );
};
