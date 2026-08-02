import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, ShieldCheck, ShieldAlert, FileText, UserCheck, Phone, Mail } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', flatNumber: '', phone: '', email: '', password: '', role: 'resident', ownershipType: 'Owner' });

  useEffect(() => {
    const q = query(collection(db, 'societies/SOC-001/users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResidents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, `societies/SOC-001/users`, userId), { status: 'active' });
    } catch (e) {
      alert("Error approving resident: " + e.message);
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm("Are you sure you want to decline this resident registration?")) {
      try {
        await updateDoc(doc(db, `societies/SOC-001/users`, userId), { status: 'rejected' });
      } catch (e) {
        alert("Error declining resident: " + e.message);
      }
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' || currentStatus === 'approved' ? 'suspended' : 'active';
    await updateDoc(doc(db, `societies/SOC-001/users`, userId), { status: newStatus });
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      const newId = `manual_${Date.now()}`;
      await setDoc(doc(db, 'societies/SOC-001/users', newId), {
        uid: newId,
        ...formData,
        status: 'active',
        societyId: 'SOC-001',
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ name: '', flatNumber: '', phone: '', email: '', password: '', role: 'resident', ownershipType: 'Owner' });
    } catch (error) {
      alert("Error adding resident: " + error.message);
    }
  };

  const pendingList = residents.filter(r => r.status === 'pending' || r.status === 'pending_approval');
  const activeList = residents.filter(r => r.status === 'active' || r.status === 'approved' || r.status === 'suspended');

  if (loading) return <div style={{ padding: '20px' }}>Loading resident directory...</div>;

  return (
    <div>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>Resident Directory & Access Control</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Approve new self-registered residents, manage flat rosters, and control access permissions.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Resident Manually
        </button>
      </div>

      {/* Filter Tabs Header */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'active' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'active' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Active Roster ({activeList.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'pending' ? '#D97706' : pendingList.length > 0 ? '#FFFBEB' : 'transparent',
            color: activeTab === 'pending' ? '#FFFFFF' : pendingList.length > 0 ? '#B45309' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🔥 Pending Approvals</span>
          {pendingList.length > 0 && (
            <span style={{ background: activeTab === 'pending' ? '#FFFFFF' : '#D97706', color: activeTab === 'pending' ? '#D97706' : '#FFFFFF', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: 900 }}>
              {pendingList.length}
            </span>
          )}
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'active' ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Verified Residents & Flat Directory</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{activeList.length} residents</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Flat No.</th>
                  <th>Resident Name</th>
                  <th>Contact Info</th>
                  <th>Ownership</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeList.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No active residents found.</td></tr>
                ) : (
                  activeList.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.flatNumber || '-'}</strong></td>
                      <td>
                        <div>
                          <strong>{r.name}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.role}</div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px' }}>
                          {r.phone && <div>📞 {r.phone}</div>}
                          {r.email && <div style={{ color: '#2563EB' }}>✉️ {r.email}</div>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${r.ownershipType === 'Tenant' ? 'warning' : 'primary'}`}>
                          {r.ownershipType || 'Owner'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${(r.status === 'active' || r.status === 'approved') ? 'success' : 'danger'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '12px', color: (r.status === 'active' || r.status === 'approved') ? 'var(--danger)' : 'var(--secondary)' }}
                          onClick={() => toggleStatus(r.id, r.status)}
                        >
                          {(r.status === 'active' || r.status === 'approved') ? <><XCircle size={14} /> Suspend</> : <><CheckCircle size={14} /> Activate</>}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Pending Approvals Tab View */
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: '#B45309' }}>🔥 Self-Registered Pending Approvals</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Verify residency documents and approve flat access permissions.</p>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#B45309' }}>{pendingList.length} pending</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Requested Flat</th>
                  <th>Full Name</th>
                  <th>Email & Contact</th>
                  <th>Ownership Type</th>
                  <th>Proof Document</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      🎉 No pending resident approvals! All mobile signups have been verified.
                    </td>
                  </tr>
                ) : (
                  pendingList.map((r) => (
                    <tr key={r.id}>
                      <td><strong style={{ fontSize: '15px', color: '#2563EB' }}>{r.flatNumber || 'N/A'}</strong></td>
                      <td><strong>{r.name}</strong></td>
                      <td>
                        <div>
                          <div>✉️ {r.email}</div>
                          {r.phone && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📞 {r.phone}</div>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${r.ownershipType === 'Tenant' ? 'warning' : 'primary'}`}>
                          {r.ownershipType || 'Owner'}
                        </span>
                      </td>
                      <td>
                        {r.documentProofUrl ? (
                          <a href={r.documentProofUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563EB', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FileText size={14} /> View Proof
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.documentType || 'Rent Agreement'}</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#00B589' }}
                            onClick={() => handleApprove(r.id)}
                          >
                            <CheckCircle size={14} /> Approve Access
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                            onClick={() => handleReject(r.id)}
                          >
                            <XCircle size={14} /> Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Add Resident Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Resident Manually</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            <form onSubmit={handleAddResident}>
              <div className="form-group">
                <label>Full Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Arjun Kumar" />
              </div>
              <div className="form-group">
                <label>Flat Number *</label>
                <input required type="text" value={formData.flatNumber} onChange={e => setFormData({ ...formData, flatNumber: e.target.value })} placeholder="e.g. A-101" />
              </div>
              <div className="form-group">
                <label>Ownership Type</label>
                <select value={formData.ownershipType} onChange={e => setFormData({ ...formData, ownershipType: e.target.value })}>
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="resident@email.com" />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Resident</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
