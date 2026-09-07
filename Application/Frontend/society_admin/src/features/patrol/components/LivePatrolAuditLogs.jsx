import React from 'react';
import { History, User, AlertCircle } from 'lucide-react';

export default function LivePatrolAuditLogs({
  patrolLogs,
  incidents,
  onSelectIncident
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
      {/* Live Scan Log Stream */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <History size={18} color="#1E3A8A" />
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Live Guard Scan Logs ({patrolLogs.length})
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
          {patrolLogs.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
              No scans recorded yet today.
            </div>
          ) : (
            patrolLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ backgroundColor: '#1E3A8A', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800 }}>
                      {log.checkpointCode}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                      {log.checkpointName}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={11} /> {log.guardName || 'Security Guard'} • 📍 {log.checkpointArea || 'Perimeter'}
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700, textAlign: 'right' }}>
                  {log.scannedAt ? new Date(log.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* On-Ground Incident Alerts */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <AlertCircle size={18} color="#DC2626" />
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Patrol Incident Alerts ({incidents.length})
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
          {incidents.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
              No security or facility incidents reported.
            </div>
          ) : (
            incidents.map((inc) => {
              const severityBg = inc.severity === 'critical' ? '#FEF2F2' : '#FFFBEB';
              const severityBorder = inc.severity === 'critical' ? '#FECACA' : '#FDE68A';
              const severityText = inc.severity === 'critical' ? '#DC2626' : '#D97706';

              return (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: severityBg,
                    border: `1px solid ${severityBorder}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>
                      {inc.category}
                    </span>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: severityText, textTransform: 'uppercase' }}>
                      {inc.severity} Severity
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: 1.3 }}>
                    {inc.description}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#64748B' }}>
                    <span>📍 {inc.checkpointCode || 'Perimeter'} by {inc.guardName}</span>
                    <span style={{ fontWeight: 700, color: inc.status === 'resolved' ? '#16A34A' : '#DC2626' }}>
                      Status: {inc.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
