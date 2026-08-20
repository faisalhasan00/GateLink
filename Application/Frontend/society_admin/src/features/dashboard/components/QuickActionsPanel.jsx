import React from 'react';
import { UserPlus, UserCheck, ShieldAlert, CreditCard, Upload, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionsPanel() {
  const navigate = useNavigate();

  const actions = [
    { title: 'Add Resident', desc: 'Provision flat owner/tenant access', icon: <UserPlus size={18} color="var(--primary)" />, route: '/residents' },
    { title: 'Issue Maintenance Bill', desc: 'Generate monthly maintenance dues', icon: <CreditCard size={18} color="#3B82F6" />, route: '/maintenance' },
    { title: 'Post Digital Notice', desc: 'Publish announcement to mobile apps', icon: <Upload size={18} color="#10B981" />, route: '/notices' },
    { title: 'Manage Security Staff', desc: 'Shift rosters & guard assignments', icon: <UserCheck size={18} color="#F59E0B" />, route: '/staff' },
    { title: 'Broadcast Emergency SOS', desc: 'Trigger society siren & push alert', icon: <ShieldAlert size={18} color="var(--danger)" />, route: '/emergency' },
    { title: 'Download Financial Audit', desc: 'Export collection & ledger reports', icon: <Activity size={18} color="#6366F1" />, route: '/reports' },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Society Management Quick Actions</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {actions.map((act, index) => (
          <div
            key={index}
            onClick={() => navigate(act.route)}
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--surface-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)'
              }}
            >
              {act.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{act.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{act.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
