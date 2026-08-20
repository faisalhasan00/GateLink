import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

export default function ResidentProfileModal({ resident, onClose, onDelete }) {
  if (!resident) return null;

  const isApproved = resident.status === 'active' || resident.status === 'approved';
  const isPending = resident.status === 'pending' || resident.status === 'pending_approval';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Resident Profile & Verification</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{resident.name}</h4>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Flat: <strong>{resident.flatNumber}</strong></div>
            </div>
            <span className={`badge ${isApproved ? 'success' : isPending ? 'warning' : 'danger'}`}>
              {resident.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>MOBILE PHONE</label>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>📞 {resident.phone || 'N/A'}</div>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
              <div style={{ fontSize: '14px', color: '#2563EB', fontWeight: 600 }}>✉️ {resident.email || 'N/A'}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#FFFBEB', padding: '12px 16px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>RESIDENT ROLE TYPE</label>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400E' }}>{resident.residentRoleType || resident.ownershipType || 'Flat Owner'}</div>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>OCCUPANCY STATUS</label>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400E' }}>{resident.occupancyStatus || 'Currently residing'}</div>
            </div>
          </div>

          {resident.password && (
            <div style={{ background: '#EFF6FF', padding: '12px 16px', borderRadius: '8px', border: '1px solid #BFDBFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', display: 'block', marginBottom: '2px' }}>RESIDENT LOGIN PASSWORD</label>
                <code style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 800 }}>{resident.password}</code>
              </div>
              <button
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => {
                  navigator.clipboard.writeText(resident.password);
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
              onClick={() => onDelete(resident.id, resident.name, resident.flatNumber)}
            >
              <Trash2 size={14} /> Delete Resident
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
