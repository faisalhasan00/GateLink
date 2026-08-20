import React from 'react';
import { useDashboardMetrics } from '../features/dashboard/hooks/useDashboardMetrics';
import SocietyHeaderBanner from '../features/dashboard/components/SocietyHeaderBanner';
import DashboardStatGrid from '../features/dashboard/components/DashboardStatGrid';
import PendingVisitorApprovals from '../features/dashboard/components/PendingVisitorApprovals';
import RecentActivityStream from '../features/dashboard/components/RecentActivityStream';
import QuickActionsPanel from '../features/dashboard/components/QuickActionsPanel';

export default function Dashboard() {
  const {
    society,
    stats,
    pendingVisitors,
    recentActivities,
    recentComplaints,
    loading,
    handleApproveVisitor,
    handleDenyVisitor
  } = useDashboardMetrics();

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="skeleton-loader" style={{ height: '140px', borderRadius: '12px', marginBottom: '24px' }}></div>
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-loader" style={{ height: '100px', borderRadius: '12px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Society Info Header Banner */}
      <SocietyHeaderBanner society={society} stats={stats} />

      {/* 2. Key Operational Metrics Grid */}
      <DashboardStatGrid stats={stats} />

      {/* 3. Pending Gate Visitor Approvals Alert */}
      <PendingVisitorApprovals
        pendingVisitors={pendingVisitors}
        onApprove={handleApproveVisitor}
        onDeny={handleDenyVisitor}
      />

      {/* 4. Live Telemetry & Complaint Timeline */}
      <RecentActivityStream
        recentActivities={recentActivities}
        recentComplaints={recentComplaints}
        stats={stats}
      />

      {/* 5. Society Management Quick Shortcuts */}
      <QuickActionsPanel />
    </div>
  );
}
