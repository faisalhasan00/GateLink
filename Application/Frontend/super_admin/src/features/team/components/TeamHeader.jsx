import React from 'react';
import { UserPlus } from 'lucide-react';

export default function TeamHeader({ isMasterAdmin, onOpenCreateModal }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Team & Staff Management
          </h1>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '999px',
            backgroundColor: 'rgba(14, 165, 233, 0.12)',
            color: '#0284C7',
            border: '1px solid rgba(14, 165, 233, 0.3)'
          }}>
            Role-Based Access Control
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px', marginBottom: 0 }}>
          Create employee accounts and configure granular permission restrictions across the SaaS portal.
        </p>
      </div>

      {isMasterAdmin && (
        <button
          onClick={onOpenCreateModal}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            backgroundColor: '#1E3A8A',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(30, 58, 138, 0.25)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
        >
          <UserPlus size={18} />
          <span>Add Team Member</span>
        </button>
      )}
    </div>
  );
}
