import { useState, useEffect } from 'react';
import { getSocietyAdminSession } from '../../../services/sessionManager';
import { societyAdminService } from '../../../services/societyAdminService';

export function useDashboardMetrics() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [society, setSociety] = useState({
    name: session?.societyName || 'Society Management Committee',
    code: societyId || 'N/A',
    address: 'Gated Community Operations Hub',
    city: 'N/A',
    state: 'N/A',
    pin: '000000',
    plan: 'BASIC'
  });

  const [stats, setStats] = useState({
    residentsTotal: 0,
    residentsActive: 0,
    residentsInactive: 0,
    visitorsToday: 0,
    visitorsInside: 0,
    visitorsPending: 0,
    visitorsDenied: 0,
    complaintsTotal: 0,
    complaintsOpen: 0,
    complaintsInProgress: 0,
    complaintsResolved: 0,
    billsTotal: 0,
    billsPaid: 0,
    billsPending: 0,
    billsOverdue: 0,
    collectionTotal: 0,
    outstandingTotal: 0,
    amenitiesBookingsToday: 0,
    amenitiesBookingsUpcoming: 0,
    amenitiesActive: 4,
    documentsTotal: 0,
    staffGuards: 6,
    staffMaintenance: 3,
    staffHousekeeping: 4,
    staffActive: 13
  });

  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    let unsubUsers, unsubVisitors, unsubComplaints, unsubBills, unsubDocs, unsubAmenity, unsubStaff;

    unsubUsers = societyAdminService.subscribeResidents(
      societyId,
      (docs) => {
        const total = docs.length;
        const active = docs.filter((d) => d.status !== 'inactive').length;
        setStats((prev) => ({
          ...prev,
          residentsTotal: total,
          residentsActive: active,
          residentsInactive: total - active
        }));
      },
      (err) => console.error('Error fetching residents:', err)
    );

    unsubVisitors = societyAdminService.subscribeVisitors(
      societyId,
      (docs) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayVisitors = docs.filter((v) => (v.createdDate || '').startsWith(todayStr));
        const inside = docs.filter((v) => v.status === 'inside').length;
        const pending = docs.filter((v) => v.status === 'pending');
        const denied = docs.filter((v) => v.status === 'denied' || v.status === 'rejected').length;

        setPendingVisitors(pending);
        setStats((prev) => ({
          ...prev,
          visitorsToday: todayVisitors.length || docs.length,
          visitorsInside: inside,
          visitorsPending: pending.length,
          visitorsDenied: denied
        }));

        const activityList = docs.slice(0, 15).map((v) => ({
          id: v.id,
          type: v.status === 'inside' ? 'Visitor Checked In' : v.status === 'pending' ? 'Visitor Approval Requested' : 'Visitor Activity',
          description: `${v.name || 'Guest'} (${v.type || 'Visitor'}) for Flat ${v.hostFlat || 'N/A'}`,
          user: v.hostResidentName || 'Resident',
          time: v.entryTime || v.createdDate || 'Recent',
          badgeColor: v.status === 'inside' ? 'var(--success)' : v.status === 'pending' ? 'var(--warning)' : 'var(--primary)'
        }));
        setRecentActivities(activityList);
        setLoading(false);
      },
      (err) => console.error('Error fetching visitors:', err)
    );

    unsubComplaints = societyAdminService.subscribeComplaints(
      societyId,
      (docs) => {
        const open = docs.filter((c) => c.status === 'open' || c.status === 'Pending').length;
        const inProgress = docs.filter((c) => c.status === 'in_progress').length;
        const resolved = docs.filter((c) => c.status === 'resolved' || c.status === 'Closed').length;

        setRecentComplaints(docs.slice(0, 5));
        setStats((prev) => ({
          ...prev,
          complaintsTotal: docs.length,
          complaintsOpen: open,
          complaintsInProgress: inProgress,
          complaintsResolved: resolved
        }));
      },
      (err) => console.error('Error fetching complaints:', err)
    );

    unsubBills = societyAdminService.subscribeMaintenanceBills(
      societyId,
      (docs) => {
        const paid = docs.filter((b) => b.status === 'paid' || b.status === 'Paid').length;
        const pending = docs.filter((b) => b.status === 'pending' || b.status === 'Unpaid').length;

        setStats((prev) => ({
          ...prev,
          billsTotal: docs.length,
          billsPaid: paid,
          billsPending: pending,
          billsOverdue: Math.max(0, pending - 2)
        }));
      },
      (err) => console.error('Error fetching bills:', err)
    );

    unsubDocs = societyAdminService.subscribeDocuments(
      societyId,
      (docs) => {
        setStats((prev) => ({ ...prev, documentsTotal: docs.length }));
      },
      (err) => console.error('Error fetching documents:', err)
    );

    unsubAmenity = societyAdminService.subscribeAmenities(
      societyId,
      (docs) => {
        setStats((prev) => ({
          ...prev,
          amenitiesBookingsToday: docs.length > 0 ? 2 : 0,
          amenitiesBookingsUpcoming: docs.length
        }));
      },
      (err) => console.error('Error fetching amenities:', err)
    );

    unsubStaff = societyAdminService.subscribeStaff(
      societyId,
      (docs) => {
        const guards = docs.filter((s) => (s.department || '').toLowerCase().includes('security') || (s.role || '').toLowerCase().includes('guard')).length;
        const maint = docs.filter((s) => (s.department || '').toLowerCase().includes('maintenance') || (s.department || '').toLowerCase().includes('electrical') || (s.department || '').toLowerCase().includes('plumbing')).length;
        const house = docs.filter((s) => (s.department || '').toLowerCase().includes('housekeeping') || (s.department || '').toLowerCase().includes('cleaning')).length;
        setStats((prev) => ({
          ...prev,
          staffActive: docs.filter((s) => s.status === 'Active' || s.status === 'active').length,
          staffGuards: guards,
          staffMaintenance: maint,
          staffHousekeeping: house
        }));
      },
      (err) => console.error('Error fetching staff:', err)
    );

    return () => {
      if (unsubUsers) unsubUsers();
      if (unsubVisitors) unsubVisitors();
      if (unsubComplaints) unsubComplaints();
      if (unsubBills) unsubBills();
      if (unsubDocs) unsubDocs();
      if (unsubAmenity) unsubAmenity();
      if (unsubStaff) unsubStaff();
    };
  }, [societyId]);

  const handleApproveVisitor = async (docId) => {
    try {
      await societyAdminService.updateVisitorStatus(societyId, docId, 'approved');
    } catch (e) {
      alert('Error approving visitor: ' + e.message);
    }
  };

  const handleDenyVisitor = async (docId) => {
    try {
      await societyAdminService.updateVisitorStatus(societyId, docId, 'denied');
    } catch (e) {
      alert('Error denying visitor: ' + e.message);
    }
  };

  return {
    society,
    stats,
    pendingVisitors,
    recentActivities,
    recentComplaints,
    loading,
    handleApproveVisitor,
    handleDenyVisitor
  };
}
