import React from 'react';
import { Lock, Calendar, Download, Trash2 } from 'lucide-react';

export function PollCard({ poll, onExportVotes, onClosePoll, onDeletePoll }) {
  const isActive = poll.status === 'active';
  const isOwnerOnly =
    poll.allowedRoles &&
    poll.allowedRoles.length === 1 &&
    poll.allowedRoles[0].toLowerCase() === 'owner';

  return (
    <div
      className="card hover-card-elevate"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        borderRadius: '16px',
        border: isActive ? '1px solid var(--border-color)' : '1px dashed #CBD5E1',
        opacity: isActive ? 1 : 0.85
      }}
    >
      <div>
        {/* Category & Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge primary">
              {poll.category || 'General Poll'}
            </span>
            {isOwnerOnly && (
              <span className="badge warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={12} /> Owner Only
              </span>
            )}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {poll.votingRule === 'one_per_flat' ? '1 vote / flat' : '1 vote / resident'}
            </span>
          </div>

          <span className={`badge ${isActive ? 'success' : 'outline'}`} style={{ backgroundColor: isActive ? 'var(--gl-success-bg, #DCFCE7)' : '#F1F5F9', color: isActive ? 'var(--gl-success, #16A34A)' : '#64748B' }}>
            {isActive ? '🟢 ACTIVE' : '⚪ CLOSED'}
          </span>
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', lineHeight: 1.35 }}>
          {poll.title}
        </h3>
        {poll.description && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.45 }}>
            {poll.description}
          </p>
        )}

        {/* Options & Live Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
          {(poll.options || []).map((opt) => {
            const percentage = poll.totalVotes > 0
              ? Math.round(((opt.voteCount || 0) / poll.totalVotes) * 100)
              : 0;

            return (
              <div 
                key={opt.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{opt.text}</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                    {opt.voteCount || 0} votes ({percentage}%)
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                  <div 
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: 'var(--gl-navy, #1E3A8A)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} />
          <span>
            {poll.expiresAt ? `Ends ${new Date(poll.expiresAt).toLocaleDateString()}` : 'No expiration date'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onExportVotes(poll)}
            title="Download Voters Audit CSV"
            className="btn btn-outline"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              borderRadius: '8px',
              fontWeight: 700
            }}
          >
            <Download size={14} /> CSV Audit
          </button>

          {isActive && (
            <button
              onClick={() => onClosePoll(poll.id, poll.title)}
              title="Close voting early"
              style={{
                background: 'var(--gl-amber-100, #FEF3C7)',
                border: '1px solid #FCD34D',
                color: '#B45309',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
                transition: 'all 0.2s'
              }}
            >
              Close
            </button>
          )}

          <button
            onClick={() => onDeletePoll(poll.id, poll.title)}
            title="Delete poll"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gl-danger, #DC2626)',
              padding: '6px',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
