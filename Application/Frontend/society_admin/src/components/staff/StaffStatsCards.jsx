import React from 'react';
import { Users, UserCheck, Shield, Wrench, Building2 } from 'lucide-react';

/**
 * @component StaffStatsCards
 * @description Renders top executive KPI cards displaying headcount summaries across departments.
 *
 * @param {Object} props
 * @param {number} props.totalCount Total onboarded staff count
 * @param {number} props.activeCount Number of currently active personnel
 * @param {number} props.securityCount Total security team members
 * @param {number} props.techCount Maintenance and technical team members
 * @param {number} props.managerCount Management and accounting personnel
 */
export default function StaffStatsCards({
  totalCount = 0,
  activeCount = 0,
  securityCount = 0,
  techCount = 0,
  managerCount = 0
}) {
  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}
    >
      {/* Total Staff Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Registered Staff</span>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={20} />
          </div>
        </div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalCount}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Onboarded personnel</div>
      </div>

      {/* Active Duty Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Duty Staff</span>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: 'var(--secondary)' }}>
            <UserCheck size={20} />
          </div>
        </div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>{activeCount}</div>
        <div style={{ fontSize: '11px', color: 'var(--secondary)', fontWeight: 700, marginTop: '4px' }}>
          {totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}% active rate` : '0% active'}
        </div>
      </div>

      {/* Security Department Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Security Force</span>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#FFFBEB', color: 'var(--warning)' }}>
            <Shield size={20} />
          </div>
        </div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>{securityCount}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Guards & supervisors</div>
      </div>

      {/* Technical Staff Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Technical & Maintenance</span>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>
            <Wrench size={20} />
          </div>
        </div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>{techCount}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Electricians, plumbers, tech</div>
      </div>

      {/* Management & Accounts Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Management & Admin</span>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Building2 size={20} />
          </div>
        </div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>{managerCount}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Facility managers & accounts</div>
      </div>
    </div>
  );
}
