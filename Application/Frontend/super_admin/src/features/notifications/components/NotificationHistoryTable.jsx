import React from 'react';
import { Bell } from 'lucide-react';
import { getCategoryColor } from '../hooks/usePushNotifications';

export default function NotificationHistoryTable({ history, loading }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg, #FFFFFF)',
        borderRadius: '18px',
        padding: '28px',
        border: '1px solid var(--border-color, #E2E8F0)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Broadcast History & Telemetry</h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary, #64748B)' }}>Real-time logs of all sent push notifications and delivery stats</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary, #64748B)' }}>Loading broadcast logs...</div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary, #64748B)' }}>
          <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontWeight: 700 }}>No broadcasts sent yet</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Compose a notification above to send your first message.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color, #E2E8F0)', color: 'var(--text-secondary, #64748B)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>NOTIFICATION & TITLE</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>CATEGORY</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>AUDIENCE / SCOPE</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>DELIVERY METRICS</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>DISPATCHED AT</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color, #F1F5F9)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary, #0F172A)' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)', marginTop: '2px', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.body}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: `${getCategoryColor(item.category)}18`,
                        color: getCategoryColor(item.category)
                      }}
                    >
                      {item.category?.toUpperCase() || 'NOTICE'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {item.scope === 'all' && '🌍 All Users'}
                    {item.scope === 'residents' && '🏠 Residents'}
                    {item.scope === 'guards' && '🛡️ Guards'}
                    {item.scope === 'society' && `🏢 ${item.societyId}`}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#10B981' }}>
                        ✓ {item.successCount || item.deliveredCount || 0}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                        / {item.totalRecipients || 0} devices
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Just now'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
