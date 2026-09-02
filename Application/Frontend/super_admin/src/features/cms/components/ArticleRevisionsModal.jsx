import React from 'react';

export function ArticleRevisionsModal({ isDark, revisions, onRestoreRevision }) {
  return (
    <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 16px 0' }}>
        Article Revision History &amp; Point-in-Time Restore
      </h3>

      {revisions.length === 0 ? (
        <p style={{ color: '#94A3B8' }}>No saved revisions yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {revisions.map((rev) => (
            <div key={rev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '12px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
              <div>
                <div style={{ fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px' }}>
                  {rev.note || 'Saved Version'}
                </div>
                <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Saved by {rev.savedBy} on {rev.savedAt?.toDate ? rev.savedAt.toDate().toLocaleString('en-IN') : 'Recent'}
                </div>
              </div>

              <button
                onClick={() => onRestoreRevision(rev)}
                style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#1E3A8A', color: '#FFF', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
