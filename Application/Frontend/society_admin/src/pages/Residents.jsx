import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, FileText, Eye, EyeOff, RefreshCw, Copy, Trash2 } from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

const generateSecurePassword = () => {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#$';
  let pass = '';
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResidentForView, setSelectedResidentForView] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    flatNumber: '', 
    phone: '', 
    email: '', 
    password: generateSecurePassword(), 
    role: 'resident', 
    ownershipType: 'Owner' 
  });

  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }
    const unsubscribe = societyAdminService.subscribeResidents(
      societyId,
      (data) => {
        setResidents(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching residents:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [societyId]);

  const handleApprove = async (userId) => {
    try {
      await societyAdminService.updateResidentStatus(societyId, userId, 'active');
    } catch (e) {
      alert("Error approving resident: " + e.message);
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm("Are you sure you want to decline this resident registration?")) {
      try {
        await societyAdminService.updateResidentStatus(societyId, userId, 'rejected');
      } catch (e) {
        alert("Error declining resident: " + e.message);
      }
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' || currentStatus === 'approved' ? 'suspended' : 'active';
    try {
      await societyAdminService.updateResidentStatus(societyId, userId, newStatus);
    } catch (e) {
      alert("Error updating status: " + e.message);
    }
  };

  const handleDeleteResident = async (userId, name, flatNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete resident record for "${name}" (Flat: ${flatNumber || 'N/A'})?\n\nThis will remove their access permissions from the society directory.`)) {
      return;
    }
    try {
      await societyAdminService.deleteResident(societyId, userId);
      alert(`Successfully deleted resident record for "${name}".`);
    } catch (e) {
      alert("Error deleting resident: " + e.message);
    }
  };

  const handleOpenDocument = (e, url, typeName = 'Residence Document Proof') => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!url || url === '#' || url.trim() === '') {
      alert(`Document Info:\n\nType: ${typeName}\nStatus: Attached during mobile registration.`);
      return;
    }
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
      setFullscreenImage({ url, title: typeName });
    } else {
      alert(`Resident Verification Proof:\n\nType: ${typeName}\nAttachment Reference: ${url}`);
    }
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      await societyAdminService.addResident(societyId, formData);
      setIsModalOpen(false);
      setFormData({ name: '', flatNumber: '', phone: '', email: '', password: generateSecurePassword(), role: 'resident', ownershipType: 'Owner' });
    } catch (error) {
      alert("Error adding resident: " + error.message);
    }
  };

  const pendingList = residents.filter(r => r.status === 'pending' || r.status === 'pending_approval');
  const activeList = residents.filter(r => r.status === 'active' || r.status === 'approved' || r.status === 'suspended');

  if (loading) return <div style={{ padding: '20px' }}>Loading resident directory...</div>;

  return (
    <div>
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
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '12px', color: '#2563EB', borderColor: '#2563EB' }}
                            onClick={() => setSelectedResidentForView(r)}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '12px', color: (r.status === 'active' || r.status === 'approved') ? 'var(--warning)' : 'var(--secondary)' }}
                            onClick={() => toggleStatus(r.id, r.status)}
                          >
                            {(r.status === 'active' || r.status === 'approved') ? <><XCircle size={14} /> Suspend</> : <><CheckCircle size={14} /> Activate</>}
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => handleDeleteResident(r.id, r.name, r.flatNumber)}
                            title="Delete Resident Record"
                          >
                            <Trash2 size={16} />
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
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '12px', color: '#2563EB', borderColor: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={(e) => handleOpenDocument(e, r.documentProofUrl, r.documentType || 'Rent Agreement / Address Proof')}
                        >
                          <FileText size={14} /> View Proof
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => handleDeleteResident(r.id, r.name, r.flatNumber)}
                            title="Delete Resident Record"
                          >
                            <Trash2 size={16} />
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

      {selectedResidentForView && (
        <div className="modal-overlay" onClick={() => setSelectedResidentForView(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Resident Profile & Verification</h3>
              <button onClick={() => setSelectedResidentForView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{selectedResidentForView.name}</h4>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Flat: <strong>{selectedResidentForView.flatNumber}</strong></div>
                </div>
                <span className={`badge ${selectedResidentForView.status === 'active' || selectedResidentForView.status === 'approved' ? 'success' : selectedResidentForView.status === 'pending' || selectedResidentForView.status === 'pending_approval' ? 'warning' : 'danger'}`}>
                  {selectedResidentForView.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>MOBILE PHONE</label>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>📞 {selectedResidentForView.phone || 'N/A'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                  <div style={{ fontSize: '14px', color: '#2563EB', fontWeight: 600 }}>✉️ {selectedResidentForView.email || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#FFFBEB', padding: '12px 16px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>RESIDENT ROLE TYPE</label>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400E' }}>{selectedResidentForView.residentRoleType || selectedResidentForView.ownershipType || 'Flat Owner'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>OCCUPANCY STATUS</label>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400E' }}>{selectedResidentForView.occupancyStatus || 'Currently residing'}</div>
                </div>
              </div>

              {selectedResidentForView.password && (
                <div style={{ background: '#EFF6FF', padding: '12px 16px', borderRadius: '8px', border: '1px solid #BFDBFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', display: 'block', marginBottom: '2px' }}>RESIDENT LOGIN PASSWORD</label>
                    <code style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 800 }}>{selectedResidentForView.password}</code>
                  </div>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(selectedResidentForView.password);
                      alert('Password copied to clipboard!');
                    }}
                  >
                    <Copy size={12} /> Copy Password
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  type="button"
                  className="btn btn-outline" 
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }} 
                  onClick={() => { handleDeleteResident(selectedResidentForView.id, selectedResidentForView.name, selectedResidentForView.flatNumber); setSelectedResidentForView(null); }}
                >
                  <Trash2 size={14} /> Delete Resident
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setSelectedResidentForView(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <label>Email Address *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="resident@email.com" />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Resident Login Password *
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, password: generateSecurePassword() })} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={12} /> Auto-Generate Password
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input 
                      required 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Enter or generate resident password" 
                      value={formData.password} 
                      onChange={e => setFormData({ ...formData, password: e.target.value })} 
                      style={{ width: '100%', padding: '10px 36px 10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      navigator.clipboard.writeText(formData.password);
                      alert('Password copied to clipboard!');
                    }} 
                    className="btn btn-outline" 
                    style={{ padding: '9px 12px', fontSize: '12px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>
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
