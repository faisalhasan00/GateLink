import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function CmsDeleteConfirmModal({
  deleteConfirmId,
  onClose,
  onDelete,
  isDark
}) {
  if (!deleteConfirmId) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#1E293B' : '#FFF',
        padding: '24px',
        borderRadius: '16px',
        maxWidth: '420px',
        width: '100%',
        border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '12px' }}>
          <AlertCircle size={24} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Confirm Article Deletion</h3>
        </div>
        <p style={{ fontSize: '14px', color: isDark ? '#CBD5E1' : '#475569', margin: '0 0 20px 0' }}>
          Are you sure you want to permanently delete this article? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? '#475569' : '#CBD5E1'}`,
              backgroundColor: 'transparent',
              color: isDark ? '#F8FAFC' : '#1E293B',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(deleteConfirmId)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFF',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
