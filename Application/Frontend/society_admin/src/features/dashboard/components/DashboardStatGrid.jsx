import React from 'react';
import { Users, UserCheck, ShieldAlert, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardStatGrid({ stats }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-grid">
      {/* 1. Residents */}
      <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/residents')}>
        <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
          <Users size={24} color="var(--primary)" />
        </div>
        <div className="stat-info">
          <p>Total Residents</p>
          <h3>{stats.residentsTotal}</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {stats.residentsActive} Active • {stats.residentsInactive} Unoccupied
          </span>
        </div>
      </div>

      {/* 2. Today's Gate Traffic */}
      <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/visitors')}>
        <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
          <UserCheck size={24} color="#10B981" />
        </div>
        <div className="stat-info">
          <p>Gate Visitors Today</p>
          <h3>{stats.visitorsToday}</h3>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
            {stats.visitorsInside} Inside • {stats.visitorsPending} Awaiting Entry
          </span>
        </div>
      </div>

      {/* 3. Open Complaints */}
      <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/complaints')}>
        <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
          <ShieldAlert size={24} color="var(--warning)" />
        </div>
        <div className="stat-info">
          <p>Pending Tickets</p>
          <h3>{stats.complaintsOpen}</h3>
          <span style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 600 }}>
            {stats.complaintsInProgress} In Progress • {stats.complaintsResolved} Resolved
          </span>
        </div>
      </div>

      {/* 4. Maintenance Collection */}
      <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/maintenance')}>
        <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
          <CreditCard size={24} color="#3B82F6" />
        </div>
        <div className="stat-info">
          <p>Maintenance Invoices</p>
          <h3>{stats.billsTotal}</h3>
          <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600 }}>
            {stats.billsPaid} Settled • {stats.billsPending} Dues Pending
          </span>
        </div>
      </div>
    </div>
  );
}
