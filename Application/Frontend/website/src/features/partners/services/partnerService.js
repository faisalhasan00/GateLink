import { collection, addDoc, query, where, getDocs, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { calculateSocietyMonthlyFee } from '../../../utils/pricingEngine';

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

/**
 * Partner Self-Serve Direct Society Onboarding & Secret Activation Link Generator
 */
export const onboardSocietyByPartner = async (onboardingData) => {
  const generatedRef = `LEAD-${Date.now().toString().slice(-6)}`;
  const activationCode = `SOC-${Math.floor(100000 + Math.random() * 900000)}`;

  const flatCountNum = Number(onboardingData.flatCount) || 100;
  const calculatedMrr = calculateSocietyMonthlyFee(flatCountNum);

  // 1. Save Partner Lead & Onboarding Record
  const leadRef = await addDoc(collection(db, 'partner_leads'), {
    referenceId: generatedRef,
    activationCode,
    isOnboardedByPartner: true,
    partnerName: onboardingData.partnerName.trim(),
    partnerPhone: onboardingData.partnerPhone.trim(),
    partnerEmail: onboardingData.partnerEmail?.trim() || '',
    partnerUpi: onboardingData.partnerUpi.trim(),
    partnerType: onboardingData.partnerType || 'onboarding_partner',

    targetSocietyName: onboardingData.societyName.trim(),
    targetCity: onboardingData.city.trim(),
    address: onboardingData.address.trim(),
    pincode: onboardingData.pincode?.trim() || '',
    
    wings: onboardingData.wings || [],
    approxFlats: String(flatCountNum),
    flatCount: flatCountNum,
    gatesCount: Number(onboardingData.gatesCount) || 2,
    guardDevicesCount: Number(onboardingData.guardDevicesCount) || 2,
    mrr: calculatedMrr,
    monthlyFee: calculatedMrr,

    contactPerson: onboardingData.rwaSecretaryName.trim(),
    contactPhone: onboardingData.rwaSecretaryPhone.trim(),
    contactEmail: onboardingData.rwaSecretaryEmail?.trim() || '',
    contactRole: 'RWA Secretary',

    status: 'won', // Self-onboarded by partner
    assignedTier: onboardingData.assignedTier || 'onboarding',
    source: 'partner_self_serve_onboarding_wizard',
    createdAt: serverTimestamp(),
  });

  // 2. Create Pending Provisioned Society Record
  await addDoc(collection(db, 'societies'), {
    name: onboardingData.societyName.trim(),
    city: onboardingData.city.trim(),
    address: onboardingData.address.trim(),
    code: activationCode,
    activationCode,
    partnerReferenceId: generatedRef,
    partnerLeadId: leadRef.id,
    flatCount: flatCountNum,
    wings: onboardingData.wings || [],
    gatesCount: Number(onboardingData.gatesCount) || 2,
    president: onboardingData.rwaSecretaryName.trim(),
    phone: onboardingData.rwaSecretaryPhone.trim(),
    contactPerson: onboardingData.rwaSecretaryName.trim(),
    contactPhone: onboardingData.rwaSecretaryPhone.trim(),
    mrr: calculatedMrr,
    monthlyFee: calculatedMrr,
    status: 'pending_rwa_activation',
    createdAt: serverTimestamp(),
  });

  return {
    id: leadRef.id,
    referenceId: generatedRef,
    activationCode,
    activationUrl: `https://app.gatelink.in/activate?code=${activationCode}&ref=${generatedRef}`,
    rwaPhone: onboardingData.rwaSecretaryPhone.trim(),
    rwaName: onboardingData.rwaSecretaryName.trim(),
    societyName: onboardingData.societyName.trim(),
  };
};
