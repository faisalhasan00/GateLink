import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';

export default function GateHeaderBadge({ societyName, gateName }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 20px',
      background: 'linear-gradient(135deg, #1E3A8A 0%, #0EA5E9 100%)',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(14, 165, 233, 0.25)',
      marginBottom: '20px'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <ShieldCheck size={26} color="#FFFFFF" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#BAE6FD' }}>
          GateLink Self Check-in
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0', color: '#FFFFFF' }}>
          {societyName}
        </h1>
        <div style={{ fontSize: '12px', color: '#E0F2FE', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} /> {gateName}
        </div>
      </div>
    </div>
  );
}
