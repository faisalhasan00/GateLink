import { doc, getDoc, writeBatch, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { generateUUID } from '../../utils/security';

export const societyOnboardingService = {
  async getSocietyDetails(societyId) {
    if (!societyId) return null;
    const docRef = doc(db, 'societies', societyId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async onboardSocietyBatch(cleanData) {
    const societyUUID = generateUUID();
    const societyId = `SOC-${cleanData.code.substring(0, 6)}`;
    const adminEmail = cleanData.email.toLowerCase();
    const tempPassword =
      cleanData.password ||
      `${cleanData.name.substring(0, 3).toUpperCase()}#${Math.floor(
        1000 + Math.random() * 9000
      )}`;
    const timestamp = new Date().toISOString();

    const batch = writeBatch(db);
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
      flats: Number(cleanData.flats) || 0,
      status: 'Active',
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
      createdBy: 'super_admin',
      updatedBy: 'super_admin',
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
        fullAddress:
          cleanData.fullAddress ||
          `${cleanData.addressLine1}, ${cleanData.area}, ${cleanData.city}, ${cleanData.pinCode}`,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
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
      deletedAt: null,
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
      deletedAt: null,
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
      deletedAt: null,
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
        city: cleanData.city,
      },
    });

    await batch.commit();

    return {
      societyName: cleanData.name,
      societyId: societyId,
      accessCode: cleanData.code,
      adminEmail: adminEmail,
      tempPassword: tempPassword,
    };
  },
};
