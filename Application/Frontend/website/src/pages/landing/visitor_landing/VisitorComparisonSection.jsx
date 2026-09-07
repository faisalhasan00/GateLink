import React from 'react';

export default function VisitorComparisonSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
          From Paper Visitor Registers to Digital Gate Entry
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
          Comparing traditional manual gatekeeping methods with GateLink's digital visitor automation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Manual Paper Registers</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '14px' }}>Handwritten entries are slow, frequently illegible, prone to fake phone numbers, and difficult to search during incident reviews.</p>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Digital Records</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Searchable digital entry logs with accurate timestamps, pre-verified resident approvals, and multi-gate synchronization.</p>
        </div>

        <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Manual Intercom Calls</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '14px' }}>Guards spend minutes dialing broken intercoms or phone numbers while delivery queues pile up at the main gate entrance.</p>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Mobile Notifications</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Instant push notifications with 1-tap Approve/Deny buttons sent directly to residents' mobile phones regardless of location.</p>
        </div>

        <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Unverified Helper Entry</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '14px' }}>Daily domestic staff enter without timestamp tracking, leaving flat owners unaware of whether their helpers have arrived.</p>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Staff Attendance</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Passcode-based helper check-in with automated entry/exit alerts sent immediately to all associated resident apartments.</p>
        </div>
      </div>
    </section>
  );
}
