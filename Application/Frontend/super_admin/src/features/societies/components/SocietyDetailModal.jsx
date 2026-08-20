import React from 'react';

export default function SocietyDetailModal({ society, onClose, onUpdatePlan }) {
  if (!society) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>Society Details: {society.name}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', fontSize: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>SOCIETY ID / CODE</label>
            <div><code>{society.id}</code> (Code: <strong>{society.code}</strong>)</div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>LOCATION</label>
            <div>{society.address || 'N/A'}, {society.city} {society.state}</div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ADMIN CONTACT</label>
            <div>{society.president} ({society.phone})</div>
            <div style={{ color: 'var(--primary)', fontSize: '13px' }}>{society.adminEmail}</div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>FLATS & BLOCKS</label>
            <div>{society.flatCount || 0} Flats | {society.blockCount || 0} Blocks</div>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Subscription & Licensing Tier</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Active Plan:</label>
            <select
              value={society.plan || 'Standard'}
              onChange={(e) => onUpdatePlan(society.id, e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', fontWeight: 'bold' }}
            >
              <option value="Trial">Free Pilot Trial (₹0/mo)</option>
              <option value="Standard">Standard (₹5,000/mo)</option>
              <option value="Premium">Premium Tier (₹10,000/mo)</option>
              <option value="Enterprise">Enterprise Unlimited (₹25,000/mo)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
