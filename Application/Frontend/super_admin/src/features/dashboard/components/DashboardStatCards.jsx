import React from 'react';
import { DollarSign, Building2, PhoneCall, TrendingUp } from 'lucide-react';

export default function DashboardStatCards({
  totalMrr,
  activeSocietiesCount,
  leadsCount,
  conversionRate
}) {
  const stats = [
    { title: 'Total MRR Revenue', value: `₹${totalMrr.toLocaleString()}`, icon: <DollarSign size={24} color="var(--secondary)" />, bg: 'var(--secondary-light)' },
    { title: 'Active Societies', value: activeSocietiesCount.toString(), icon: <Building2 size={24} color="var(--primary)" />, bg: 'var(--primary-light)' },
    { title: 'Inbound Sales Leads', value: leadsCount.toString(), icon: <PhoneCall size={24} color="var(--warning)" />, bg: 'var(--warning-light)' },
    { title: 'Conversion Rate', value: `${conversionRate}%`, icon: <TrendingUp size={24} color="var(--danger)" />, bg: 'var(--danger-light)' },
  ];

  return (
    <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
      {stats.map((stat, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: stat.bg }}>
            {stat.icon}
          </div>
          <div className="stat-info">
            <p>{stat.title}</p>
            <h3>{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
