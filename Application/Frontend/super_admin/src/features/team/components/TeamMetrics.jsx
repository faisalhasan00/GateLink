import React from 'react';
import { Users, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function TeamMetrics({ isDark, totalMembers, totalActive, totalSuspended }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
      <div style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        padding: '20px',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A' }}>
          <Users size={24} />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Staff
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            {totalMembers + 1} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>(incl. Owner)</span>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        padding: '20px',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Members
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
            {totalActive + 1}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        padding: '20px',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Suspended Staff
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: totalSuspended > 0 ? '#EF4444' : 'var(--text-primary)', marginTop: '2px' }}>
            {totalSuspended}
          </div>
        </div>
      </div>
    </div>
  );
}
