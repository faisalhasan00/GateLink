import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
    referredByCode: leadData.referredByCode?.trim() || null, // Auto-captured from ?ref=
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
