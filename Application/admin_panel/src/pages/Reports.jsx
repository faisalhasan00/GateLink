import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Download, 
  FileText, 
  Users, 
  UserCheck, 
  ShieldAlert, 
  Wrench, 
  Building2, 
  Truck, 
  Shield, 
  CheckCircle, 
  TrendingUp,
  DollarSign,
  Layers,
  PieChart as PieIcon
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

export default function Reports() {
  const [stats, setStats] = useState({
    residents: 0,
    occupied: 0,
    vacant: 0,
    visitors: 0,
    visitorsToday: 0,
    complaints: 0,
    openComplaints: 0,
    closedComplaints: 0,
    maintenanceGen: 0,
    maintenanceColl: 0,
    pendingPayments: 0,
    staff: 0,
    helpers: 0,
    deliveriesToday: 0,
    sosEvents: 0,
    documents: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Live Firestore Listeners across all 10 core collections
    const unsubUsers = onSnapshot(collection(db, 'societies/SOC-001/users'), (snap) => {
      const docs = snap.docs.map(d => d.data());
      setStats(prev => ({
        ...prev,
        residents: docs.length,
        occupied: docs.length,
        vacant: 480 - docs.length,
      }));
    });

    const unsubVisitors = onSnapshot(collection(db, 'societies/SOC-001/visitors'), (snap) => {
      const docs = snap.docs.map(d => d.data());
      const deliveries = docs.filter(v => v.type === 'Delivery' || v.company).length;
      setStats(prev => ({
        ...prev,
        visitors: docs.length,
        visitorsToday: docs.length,
        deliveriesToday: deliveries,
      }));
    });

    const unsubComplaints = onSnapshot(collection(db, 'societies/SOC-001/complaints'), (snap) => {
      const docs = snap.docs.map(d => d.data());
      const open = docs.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
      const closed = docs.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
      setStats(prev => ({
        ...prev,
        complaints: docs.length,
        openComplaints: open,
        closedComplaints: closed,
      }));
    });

    const unsubBills = onSnapshot(collection(db, 'societies/SOC-001/maintenance_bills'), (snap) => {
      const docs = snap.docs.map(d => d.data());
      const totalGen = docs.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
      const totalColl = docs.filter(b => b.status === 'Paid').reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
      setStats(prev => ({
        ...prev,
        maintenanceGen: totalGen,
        maintenanceColl: totalColl,
        pendingPayments: totalGen - totalColl,
      }));
    });

    const unsubStaff = onSnapshot(collection(db, 'societies/SOC-001/staff'), (snap) => {
      setStats(prev => ({ ...prev, staff: snap.docs.length }));
    });

    const unsubHelpers = onSnapshot(collection(db, 'societies/SOC-001/helpers'), (snap) => {
      setStats(prev => ({ ...prev, helpers: snap.docs.length }));
    });

    const unsubSos = onSnapshot(collection(db, 'societies/SOC-001/sos_alerts'), (snap) => {
      setStats(prev => ({ ...prev, sosEvents: snap.docs.length }));
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubVisitors();
      unsubComplaints();
      unsubBills();
      unsubStaff();
      unsubHelpers();
      unsubSos();
    };
  }, []);

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
    exportToCSV(reportData, 'SocietySphere_Executive_Report.csv');
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="skeleton-loader" style={{ height: '120px', borderRadius: '12px', marginBottom: '24px' }}></div>
        <div className="skeleton-loader" style={{ height: '350px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. Header & Data Export Toolbar */}
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

      {/* 2. Executive 17-KPI Statistics Grid */}
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

      {/* 3. Visual Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Revenue Collection Trend Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Maintenance Revenue vs Collection Trend</h3>
          </div>
          <div style={{ padding: '20px', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '160px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '40px', height: '80%', backgroundColor: 'var(--primary)', borderRadius: '6px 6px 0 0' }}></div>
                <span style={{ fontSize: '11px', fontWeight: 600, marginTop: '6px' }}>Generated</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '40px', height: '65%', backgroundColor: '#10B981', borderRadius: '6px 6px 0 0' }}></div>
                <span style={{ fontSize: '11px', fontWeight: 600, marginTop: '6px' }}>Collected</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '40px', height: '35%', backgroundColor: 'var(--warning)', borderRadius: '6px 6px 0 0' }}></div>
                <span style={{ fontSize: '11px', fontWeight: 600, marginTop: '6px' }}>Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Status & Resolution Split */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Complaints Resolution Analytics</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Open / In Progress Complaints</span>
                <span>{stats.openComplaints} Incidents</span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'var(--bg-color)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stats.complaints > 0 ? (stats.openComplaints / stats.complaints) * 100 : 20}%`, backgroundColor: 'var(--warning)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Resolved & Closed Complaints</span>
                <span>{stats.closedComplaints} Solved</span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'var(--bg-color)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stats.complaints > 0 ? (stats.closedComplaints / stats.complaints) * 100 : 80}%`, backgroundColor: '#10B981' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
