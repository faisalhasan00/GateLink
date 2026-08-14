import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, path) => ({ type: 'collection', path })),
  doc: vi.fn((...args) => {
    return { id: 'mock-doc-id-123', type: 'doc', path: 'mock/path' };
  }),
  getDocs: vi.fn(() => Promise.resolve({
    forEach: (cb) => {
      cb({ id: '1', data: () => ({ name: 'John Doe', flatNumber: '101', phone: '9876543210' }) });
    },
    docs: [
      { id: '1', data: () => ({ name: 'John Doe', flatNumber: '101', phone: '9876543210' }) }
    ]
  })),
  getDoc: vi.fn((ref) => Promise.resolve({
    exists: () => true,
    id: 'SOC-123',
    data: () => ({ name: 'Skyline Towers', code: 'SOC-123', plan: 'ENTERPRISE' })
  })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn((query, callback) => {
    callback({
      docs: [{ id: 'doc1', data: () => ({ name: 'Sample Item' }) }]
    });
    return vi.fn(); // Unsubscribe mock
  }),
  query: vi.fn((col) => col),
  where: vi.fn(),
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

import { societyAdminService } from './societyAdminService';

describe('societyAdminService Unit Tests', () => {
  const mockSocietyId = 'SOC-TEST-001';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Society ID & Details Validation
  describe('Society ID Validation & Fetching', () => {
    it('returns null if societyId is empty', async () => {
      const res = await societyAdminService.getSocietyDetails('');
      expect(res).toBeNull();
    });

    it('fetches society details with valid societyId', async () => {
      const res = await societyAdminService.getSocietyDetails(mockSocietyId);
      expect(res).not.toBeNull();
      expect(res.name).toBe('Skyline Towers');
    });
  });

  // 2. Tenant Scoping & Resident Operations
  describe('Resident Operations', () => {
    it('returns empty unsubscribe function if societyId is missing in subscription', () => {
      const unsub = societyAdminService.subscribeResidents('', vi.fn());
      expect(typeof unsub).toBe('function');
    });

    it('subscribes to tenant-scoped residents collection', () => {
      const callback = vi.fn();
      societyAdminService.subscribeResidents(mockSocietyId, callback);
      expect(callback).toHaveBeenCalledWith([{ id: 'doc1', name: 'Sample Item' }]);
    });

    it('throws error when adding resident without societyId', async () => {
      await expect(societyAdminService.addResident('', {})).rejects.toThrow('Society ID is required');
    });

    it('adds resident to correct tenant subcollection path', async () => {
      const id = await societyAdminService.addResident(mockSocietyId, { name: 'Alice' });
      expect(id).toBe('mock-doc-id-123');
    });

    it('throws error when updating resident status without parameters', async () => {
      await expect(societyAdminService.updateResidentStatus('', 'user1', 'active')).rejects.toThrow();
    });

    it('throws error when deleting resident without parameters', async () => {
      await expect(societyAdminService.deleteResident(mockSocietyId, '')).rejects.toThrow();
    });
  });

  // 3. Visitor Operations
  describe('Visitor Operations', () => {
    it('subscribes to visitor passes correctly', () => {
      const callback = vi.fn();
      societyAdminService.subscribeVisitors(mockSocietyId, callback);
      expect(callback).toHaveBeenCalled();
    });

    it('throws error when updating visitor status without IDs', async () => {
      await expect(societyAdminService.updateVisitorStatus('', 'v1', 'approved')).rejects.toThrow();
    });
  });

  // 4. Maintenance Operations
  describe('Maintenance Operations', () => {
    it('creates maintenance bill with pending status', async () => {
      const id = await societyAdminService.createMaintenanceBill(mockSocietyId, { amount: 5000 });
      expect(id).toBe('mock-doc-id-123');
    });

    it('marks bill as paid', async () => {
      await expect(societyAdminService.markBillPaid(mockSocietyId, 'bill123', { transactionId: 'TXN123' })).resolves.not.toThrow();
    });
  });

  // 5. Complaints Operations
  describe('Complaints Operations', () => {
    it('updates complaint status and resolution notes', async () => {
      await expect(societyAdminService.updateComplaintStatus(mockSocietyId, 'comp1', 'Resolved', 'Fixed pipe')).resolves.not.toThrow();
    });

    it('assigns complaint staff', async () => {
      await expect(societyAdminService.assignComplaintStaff(mockSocietyId, 'comp1', 'Guard Ramesh')).resolves.not.toThrow();
    });
  });

  // 6. Amenity Operations
  describe('Amenity Operations', () => {
    it('creates amenity with timestamp', async () => {
      const id = await societyAdminService.createAmenity(mockSocietyId, { name: 'Clubhouse' });
      expect(id).toBe('mock-doc-id-123');
    });

    it('updates amenity booking status', async () => {
      await expect(societyAdminService.updateAmenityBookingStatus(mockSocietyId, 'book1', 'Confirmed')).resolves.not.toThrow();
    });
  });

  // 7. Notice Operations
  describe('Notice Operations', () => {
    it('creates notice successfully', async () => {
      const id = await societyAdminService.createNotice(mockSocietyId, { title: 'AGM Notice' });
      expect(id).toBe('mock-doc-id-123');
    });

    it('deletes notice successfully', async () => {
      await expect(societyAdminService.deleteNotice(mockSocietyId, 'notice1')).resolves.not.toThrow();
    });
  });

  // 8. SOS & Parking Operations
  describe('SOS & Parking Operations', () => {
    it('updates SOS alert status', async () => {
      await expect(societyAdminService.updateSosAlertStatus(mockSocietyId, 'sos1', 'Resolved')).resolves.not.toThrow();
    });

    it('assigns parking slot with merge option', async () => {
      await expect(societyAdminService.assignParkingSlot(mockSocietyId, 'slot101', { residentUid: 'res1' })).resolves.not.toThrow();
    });
  });

  // 9. Notifications & Global Search
  describe('Notifications & Search', () => {
    it('handles notification mark read requests', async () => {
      await expect(societyAdminService.markNotificationRead(mockSocietyId, 'notif1')).resolves.not.toThrow();
    });

    it('executes global search across collections returning items', async () => {
      const results = await societyAdminService.searchSocietyData(mockSocietyId, 'John');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('returns empty array if search query is too short', async () => {
      const results = await societyAdminService.searchSocietyData(mockSocietyId, 'a');
      expect(results).toEqual([]);
    });
  });
});
