import React from 'react';
import { Vote, Plus } from 'lucide-react';

export function PollsEmptyState({ onOpenCreateModal }) {
  return (
    <div className="card" style={{ padding: '54px 24px', textAlign: 'center', borderRadius: '16px' }}>
      <div 
        style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          backgroundColor: 'var(--gl-navy-light, #EFF6FF)',
          color: 'var(--gl-navy, #1E3A8A)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto'
        }}
      >
        <Vote size={34} />
      </div>
      <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
        No Polls Created Yet
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto' }}>
        Publish an AGM resolution, maintenance budget approval, or community poll for residents on the mobile app.
      </p>
      <button
        onClick={onOpenCreateModal}
        className="btn btn-primary"
        style={{ padding: '12px 24px', fontWeight: 700, borderRadius: '12px' }}
      >
        <Plus size={18} /> Create First Poll
      </button>
    </div>
  );
}
