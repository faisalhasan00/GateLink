import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'societies/SOC-001/complaints'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, `societies/SOC-001/complaints`, id), { status: newStatus });
  };

  const pendingCount = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Completed').length;

  if (loading) return <div style={{ padding: '20px' }}>Loading complaints...</div>;

  return (
    <div>
      <div className="dashboard-grid">
        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <div className="stat-info">
            <p>Pending Complaints</p>
            <h3>{pendingCount}</h3>
          </div>
        </div>
        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <div className="stat-info">
            <p>Resolved Complaints</p>
            <h3>{resolvedCount}</h3>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Complaint Helpdesk</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{complaints.length} total</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Flat</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No complaints recorded.</td></tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id}>
                    <td><code>#{c.id.substring(0, 7)}</code></td>
                    <td>
                      <div>{c.block ? `${c.block} - ` : ''}{c.floor ? `Fl. ${c.floor}` : (c.flatNumber || 'N/A')}</div>
                      {c.priority && (
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Priority: {c.priority}</span>
                      )}
                    </td>
                    <td>{c.category || 'General'}</td>
                    <td>
                      <div>{c.title ? <strong>{c.title}</strong> : ''}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.description || '-'}</div>
                      {c.photoUrl && (
                        <a href={c.photoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--primary)' }}>View Photo</a>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${c.status === 'Completed' ? 'success' : c.status === 'In Progress' ? 'primary' : 'warning'}`}>
                        {c.status || 'Open'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px' }}
                        value={c.status || 'Open'}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
