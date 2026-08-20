import React from 'react';
import { Building2, Activity, UserPlus, Upload, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SocietyHeaderBanner({ society, stats }) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Building2 size={26} color="#10B981" />
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#ffffff' }}>{society.name}</h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                border: '1px solid #10B981'
              }}
            >
              ACTIVE ENTERPRISE
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
            Society ID: <strong style={{ color: '#E2E8F0' }}>{society.code}</strong> • Plan: <strong style={{ color: '#E2E8F0' }}>{society.plan}</strong> • {stats.residentsActive} Active Units Live
          </p>
        </div>

        {/* Quick Top Shortcuts */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)', padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => navigate('/residents')}
          >
            <UserPlus size={16} color="#10B981" /> Add Resident
          </button>
          <button
            className="btn btn-outline"
            style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)', padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => navigate('/notices')}
          >
            <Upload size={16} color="#0EA5E9" /> Post Circular
          </button>
          <button
            className="btn btn-outline"
            style={{ color: '#F87171', borderColor: 'rgba(248, 113, 113, 0.3)', padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => navigate('/emergency')}
          >
            <ShieldAlert size={16} /> Broadcast SOS
          </button>
        </div>
      </div>
    </div>
  );
}
