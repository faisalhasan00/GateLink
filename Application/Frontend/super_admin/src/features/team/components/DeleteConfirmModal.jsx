import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({
  isDark,
  deleteConfirmMember,
  onClose,
  onConfirmDelete
}) {
  if (!deleteConfirmMember) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '12px',
        maxWidth: '440px',
        width: '100%',
        padding: '24px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <AlertTriangle size={24} />
        </div>

        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Remove {deleteConfirmMember.name}?
        </h3>
        <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          This staff member will immediately lose access to the Super Admin portal.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirmDelete}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Yes, Remove Staff
          </button>
        </div>
      </div>
    </div>
  );
}
