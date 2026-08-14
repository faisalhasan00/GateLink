import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, path) => ({ type: 'collection', path })),
  doc: vi.fn((...args) => {
    return { id: 'mock-super-doc-id', type: 'doc', path: 'mock/path' };
  }),
  getDocs: vi.fn(() => Promise.resolve({
    forEach: (cb) => {
      cb({ id: 'SOC-101', data: () => ({ name: 'Green Crest Society', code: 'GCN125', city: 'Mumbai' }) });
    },
    docs: [
      { id: 'SOC-101', data: () => ({ name: 'Green Crest Society', code: 'GCN125', city: 'Mumbai' }) }
    ]
  })),
  getDoc: vi.fn((ref) => Promise.resolve({
    exists: () => true,
    id: 'SOC-101',
    data: () => ({ name: 'Green Crest Society', code: 'GCN125', status: 'Active' })
  })),
  addDoc: vi.fn(() => Promise.resolve({ id: 'notif-123' })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn((query, callback) => {
    callback({
      docs: [{ id: 'soc-1', data: () => ({ name: 'Green Crest Society' }) }]
    });
    return vi.fn();
  }),
  query: vi.fn((col) => col),
  orderBy: vi.fn(),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    update: vi.fn(),
    commit: vi.fn(() => Promise.resolve())
  }))
}));

vi.mock('../firebase', () => ({
  db: { name: 'mockDb' }
}));

vi.mock('../utils/security', () => ({
  generateUUID: () => 'uuid-1234-5678'
}));

import { superAdminService } from './superAdminService';

describe('superAdminService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Societies Management & Subscriptions
  describe('Societies Management', () => {
    it('subscribes to all registered societies', () => {
      const callback = vi.fn();
      superAdminService.subscribeSocieties(callback);
      expect(callback).toHaveBeenCalledWith([{ id: 'soc-1', name: 'Green Crest Society' }]);
    });

    it('creates a new society record', async () => {
      const id = await superAdminService.createSociety({ name: 'Emerald Heights', code: 'EMH001' });
      expect(id).toBe('mock-super-doc-id');
    });

    it('executes atomic onboardSocietyBatch multi-document write', async () => {
      const result = await superAdminService.onboardSocietyBatch({
        name: 'Emerald Heights',
        code: 'EMH001',
        email: 'admin@emerald.com',
        city: 'Bengaluru',
        buildings: 'A, B',
        blocks: '2',
        floors: '10',
        flats: '100',
        phone: '9876543210'
      });
      expect(result.societyId).toBe('SOC-EMH001');
      expect(result.adminEmail).toBe('admin@emerald.com');
    });

    it('throws error when updating status without societyId', async () => {
      await expect(superAdminService.updateSocietyStatus('', 'Inactive')).rejects.toThrow('Society ID is required');
    });

    it('updates society features with toggle object', async () => {
      await expect(superAdminService.updateSocietyFeatures('SOC-101', { gatePass: true, onlinePayments: true })).resolves.not.toThrow();
    });
  });

  // 2. CRM Inbound Leads
  describe('CRM Lead Operations', () => {
    it('subscribes to inbound CRM leads', () => {
      const callback = vi.fn();
      superAdminService.subscribeCrmLeads(callback);
      expect(callback).toHaveBeenCalled();
    });

    it('creates lead entry from public web form', async () => {
      const id = await superAdminService.createLead({ fullName: 'Rajesh Kumar', phone: '9876543210' });
      expect(id).toBe('mock-super-doc-id');
    });

    it('updates lead status with notes', async () => {
      await expect(superAdminService.updateLeadStatus('lead-1', 'Contacted', 'Called resident committee')).resolves.not.toThrow();
    });

    it('throws error when deleting lead without leadId', async () => {
      await expect(superAdminService.deleteLead('')).rejects.toThrow('Lead ID is required');
    });
  });

  // 3. Ad Campaigns
  describe('Ad Campaigns Operations', () => {
    it('creates active ad campaign', async () => {
      const id = await superAdminService.createAdCampaign({ title: 'HDFC Home Loan Banner' });
      expect(id).toBe('mock-super-doc-id');
    });

    it('updates ad campaign status', async () => {
      await expect(superAdminService.updateAdCampaignStatus('ad-1', 'paused')).resolves.not.toThrow();
    });

    it('deletes ad campaign', async () => {
      await expect(superAdminService.deleteAdCampaign('ad-1')).resolves.not.toThrow();
    });
  });

  // 4. Notifications, Search & Global Audit
  describe('Global Operations', () => {
    it('handles system notification read requests', async () => {
      await expect(superAdminService.markNotificationRead('notif-1')).resolves.not.toThrow();
    });

    it('performs batch mark all notifications read', async () => {
      await expect(superAdminService.markAllNotificationsRead(['notif-1', 'notif-2'])).resolves.not.toThrow();
    });

    it('executes global platform search across societies', async () => {
      const results = await superAdminService.searchGlobalSocieties('Green');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('returns empty array if global search query is short', async () => {
      const results = await superAdminService.searchGlobalSocieties('a');
      expect(results).toEqual([]);
    });

    it('logs global audit actions', async () => {
      await expect(superAdminService.logGlobalAuditAction({ action: 'GLOBAL_SYSTEM_CONFIG' })).resolves.not.toThrow();
    });
  });
});
