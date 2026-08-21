import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, firebaseConfig } from '../firebase';
import { MASTER_SUPER_ADMIN_EMAIL } from '../context/SuperAdminAuthContext';

export const PERMISSION_MODULES = [
  {
    key: 'overview',
    label: 'SaaS Platform Analytics',
    description: 'View platform MRR, total societies, and active subscription statistics.',
    category: 'Core'
  },
  {
    key: 'societies',
    label: 'Societies & Licensing',
    description: 'Onboard new societies, manage trial dates, and update subscription plans.',
    category: 'Operations'
  },
  {
    key: 'delete_society',
    label: 'Delete / Suspend Society',
    description: 'Permanent deletion or hard suspension of a society account.',
    category: 'Danger Zone',
    isDangerous: true
  },
  {
    key: 'crm',
    label: 'Sales CRM & Leads',
    description: 'View, assign, and update society onboarding leads and demo requests.',
    category: 'Sales'
  },
  {
    key: 'partners',
    label: 'Partner Deals & Network',
    description: 'Track channel partner referrals, verified accounts, and commission ledger.',
    category: 'Partners'
  },
  {
    key: 'approve_payout',
    label: 'Approve Partner Monthly UPI Payouts',
    description: 'Disburse and mark recurring UPI payouts as paid.',
    category: 'Finance',
    isDangerous: true
  },
  {
    key: 'notifications',
    label: 'Universal Push Notifications',
    description: 'Dispatch emergency or global push notification broadcasts.',
    category: 'Marketing'
  },
  {
    key: 'ads',
    label: 'Ad Banners & Campaigns',
    description: 'Create, schedule, and approve in-app promotional ad campaigns.',
    category: 'Marketing'
  },
  {
    key: 'team',
    label: 'Team & Staff Management',
    description: 'Create, modify, and manage employee roles and system permissions.',
    category: 'Administration',
    isDangerous: true
  },
];

export const ROLE_PRESETS = {
  'Sales & Onboarding': {
    label: 'Sales & Onboarding Specialist',
    description: 'Handles CRM leads, demos, and society setup without financial/delete access.',
    permissions: {
      overview: true,
      societies: true,
      delete_society: false,
      crm: true,
      partners: false,
      approve_payout: false,
      notifications: true,
      ads: false,
      team: false
    }
  },
  'Customer Support': {
    label: 'Customer Support Lead',
    description: 'Assists societies with issues and push announcements without editing plans.',
    permissions: {
      overview: true,
      societies: true,
      delete_society: false,
      crm: false,
      partners: false,
      approve_payout: false,
      notifications: true,
      ads: false,
      team: false
    }
  },
  'Marketing & Growth': {
    label: 'Marketing & Growth Manager',
    description: 'Manages in-app sponsored campaigns, universal alerts, and push campaigns.',
    permissions: {
      overview: true,
      societies: false,
      delete_society: false,
      crm: false,
      partners: false,
      approve_payout: false,
      notifications: true,
      ads: true,
      team: false
    }
  },
  'Finance & Partner Ops': {
    label: 'Finance & Partner Operations',
    description: 'Manages partner referral deals and commission payouts.',
    permissions: {
      overview: true,
      societies: false,
      delete_society: false,
      crm: false,
      partners: true,
      approve_payout: true,
      notifications: false,
      ads: false,
      team: false
    }
  },
  'Custom Staff': {
    label: 'Custom Role',
    description: 'Select custom permissions tailored to specific employee responsibilities.',
    permissions: {
      overview: true,
      societies: false,
      delete_society: false,
      crm: false,
      partners: false,
      approve_payout: false,
      notifications: false,
      ads: false,
      team: false
    }
  }
};

/**
 * Real-time listener for all super admin team members.
 */
export function subscribeToTeamMembers(callback) {
  const teamRef = collection(db, 'super_admin_team');
  const q = query(teamRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const members = [];
    snapshot.forEach((docSnap) => {
      members.push({ id: docSnap.id, ...docSnap.data() });
    });
    callback(members);
  }, (error) => {
    console.error('Error fetching team members:', error);
    callback([]);
  });
}

/**
 * Creates a new team member account in Firebase Auth and Firestore record.
 * Uses a isolated secondary Firebase App instance so the current Master Admin stays logged in.
 */
export async function createTeamMember({ name, email, password, role, permissions, phone = '' }) {
  const cleanEmail = email.trim().toLowerCase();

  if (cleanEmail === MASTER_SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Cannot create another account with Master Super Admin email.');
  }

  // 1. Create User in Firebase Auth using a secondary temporary app
  const secondaryAppName = `SecondaryApp_${Date.now()}`;
  let secondaryApp = null;

  try {
    secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
    const secondaryAuth = getAuth(secondaryApp);
    
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password);
    const newUid = userCredential.user.uid;

    // Immediately sign out secondary auth instance
    await signOut(secondaryAuth);

    const nowIso = new Date().toISOString();

    // 2. Save Staff Record in Firestore super_admin_team collection
    const staffData = {
      id: newUid,
      uid: newUid,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      role: role || 'Custom Staff',
      status: 'Active',
      permissions: permissions || {},
      createdBy: MASTER_SUPER_ADMIN_EMAIL,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await setDoc(doc(db, 'super_admin_team', newUid), staffData);

    // Also mirror in /users collection for universal platform discovery
    await setDoc(doc(db, 'users', newUid), {
      _id: newUid,
      uid: newUid,
      name: name.trim(),
      email: cleanEmail,
      role: 'super_admin',
      userType: 'employee',
      status: 'active',
      permissions: permissions || {},
      createdAt: nowIso,
    }, { merge: true });

    return staffData;
  } finally {
    if (secondaryApp) {
      try {
        await deleteApp(secondaryApp);
      } catch (_) {}
    }
  }
}

/**
 * Updates an existing team member's role and permission matrix.
 */
export async function updateTeamMemberPermissions(memberId, { role, permissions, name, phone }) {
  const docRef = doc(db, 'super_admin_team', memberId);
  const nowIso = new Date().toISOString();

  const updatePayload = {
    role,
    permissions,
    updatedAt: nowIso,
  };
  if (name) updatePayload.name = name.trim();
  if (phone !== undefined) updatePayload.phone = phone.trim();

  await updateDoc(docRef, updatePayload);

  // Update mirrored /users record
  try {
    await updateDoc(doc(db, 'users', memberId), {
      role: 'super_admin',
      permissions,
      updatedAt: nowIso,
      ...(name ? { name: name.trim() } : {})
    });
  } catch (_) {}
}

/**
 * Toggles an employee between 'Active' and 'Suspended'.
 */
export async function toggleTeamMemberStatus(memberId, currentStatus) {
  const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
  const nowIso = new Date().toISOString();

  await updateDoc(doc(db, 'super_admin_team', memberId), {
    status: newStatus,
    updatedAt: nowIso,
  });

  try {
    await updateDoc(doc(db, 'users', memberId), {
      status: newStatus.toLowerCase(),
      updatedAt: nowIso,
    });
  } catch (_) {}

  return newStatus;
}

/**
 * Deletes a team member from the team directory.
 */
export async function deleteTeamMember(memberId) {
  await deleteDoc(doc(db, 'super_admin_team', memberId));

  try {
    await updateDoc(doc(db, 'users', memberId), {
      status: 'deleted',
      updatedAt: new Date().toISOString(),
    });
  } catch (_) {}
}
