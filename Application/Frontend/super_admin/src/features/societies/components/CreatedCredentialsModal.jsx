import React from 'react';
import { Copy, Check } from 'lucide-react';

export default function CreatedCredentialsModal({
  credentials,
  copied,
  onCopy,
  onClose
}) {
  if (!credentials) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3>Society Onboarded Successfully!</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 16px 0' }}>
          Share these credentials with the Society Admin to activate their portal.
        </p>

        <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
          <div><strong>Society:</strong> {credentials.societyName}</div>
          <div><strong>Society ID:</strong> <code>{credentials.societyId}</code></div>
          <div><strong>Access Code:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{credentials.accessCode}</span></div>
          <div><strong>Admin Email:</strong> {credentials.adminEmail}</div>
          <div><strong>Temp Password:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{credentials.tempPassword}</span></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button className="btn btn-outline" onClick={onCopy}>
            {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Credentials</>}
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
