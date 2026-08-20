import React from 'react';
import { Eye, CheckCircle, XCircle, Trash2, FileText } from 'lucide-react';

export default function ResidentTable({
  activeTab,
  activeList,
  pendingList,
  onSelectForView,
  onToggleStatus,
  onDeleteResident,
  onApprove,
  onReject,
  onOpenDocument
}) {
  if (activeTab === 'active') {
    return (
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
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                    No active residents found.
                  </td>
                </tr>
              ) : (
                activeList.map((r) => {
                  const residentName = r.name || r.fullName || r.displayName || (r.email ? r.email.split('@')[0].replace(/[._-]/g, ' ') : 'Resident');
                  const flatNo = r.flatNumber || r.unitNumber || r.flatNo || r.apartment || (r.buildingBlock ? `${r.buildingBlock}` : '-');
                  const roleLabel = r.residentRoleType || (r.role ? (r.role.charAt(0).toUpperCase() + r.role.slice(1)) : 'Resident');
                  const statusText = (r.status === 'pending' || r.status === 'pending_approval')
                    ? 'Pending'
                    : (r.status === 'suspended' || r.status === 'inactive')
                    ? 'Suspended'
                    : 'Active';
                  const isApproved = statusText === 'Active';

                  return (
                    <tr key={r.id}>
                      <td><strong style={{ fontSize: '14px', color: '#1E3A8A' }}>{flatNo}</strong></td>
                      <td>
                        <div>
                          <strong style={{ textTransform: 'capitalize' }}>{residentName}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{roleLabel}</div>
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
                        <span className={`badge ${isApproved ? 'success' : statusText === 'Pending' ? 'warning' : 'danger'}`}>
                          {statusText}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '12px', color: '#2563EB', borderColor: '#2563EB' }}
                            onClick={() => onSelectForView(r)}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '12px', color: isApproved ? 'var(--warning)' : 'var(--secondary)' }}
                            onClick={() => onToggleStatus(r.id, r.status)}
                          >
                            {isApproved ? <><XCircle size={14} /> Suspend</> : <><CheckCircle size={14} /> Activate</>}
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => onDeleteResident(r.id, residentName, flatNo)}
                            title="Delete Resident Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Pending Approvals Tab
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title" style={{ color: '#B45309' }}>Self-Registered Pending Approvals</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Verify residency documents and approve flat access permissions.
          </p>
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
                  No pending resident approvals. All mobile signups have been verified.
                </td>
              </tr>
            ) : (
              pendingList.map((r) => {
                const residentName = r.name || r.fullName || r.displayName || (r.email ? r.email.split('@')[0].replace(/[._-]/g, ' ') : 'Resident');
                const flatNo = r.flatNumber || r.unitNumber || r.flatNo || r.apartment || (r.buildingBlock ? `${r.buildingBlock}` : 'N/A');

                return (
                  <tr key={r.id}>
                    <td><strong style={{ fontSize: '15px', color: '#1E3A8A' }}>{flatNo}</strong></td>
                    <td><strong style={{ textTransform: 'capitalize' }}>{residentName}</strong></td>
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
                        style={{ padding: '4px 10px', fontSize: '12px', color: '#1E3A8A', borderColor: '#1E3A8A', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={(e) => onOpenDocument(e, r.documentProofUrl, r.documentType || 'Rent Agreement / Address Proof')}
                      >
                        <FileText size={14} /> View Proof
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '12px', color: '#1E3A8A', borderColor: '#1E3A8A' }}
                          onClick={() => onSelectForView(r)}
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#1E3A8A' }}
                          onClick={() => onApprove(r.id)}
                        >
                          <CheckCircle size={14} /> Approve Access
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                          onClick={() => onReject(r.id)}
                        >
                          <XCircle size={14} /> Decline
                        </button>
                        <button
                          className="btn-icon"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => onDeleteResident(r.id, residentName, flatNo)}
                          title="Delete Resident Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
