import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, ShieldCheck, ShieldAlert, FileText, UserCheck, Phone, Mail, Eye } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getSocietyAdminSession } from '../services/sessionManager';

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResidentForView, setSelectedResidentForView] = useState(null);
  const [formData, setFormData] = useState({ name: '', flatNumber: '', phone: '', email: '', password: '', role: 'resident', ownershipType: 'Owner' });

  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  useEffect(() => {
    const q = query(collection(db, `societies/${societyId}/users`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResidents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [societyId]);

  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, `societies/${societyId}/users`, userId), { status: 'active' });
    } catch (e) {
      alert("Error approving resident: " + e.message);
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm("Are you sure you want to decline this resident registration?")) {
      try {
        await updateDoc(doc(db, `societies/${societyId}/users`, userId), { status: 'rejected' });
      } catch (e) {
        alert("Error declining resident: " + e.message);
      }
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' || currentStatus === 'approved' ? 'suspended' : 'active';
    await updateDoc(doc(db, `societies/${societyId}/users`, userId), { status: newStatus });
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      const newId = `manual_${Date.now()}`;
      await setDoc(doc(db, `societies/${societyId}/users`, newId), {
        uid: newId,
        ...formData,
        status: 'active',
        societyId: societyId,
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
            Approve new self-registered residents, manage flat rosters, and control access permissions. (Society ID: <code>{societyId}</code>)
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '12px', color: '#2563EB', borderColor: '#2563EB' }}
                            onClick={() => setSelectedResidentForView(r)}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '12px', color: (r.status === 'active' || r.status === 'approved') ? 'var(--danger)' : 'var(--secondary)' }}
                            onClick={() => toggleStatus(r.id, r.status)}
                          >
                            {(r.status === 'active' || r.status === 'approved') ? <><XCircle size={14} /> Suspend</> : <><CheckCircle size={14} /> Activate</>}
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
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '12px', color: '#2563EB', borderColor: '#2563EB' }}
                            onClick={() => setSelectedResidentForView(r)}
                          >
                            <Eye size={14} /> View Details
                          </button>
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

      {/* Resident Details Modal */}
      {selectedResidentForView && (
        <div className="modal-overlay" onClick={() => setSelectedResidentForView(null)}>
          <div className="modal-content" style={{ maxWidth: '620px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Resident Access Details</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>UID: <code>{selectedResidentForView.uid || selectedResidentForView.id}</code></span>
              </div>
              <button onClick={() => setSelectedResidentForView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
              {/* Flat & Status Box */}
              <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>REQUESTED UNIT</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563EB' }}>
                    {selectedResidentForView.societyName || 'Housing Society'} — Flat {selectedResidentForView.flatNumber || selectedResidentForView.unitNumber || 'N/A'}
                  </div>
                  {selectedResidentForView.buildingBlock && (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Building / Block: <strong>{selectedResidentForView.buildingBlock}</strong>
                    </div>
                  )}
                </div>
                <span className={`badge ${selectedResidentForView.status === 'active' || selectedResidentForView.status === 'approved' ? 'success' : 'warning'}`} style={{ fontSize: '13px', padding: '6px 12px' }}>
                  {selectedResidentForView.status}
                </span>
              </div>

              {/* Personal Contact Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>FULL NAME</label>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{selectedResidentForView.name}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>MOBILE PHONE</label>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>📞 {selectedResidentForView.phone || 'N/A'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                  <div style={{ fontSize: '14px', color: '#2563EB', fontWeight: 600 }}>✉️ {selectedResidentForView.email || 'N/A'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>LOCATION</label>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedResidentForView.city || 'Hyderabad'}, {selectedResidentForView.country || 'India'}</div>
                </div>
              </div>

              {/* Resident Role & Occupancy */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: '#FFFBEB', padding: '12px 16px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>RESIDENT ROLE TYPE</label>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400E' }}>{selectedResidentForView.residentRoleType || selectedResidentForView.ownershipType || 'Flat Owner'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>OCCUPANCY STATUS</label>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400E' }}>{selectedResidentForView.occupancyStatus || 'Currently residing'}</div>
                </div>
              </div>

              {/* Proof Document Verification */}
              <div style={{ background: '#F1F5F9', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>ADDRESS PROOF DOCUMENT</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>📄 {selectedResidentForView.documentType || 'Rent Agreement / Utility Bill'}</div>
                    {selectedResidentForView.documentProofUrl && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedResidentForView.documentProofUrl.split('/').pop()}</div>
                    )}
                  </div>
                  {selectedResidentForView.documentProofUrl ? (
                    <a href={selectedResidentForView.documentProofUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '12px', textDecoration: 'none' }}>
                      View Document ➔
                    </a>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Attachment on file</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-outline" onClick={() => setSelectedResidentForView(null)}>Close</button>
              {selectedResidentForView.status === 'pending_approval' || selectedResidentForView.status === 'pending' ? (
                <>
                  <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => { handleReject(selectedResidentForView.id); setSelectedResidentForView(null); }}>
                    Decline Registration
                  </button>
                  <button className="btn btn-primary" style={{ backgroundColor: '#00B589' }} onClick={() => { handleApprove(selectedResidentForView.id); setSelectedResidentForView(null); }}>
                    Approve Access ➔
                  </button>
                </>
              ) : null}
            </div>
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
