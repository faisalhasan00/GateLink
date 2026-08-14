/**
 * GateLink Super Admin Data Service Layer
 * 
 * ARCHITECTURE & RESPONSIBILITIES:
 * 1. Global Platform Management: Manages tenant societies, system-wide subscriptions, and CRM leads.
 * 2. Cross-Tenant Audits: Provides real-time reactive Firestore subscriptions for platform monitoring.
 * 3. Security Boundary: Only users with `super_admin` claims in Firebase Auth have permissions here.
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateUUID } from '../utils/security';

export const superAdminService = {
  // ── SOCIETIES MANAGEMENT ────────────────────────────────────────────────
  subscribeSocieties(callback, onError) {
    const q = query(collection(db, 'societies'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async createSociety(societyData) {
    const docRef = doc(collection(db, 'societies'));
    await setDoc(docRef, {
      ...societyData,
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async onboardSocietyBatch(cleanData) {
    const societyUUID = generateUUID();
    const societyId = `SOC-${cleanData.code.substring(0, 6)}`;
    const adminEmail = cleanData.email.toLowerCase();
    const tempPassword = cleanData.password || `${cleanData.name.substring(0, 3).toUpperCase()}#${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const batch = writeBatch(db);

    const blockNamesRaw = cleanData.blockNames || cleanData.buildings || 'A, B, C, D';
    const parsedBlocks = blockNamesRaw.split(',').map(s => s.trim()).filter(Boolean);

    const societyRef = doc(db, 'societies', societyId);
    batch.set(societyRef, {
      id: societyUUID,
      societyId: societyId,
      name: cleanData.name,
      code: cleanData.code,
      type: cleanData.type,
      registrationNumber: cleanData.registrationNumber || null,
      yearEstablished: Number(cleanData.yearEstablished) || null,
      mrr: Number(cleanData.mrr) || 10000,
      adminEmail: adminEmail,
      tempPassword: tempPassword,
      president: cleanData.presidentName || 'Management Committee',
      phone: cleanData.phone,
      city: cleanData.city,
      country: cleanData.country || 'India',
      buildings: blockNamesRaw,
      blocksList: parsedBlocks,
      blocks: parsedBlocks.length || Number(cleanData.blocks) || 4,
      flats: Number(cleanData.flats) || 100,
      flatsPerBlock: Number(cleanData.flatsPerBlock) || 50,
      startFlatNumber: Number(cleanData.startFlatNumber) || 101,
      floors: Number(cleanData.floors) || 10,
      status: 'Active',
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
      createdBy: 'super_admin',
      updatedBy: 'super_admin'
    });

    const addressRef = doc(db, `societies/${societyId}/metadata/address`);
    batch.set(addressRef, {
      id: generateUUID(),
      societyId: societyId,
      addressLine1: cleanData.addressLine1,
      addressLine2: cleanData.addressLine2 || null,
      area: cleanData.area,
      landmark: cleanData.landmark || null,
      city: cleanData.city,
      state: cleanData.state,
      country: cleanData.country,
      pinCode: cleanData.pinCode,
      location: {
        latitude: cleanData.latitude ? Number(cleanData.latitude) : null,
        longitude: cleanData.longitude ? Number(cleanData.longitude) : null,
        fullAddress: cleanData.fullAddress || `${cleanData.addressLine1}, ${cleanData.area}, ${cleanData.city}, ${cleanData.pinCode}`
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    });

    const structureRef = doc(db, `societies/${societyId}/metadata/structure`);
    batch.set(structureRef, {
      id: generateUUID(),
      societyId: societyId,
      buildings: Number(cleanData.buildings) || null,
      blocks: Number(cleanData.blocks) || 1,
      floors: Number(cleanData.floors) || 1,
      flats: Number(cleanData.flats) || 1,
      villas: Number(cleanData.villas) || 0,
      parkingSlots: Number(cleanData.parkingSlots) || 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    });

    const occupancyRef = doc(db, `societies/${societyId}/metadata/occupancy`);
    batch.set(occupancyRef, {
      id: generateUUID(),
      societyId: societyId,
      occupiedFlats: Number(cleanData.occupiedFlats) || 0,
      vacantFlats: Number(cleanData.vacantFlats) || 0,
      rentalFlats: Number(cleanData.rentalFlats) || 0,
      ownerOccupiedFlats: Number(cleanData.ownerOccupiedFlats) || 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    });

    const committeeRef = doc(db, `societies/${societyId}/metadata/committee`);
    batch.set(committeeRef, {
      id: generateUUID(),
      societyId: societyId,
      presidentName: cleanData.presidentName || null,
      secretaryName: cleanData.secretaryName || null,
      treasurerName: cleanData.treasurerName || null,
      managerName: cleanData.managerName || null,
      phone: cleanData.phone,
      email: adminEmail,
      emergencyContact: cleanData.emergencyContact || null,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    });

    const auditRef = doc(collection(db, 'audit_logs'));
    batch.set(auditRef, {
      id: generateUUID(),
      action: 'CREATE_SOCIETY',
      entityId: societyId,
      performedBy: 'super_admin',
      timestamp: timestamp,
      payloadSummary: {
        name: cleanData.name,
        code: cleanData.code,
        adminEmail: adminEmail,
        city: cleanData.city
      }
    });

    await batch.commit();

    try {
      await addDoc(collection(db, 'notifications'), {
        title: '🏛️ New Society Onboarded',
        message: `${cleanData.name} (${cleanData.code}) onboarded successfully in ${cleanData.city}.`,
        type: 'society',
        read: false,
        createdAt: new Date().toISOString()
      });
    } catch (notifErr) {
      console.error("Error creating onboarding notification:", notifErr);
    }

    return {
      societyName: cleanData.name,
      societyId: societyId,
      accessCode: cleanData.code,
      adminEmail: adminEmail,
      tempPassword: tempPassword
    };
  },

  async updateSocietyStatus(societyId, status) {
    if (!societyId) throw new Error('Society ID is required');
    await updateDoc(doc(db, 'societies', societyId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  async updateSocietyFeatures(societyId, featureToggles) {
    if (!societyId) throw new Error('Society ID is required');
    await updateDoc(doc(db, 'societies', societyId), {
      features: featureToggles,
      updatedAt: new Date().toISOString(),
    });
  },

  // ── CRM INBOUND LEADS ──────────────────────────────────────────────────
  subscribeLeads(callback, onError) {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  subscribeCrmLeads(callback, onError) {
    return this.subscribeLeads(callback, onError);
  },

  async createLead(leadData) {
    const docRef = doc(collection(db, 'leads'));
    await setDoc(docRef, {
      ...leadData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async updateLeadStatus(leadId, status, notes = '') {
    if (!leadId) throw new Error('Lead ID is required');
    await updateDoc(doc(db, 'leads', leadId), {
      status,
      notes,
      updatedAt: new Date().toISOString(),
    });
  },

  async deleteLead(leadId) {
    if (!leadId) throw new Error('Lead ID is required');
    await deleteDoc(doc(db, 'leads', leadId));
  },

  // ── AD CAMPAIGNS ───────────────────────────────────────────────────────
  subscribeAdCampaigns(callback, onError) {
    const q = query(collection(db, 'ad_campaigns'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async createAdCampaign(campaignData) {
    const docRef = doc(collection(db, 'ad_campaigns'));
    await setDoc(docRef, {
      ...campaignData,
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async updateAdCampaignStatus(adId, status) {
    if (!adId) throw new Error('Ad ID is required');
    await updateDoc(doc(db, 'ad_campaigns', adId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  async deleteAdCampaign(adId) {
    if (!adId) throw new Error('Ad ID is required');
    await deleteDoc(doc(db, 'ad_campaigns', adId));
  },

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────
  subscribeNotifications(callback, onError) {
    const q = collection(db, 'notifications');
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      callback(data);
    }, onError);
  },

  async markNotificationRead(notificationId) {
    if (!notificationId) return;
    await updateDoc(doc(db, 'notifications', notificationId), { read: true });
  },

  async markAllNotificationsRead(notificationIds) {
    if (!notificationIds || notificationIds.length === 0) return;
    const batch = writeBatch(db);
    notificationIds.forEach(id => {
      const ref = doc(db, 'notifications', id);
      batch.update(ref, { read: true });
    });
    await batch.commit();
  },

  // ── GLOBAL SEARCH ──────────────────────────────────────────────────────
  async searchGlobalSocieties(queryText) {
    if (!queryText || queryText.length < 2) return [];
    const q = queryText.toLowerCase().trim();
    const snapSocieties = await getDocs(collection(db, 'societies'));
    const searchResults = [];

    snapSocieties.forEach(d => {
      const s = d.data();
      if ((s.name || '').toLowerCase().includes(q) || (s.code || d.id).toLowerCase().includes(q) || (s.city || '').toLowerCase().includes(q)) {
        searchResults.push({
          id: d.id,
          title: s.name || 'Society',
          subtitle: `Code: ${s.code || d.id} • ${s.city || 'Active'}`,
          type: 'Society',
          path: '/societies'
        });
      }
    });

    return searchResults.slice(0, 10);
  },

  // ── GLOBAL AUDIT LOGS ──────────────────────────────────────────────────
  async logGlobalAuditAction(actionData) {
    const docRef = doc(collection(db, 'system_audit_logs'));
    await setDoc(docRef, {
      ...actionData,
      timestamp: new Date().toISOString(),
    });
  }
};
