import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useSuperAdminDashboard } from '../../features/dashboard/hooks/useSuperAdminDashboard';
import DashboardStatCards from '../../features/dashboard/components/DashboardStatCards';
import LeadPipelineBreakdown from '../../features/dashboard/components/LeadPipelineBreakdown';
import RecentLeadsFeed from '../../features/dashboard/components/RecentLeadsFeed';
import RecentSocietiesFeed from '../../features/dashboard/components/RecentSocietiesFeed';

export default function SuperAdminDashboard() {
  const {
    societies,
    leads,
    selectedLead,
    setSelectedLead,
    totalMrr,
    activeSocietiesCount,
    conversionRate,
    handleStatusUpdate
  } = useSuperAdminDashboard();

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>Super Admin Executive Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Real-time multi-tenant society management, sales CRM pipeline & inbound customer lead hub.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/societies?openWizard=true" state={{ openWizard: true }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Building2 size={16} /> + Onboard New Society
          </Link>
        </div>
      </div>

      {/* 1. Stat Metric Cards */}
      <DashboardStatCards
        totalMrr={totalMrr}
        activeSocietiesCount={activeSocietiesCount}
        leadsCount={leads.length}
        conversionRate={conversionRate}
      />

      {/* 2. Sales Lead Pipeline Bar */}
      <LeadPipelineBreakdown leads={leads} />

      {/* 3. Inbound Leads & Recent Societies Feed */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
        <RecentLeadsFeed
          leads={leads}
          selectedLead={selectedLead}
          setSelectedLead={setSelectedLead}
          onStatusUpdate={handleStatusUpdate}
        />
        <RecentSocietiesFeed societies={societies} />
      </div>
    </div>
  );
}
