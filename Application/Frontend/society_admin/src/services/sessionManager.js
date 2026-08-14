/**
 * Enterprise Multi-Session Manager for SocietySphere Admin Panels
 * Ensures strict role-isolated session namespaces in localStorage to prevent 
 * cross-tab session overwrites between Society Admin and Super Admin portals.
 */

const SOCIETY_ADMIN_KEY = 'auth:society-admin';
const SUPER_ADMIN_KEY = 'auth:super-admin';

// 1. Society Admin Session Handlers
export const getSocietyAdminSession = () => {
  try {
    const raw = localStorage.getItem(SOCIETY_ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading society admin session:', e);
    return null;
  }
};

export const setSocietyAdminSession = (sessionData) => {
  try {
    const payload = {
      email: sessionData.email || 'admin@society.com',
      role: 'society_admin',
      societyId: sessionData.societyId || null,
      token: sessionData.token || `soc_${Date.now()}`,
      updatedAt: Date.now()
    };
    localStorage.setItem(SOCIETY_ADMIN_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Error setting society admin session:', e);
  }
};

export const clearSocietyAdminSession = () => {
  try {
    localStorage.removeItem(SOCIETY_ADMIN_KEY);
  } catch (e) {
    console.error('Error clearing society admin session:', e);
  }
};

// 2. Super Admin Session Handlers
export const getSuperAdminSession = () => {
  try {
    const raw = localStorage.getItem(SUPER_ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading super admin session:', e);
    return null;
  }
};

export const setSuperAdminSession = (sessionData) => {
  try {
    const payload = {
      email: sessionData.email || 'mohammedfaisalhasan@gmail.com',
      role: 'super_admin',
      token: sessionData.token || `super_${Date.now()}`,
      updatedAt: Date.now()
    };
    localStorage.setItem(SUPER_ADMIN_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Error setting super admin session:', e);
  }
};

export const clearSuperAdminSession = () => {
  try {
    localStorage.removeItem(SUPER_ADMIN_KEY);
  } catch (e) {
    console.error('Error clearing super admin session:', e);
  }
};
