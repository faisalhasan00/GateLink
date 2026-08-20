import React from 'react';
import { CreditCard, DollarSign, AlertCircle } from 'lucide-react';

export default function MaintenanceStatCards({
  totalGeneratedAmount,
  billsCount,
  totalCollectedAmount,
  paidCount,
  pendingAmount,
  pendingCount,
  overdueAmount,
  overdueCount
}) {
  return (
    <div className="dashboard-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
          <CreditCard size={22} color="var(--primary)" />
        </div>
        <div className="stat-info">
          <p>Total Generated</p>
          <h3>₹{(totalGeneratedAmount / 1000).toFixed(1)}k</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{billsCount} Bills Issued</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
          <DollarSign size={22} color="#10B981" />
        </div>
        <div className="stat-info">
          <p>Total Collected</p>
          <h3>₹{(totalCollectedAmount / 1000).toFixed(1)}k</h3>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>{paidCount} Settled</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
          <AlertCircle size={22} color="var(--warning)" />
        </div>
        <div className="stat-info">
          <p>Pending Collection</p>
          <h3>₹{(pendingAmount / 1000).toFixed(1)}k</h3>
          <span style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 600 }}>{pendingCount} Outstanding</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
          <AlertCircle size={22} color="var(--danger)" />
        </div>
        <div className="stat-info">
          <p>Overdue Amount</p>
          <h3>₹{(overdueAmount / 1000).toFixed(1)}k</h3>
          <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>{overdueCount} Overdue</span>
        </div>
      </div>
    </div>
  );
}
