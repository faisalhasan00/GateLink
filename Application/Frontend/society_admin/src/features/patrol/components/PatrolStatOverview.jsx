import React from 'react';
import { MapPin, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PatrolStatOverview({ checkpoints, patrolLogs, incidents }) {
  const unresolvedCount = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
      <div style={{ padding: '18px 20px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>TOTAL CHECKPOINTS</span>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#1E3A8A' }}>
            <MapPin size={18} />
          </div>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
          {checkpoints.length}
        </div>
        <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 600, marginTop: '2px' }}>
          Perimeter points active
        </div>
      </div>

      <div style={{ padding: '18px 20px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>PATROL SCANS LOGGED</span>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#166534' }}>
            <ShieldCheck size={18} />
          </div>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
          {patrolLogs.length}
        </div>
        <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
          Guard checkpoint scans
        </div>
      </div>

      <div style={{ padding: '18px 20px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>PATROL INCIDENTS</span>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: incidents.length > 0 ? '#FEF2F2' : '#F8FAFC', color: incidents.length > 0 ? '#DC2626' : '#64748B' }}>
            <AlertCircle size={18} />
          </div>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: incidents.length > 0 ? '#DC2626' : '#0F172A', marginTop: '6px' }}>
          {unresolvedCount}
        </div>
        <div style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: 600, marginTop: '2px' }}>
          Open security flags
        </div>
      </div>
    </div>
  );
}
