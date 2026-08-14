import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Download, 
  FileText, 
  Users, 
  UserCheck, 
  ShieldAlert, 
  Building2, 
  Truck, 
  Shield, 
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

export default function Reports() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [stats, setStats] = useState({
    residents: 0,
    occupied: 0,
    vacant: 0,
    visitors: 0,
    visitorsToday: 0,
    deliveriesToday: 0,
    complaints: 0,
    openComplaints: 0,
    closedComplaints: 0,
    maintenanceGen: 0,
    maintenanceColl: 0,
    pendingPayments: 0,
    staff: 0,
    helpers: 0,
    sosEvents: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubUsers = societyAdminService.subscribeResidents(
      societyId,
      (docs) => {
        setStats(prev => ({
          ...prev,
          residents: docs.length,
          occupied: docs.length,
          vacant: Math.max(0, 200 - docs.length),
        }));
      },
      (err) => console.error(err)
    );

    const unsubVisitors = societyAdminService.subscribeVisitors(
      societyId,
      (docs) => {
        const deliveries = docs.filter(v => v.type === 'Delivery' || v.company).length;
        setStats(prev => ({
          ...prev,
          visitors: docs.length,
          visitorsToday: docs.length,
          deliveriesToday: deliveries,
        }));
      },
      (err) => console.error(err)
    );

    const unsubComplaints = societyAdminService.subscribeComplaints(
      societyId,
      (docs) => {
        const open = docs.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
        const closed = docs.filter(c => c.status === 'Resolved' || c.status === 'Closed' || c.status === 'Completed').length;
        setStats(prev => ({
          ...prev,
          complaints: docs.length,
          openComplaints: open,
          closedComplaints: closed,
        }));
      },
      (err) => console.error(err)
    );

    const unsubBills = societyAdminService.subscribeMaintenanceBills(
      societyId,
      (docs) => {
        const totalGen = docs.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
        const totalColl = docs.filter(b => b.status === 'paid' || b.status === 'Paid').reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
        setStats(prev => ({
          ...prev,
          maintenanceGen: totalGen,
          maintenanceColl: totalColl,
          pendingPayments: totalGen - totalColl,
        }));
      },
      (err) => console.error(err)
    );

    const unsubStaff = societyAdminService.subscribeStaff(
      societyId,
      (docs) => setStats(prev => ({ ...prev, staff: docs.length })),
      (err) => console.error(err)
    );

    const unsubHelpers = societyAdminService.subscribeHelpers(
      societyId,
      (docs) => setStats(prev => ({ ...prev, helpers: docs.length })),
      (err) => console.error(err)
    );

    const unsubSos = societyAdminService.subscribeSosAlerts(
      societyId,
      (docs) => {
        setStats(prev => ({ ...prev, sosEvents: docs.length }));
        setLoading(false);
      },
      (err) => console.error(err)
    );

    return () => {
      if (unsubUsers) unsubUsers();
      if (unsubVisitors) unsubVisitors();
      if (unsubComplaints) unsubComplaints();
      if (unsubBills) unsubBills();
      if (unsubStaff) unsubStaff();
      if (unsubHelpers) unsubHelpers();
      if (unsubSos) unsubSos();
    };
  }, [societyId]);

  const handleExportCSV = () => {
    const reportData = [
      { Metric: 'Total Registered Residents', Value: stats.residents },
      { Metric: 'Occupied Flats', Value: stats.occupied },
      { Metric: 'Vacant Flats', Value: stats.vacant },
      { Metric: 'Total Visitors Logged', Value: stats.visitors },
      { Metric: 'Visitors Today', Value: stats.visitorsToday },
      { Metric: 'Total Complaints', Value: stats.complaints },
      { Metric: 'Open Complaints', Value: stats.openComplaints },
      { Metric: 'Resolved Complaints', Value: stats.closedComplaints },
      { Metric: 'Total Maintenance Generated (INR)', Value: stats.maintenanceGen },
      { Metric: 'Total Revenue Collected (INR)', Value: stats.maintenanceColl },
      { Metric: 'Pending Maintenance Due (INR)', Value: stats.pendingPayments },
      { Metric: 'Total Staff Members', Value: stats.staff },
      { Metric: 'Registered Domestic Helpers', Value: stats.helpers },
      { Metric: 'Deliveries Processed Today', Value: stats.deliveriesToday },
      { Metric: 'Emergency SOS Events', Value: stats.sosEvents },
    ];
    exportToCSV(reportData, 'GateLink_Executive_Report.csv');
  };

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading Reports Console...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart2 size={24} color="var(--primary)" /> Society Executive Analytics & Reports
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Real-time operational KPIs, revenue trends, visitor metrics, and PDF/CSV export engine.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={16} /> Export CSV
            </button>
            <button className="btn btn-primary" onClick={exportToPDF} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> Print / Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <Users size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Total Residents</p>
            <h3>{stats.residents}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <Building2 size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Occupied Flats</p>
            <h3>{stats.occupied}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)' }}>
            <UserCheck size={22} color="var(--secondary)" />
          </div>
          <div className="stat-info">
            <p>Visitors Today</p>
            <h3>{stats.visitorsToday}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
            <ShieldAlert size={22} color="var(--danger)" />
          </div>
          <div className="stat-info">
            <p>Open Complaints</p>
            <h3>{stats.openComplaints}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <DollarSign size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Revenue Collected</p>
            <h3>₹{stats.maintenanceColl.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
            <TrendingUp size={22} color="var(--warning)" />
          </div>
          <div className="stat-info">
            <p>Pending Maintenance</p>
            <h3>₹{stats.pendingPayments.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <Truck size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Deliveries Processed</p>
            <h3>{stats.deliveriesToday}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
            <Shield size={22} color="var(--danger)" />
          </div>
          <div className="stat-info">
            <p>Emergency SOS Events</p>
            <h3>{stats.sosEvents}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
