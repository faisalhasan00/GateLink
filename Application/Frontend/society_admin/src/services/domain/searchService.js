import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export const searchService = {
  async searchSocietyData(societyId, queryText) {
    if (!societyId || !queryText || queryText.length < 2) return [];
    const q = queryText.toLowerCase().trim();
    const searchResults = [];

    const [snapUsers, snapVisitors, snapComplaints, snapBills] =
      await Promise.all([
        getDocs(collection(db, `societies/${societyId}/users`)),
        getDocs(collection(db, `societies/${societyId}/visitors`)),
        getDocs(collection(db, `societies/${societyId}/complaints`)),
        getDocs(collection(db, `societies/${societyId}/maintenance_bills`)),
      ]);

    snapUsers.forEach((d) => {
      const u = d.data();
      if (
        (u.name || '').toLowerCase().includes(q) ||
        (u.flatNumber || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q)
      ) {
        searchResults.push({
          id: d.id,
          title: u.name || 'Resident',
          subtitle: `Flat ${u.flatNumber || 'N/A'} • ${u.phone || 'Resident'}`,
          type: 'Resident',
          path: '/residents',
        });
      }
    });

    snapVisitors.forEach((d) => {
      const v = d.data();
      if (
        (v.name || '').toLowerCase().includes(q) ||
        (v.hostFlat || '').toLowerCase().includes(q) ||
        (v.phone || '').includes(q)
      ) {
        searchResults.push({
          id: d.id,
          title: v.name || 'Visitor',
          subtitle: `Flat ${v.hostFlat} • ${v.type || 'Guest'}`,
          type: 'Visitor',
          path: '/visitors',
        });
      }
    });

    snapComplaints.forEach((d) => {
      const c = d.data();
      if (
        (c.title || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.flatNumber || '').toLowerCase().includes(q)
      ) {
        searchResults.push({
          id: d.id,
          title: c.title || 'Complaint',
          subtitle: `Flat ${c.flatNumber || 'N/A'} • ${c.category || 'General'}`,
          type: 'Complaint',
          path: '/complaints',
        });
      }
    });

    snapBills.forEach((d) => {
      const b = d.data();
      if (
        (b.billNumber || d.id).toLowerCase().includes(q) ||
        (b.residentName || '').toLowerCase().includes(q)
      ) {
        searchResults.push({
          id: d.id,
          title: `Bill #${b.billNumber || d.id.substring(0, 6)}`,
          subtitle: `${b.residentName} • ₹${b.amount}`,
          type: 'Maintenance Bill',
          path: '/maintenance',
        });
      }
    });

    return searchResults.slice(0, 10);
  },
};
