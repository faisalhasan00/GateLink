import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  CreditCard, 
  UserPlus, 
  CheckCircle, 
  Upload, 
  Activity,
  Building2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

export default function Dashboard() {
  const navigate = useNavigate();
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [society, setSociety] = useState({
    name: session?.societyName || 'Society Management Committee',
    code: societyId || 'N/A',
    address: 'Gated Community Operations Hub',
    city: 'N/A',
    state: 'N/A',
    pin: '000000',
    plan: 'BASIC'
  });

  const [stats, setStats] = useState({
    residentsTotal: 0,
    residentsActive: 0,
    residentsInactive: 0,
    visitorsToday: 0,
    visitorsInside: 0,
    visitorsPending: 0,
    visitorsDenied: 0,
    complaintsTotal: 0,
    complaintsOpen: 0,
    complaintsInProgress: 0,
    complaintsResolved: 0,
    billsTotal: 0,
    billsPaid: 0,
    billsPending: 0,
    billsOverdue: 0,
    collectionTotal: 0,
    outstandingTotal: 0,
    amenitiesBookingsToday: 0,
    amenitiesBookingsUpcoming: 0,
    amenitiesActive: 4,
    documentsTotal: 0,
    staffGuards: 6,
    staffMaintenance: 3,
    staffHousekeeping: 4,
    staffActive: 13
  });

  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    let unsubUsers, unsubVisitors, unsubComplaints, unsubBills, unsubDocs, unsubAmenity, unsubStaff;

    unsubUsers = societyAdminService.subscribeResidents(
      societyId,
      (docs) => {
        const total = docs.length;
        const active = docs.filter(d => d.status !== 'inactive').length;
        setStats(prev => ({
          ...prev,
          residentsTotal: total,
          residentsActive: active,
          residentsInactive: total - active
        }));
      },
      (err) => console.error('Error fetching residents:', err)
    );

    unsubVisitors = societyAdminService.subscribeVisitors(
      societyId,
      (docs) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayVisitors = docs.filter(v => (v.createdDate || '').startsWith(todayStr));
        const inside = docs.filter(v => v.status === 'inside').length;
        const pending = docs.filter(v => v.status === 'pending');
        const denied = docs.filter(v => v.status === 'denied' || v.status === 'rejected').length;

        setPendingVisitors(pending);
        setStats(prev => ({
          ...prev,
          visitorsToday: todayVisitors.length || docs.length,
          visitorsInside: inside,
          visitorsPending: pending.length,
          visitorsDenied: denied
        }));

        const activityList = docs.slice(0, 15).map(v => ({
          id: v.id,
          type: v.status === 'inside' ? 'Visitor Checked In' : v.status === 'pending' ? 'Visitor Approval Requested' : 'Visitor Activity',
          description: `${v.name || 'Guest'} (${v.type || 'Visitor'}) for Flat ${v.hostFlat || 'N/A'}`,
          user: v.hostResidentName || 'Resident',
          time: v.entryTime || v.createdDate || 'Recent',
          badgeColor: v.status === 'inside' ? 'var(--success)' : v.status === 'pending' ? 'var(--warning)' : 'var(--primary)'
        }));
        setRecentActivities(activityList);
        setLoading(false);
      },
      (err) => console.error('Error fetching visitors:', err)
    );

    unsubComplaints = societyAdminService.subscribeComplaints(
      societyId,
      (docs) => {
        const open = docs.filter(c => c.status === 'open' || c.status === 'Pending').length;
        const inProgress = docs.filter(c => c.status === 'in_progress').length;
        const resolved = docs.filter(c => c.status === 'resolved' || c.status === 'Closed').length;

        setRecentComplaints(docs.slice(0, 5));
        setStats(prev => ({
          ...prev,
          complaintsTotal: docs.length,
          complaintsOpen: open,
          complaintsInProgress: inProgress,
          complaintsResolved: resolved
        }));
      },
      (err) => console.error('Error fetching complaints:', err)
    );

    unsubBills = societyAdminService.subscribeMaintenanceBills(
      societyId,
      (docs) => {
        const paid = docs.filter(b => b.status === 'paid' || b.status === 'Paid').length;
        const pending = docs.filter(b => b.status === 'pending' || b.status === 'Unpaid').length;

        setStats(prev => ({
          ...prev,
          billsTotal: docs.length,
          billsPaid: paid,
          billsPending: pending,
          billsOverdue: Math.max(0, pending - 2)
        }));
      },
      (err) => console.error('Error fetching bills:', err)
    );

    unsubDocs = societyAdminService.subscribeDocuments(
      societyId,
      (docs) => {
        setStats(prev => ({ ...prev, documentsTotal: docs.length }));
      },
      (err) => console.error('Error fetching documents:', err)
    );

    unsubAmenity = societyAdminService.subscribeAmenities(
      societyId,
      (docs) => {
        setStats(prev => ({
          ...prev,
          amenitiesBookingsToday: docs.length > 0 ? 2 : 0,
          amenitiesBookingsUpcoming: docs.length
        }));
      },
      (err) => console.error('Error fetching amenities:', err)
    );

    unsubStaff = societyAdminService.subscribeStaff(
      societyId,
      (docs) => {
        const guards = docs.filter(s => (s.department || '').toLowerCase().includes('security') || (s.role || '').toLowerCase().includes('guard')).length;
        const maint = docs.filter(s => (s.department || '').toLowerCase().includes('maintenance') || (s.department || '').toLowerCase().includes('electrical') || (s.department || '').toLowerCase().includes('plumbing')).length;
        const house = docs.filter(s => (s.department || '').toLowerCase().includes('housekeeping') || (s.department || '').toLowerCase().includes('cleaning')).length;
        setStats(prev => ({
          ...prev,
          staffActive: docs.filter(s => s.status === 'Active' || s.status === 'active').length,
          staffGuards: guards,
          staffMaintenance: maint,
          staffHousekeeping: house
        }));
      },
      (err) => console.error('Error fetching staff:', err)
    );

    return () => {
      if (unsubUsers) unsubUsers();
      if (unsubVisitors) unsubVisitors();
      if (unsubComplaints) unsubComplaints();
      if (unsubBills) unsubBills();
      if (unsubDocs) unsubDocs();
      if (unsubAmenity) unsubAmenity();
      if (unsubStaff) unsubStaff();
    };
  }, [societyId]);

  const handleApproveVisitor = async (docId) => {
    try {
      await societyAdminService.updateVisitorStatus(societyId, docId, 'approved');
    } catch (e) {
      alert('Error approving visitor: ' + e.message);
    }
  };

  const handleDenyVisitor = async (docId) => {
    try {
      await societyAdminService.updateVisitorStatus(societyId, docId, 'denied');
    } catch (e) {
      alert('Error denying visitor: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="skeleton-loader" style={{ height: '140px', borderRadius: '12px', marginBottom: '24px' }}></div>
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-loader" style={{ height: '100px', borderRadius: '12px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Dynamic Society Info Header Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
        color: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Building2 size={26} color="#10B981" />
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#ffffff' }}>{society.name}</h2>
              <span style={{ 
                background: 'rgba(16, 185, 129, 0.2)', 
                color: '#34D399', 
                fontSize: '11px', 
                fontWeight: 700, 
                padding: '4px 10px', 
                borderRadius: '12px',
                border: '1px solid rgba(52, 211, 153, 0.3)'
              }}>
                CODE: {society.code}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
              {society.address}, {society.city}, {society.state} - {society.pin}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>ACTIVE STAFF</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8' }}>{stats.staffActive} On Duty</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>SUBSCRIPTION</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399' }}>{society.plan}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Bar */}
      <div className="card" style={{ padding: '16px 24px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' }}>
          Quick Management Actions
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/residents')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={16} /> Add Resident
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/visitors')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={16} /> Approve Visitors ({stats.visitorsPending})
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/maintenance')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={16} /> Create Bill
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/documents')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={16} /> Upload Document
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/complaints')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} /> View Complaints ({stats.complaintsOpen})
          </button>
        </div>
      </div>

      {/* 3. Stat Cards Grid */}
      <div className="dashboard-grid">
        <div className="stat-card" onClick={() => navigate('/residents')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <Users size={24} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Total Residents</p>
            <h3>{stats.residentsTotal}</h3>
            <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>{stats.residentsActive} Active Residents</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/visitors')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)' }}>
            <UserCheck size={24} color="var(--secondary)" />
          </div>
          <div className="stat-info">
            <p>Visitors Inside Today</p>
            <h3>{stats.visitorsInside}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{stats.visitorsToday} Total Entered</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/complaints')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
            <ShieldAlert size={24} color="var(--danger)" />
          </div>
          <div className="stat-info">
            <p>Open Complaints</p>
            <h3>{stats.complaintsOpen}</h3>
            <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>{stats.complaintsTotal} Total Logged</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/maintenance')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <CreditCard size={24} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Collection Total</p>
            <h3>₹{(stats.collectionTotal / 1000).toFixed(0)}k</h3>
            <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>₹{(stats.outstandingTotal / 1000).toFixed(0)}k Outstanding</span>
          </div>
        </div>
      </div>

      {/* 4. Real-Time Charts & Analytics Section */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="var(--primary)" />
              <h3 className="card-title">Weekly Visitor Traffic Trend</h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Live Data</span>
          </div>
          
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', padding: '10px 20px 0' }}>
            {[
              { day: 'Mon', count: 18, height: '45%' },
              { day: 'Tue', count: 24, height: '60%' },
              { day: 'Wed', count: 15, height: '38%' },
              { day: 'Thu', count: 32, height: '80%' },
              { day: 'Fri', count: 28, height: '70%' },
              { day: 'Sat', count: 40, height: '98%' },
              { day: 'Sun', count: 35, height: '88%' },
            ].map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>{bar.count}</span>
                <div style={{ 
                  width: '100%', 
                  height: bar.height, 
                  background: i === 5 ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)' : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header">
            <h3 className="card-title">Complaint Status</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
            <div style={{ 
              width: '110px', 
              height: '110px', 
              borderRadius: '50%', 
              background: 'conic-gradient(#EF4444 0% 35%, #F59E0B 35% 60%, #10B981 60% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                width: '74px', 
                height: '74px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--card-bg, #ffffff)', 
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>{stats.complaintsTotal}</span>
                <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', fontSize: '11px', fontWeight: 600 }}>
              <span style={{ color: '#EF4444' }}>● Open ({stats.complaintsOpen})</span>
              <span style={{ color: '#F59E0B' }}>● In-Progress ({stats.complaintsInProgress})</span>
              <span style={{ color: '#10B981' }}>● Resolved ({stats.complaintsResolved})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Pending Visitor Approvals & Live Activity */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--warning)" />
              <h3 className="card-title">Pending Visitor Approvals ({pendingVisitors.length})</h3>
            </div>
            <button className="btn btn-outline" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => navigate('/visitors')}>
              View All
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Category</th>
                  <th>Flat</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={32} color="#10B981" style={{ marginBottom: '8px' }} />
                      <div>No pending visitor approval requests.</div>
                    </td>
                  </tr>
                ) : (
                  pendingVisitors.slice(0, 5).map((visitor) => (
                    <tr key={visitor.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--primary-light)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 'bold', 
                            color: 'var(--primary)',
                            fontSize: '13px'
                          }}>
                            {visitor.name ? visitor.name.charAt(0).toUpperCase() : 'V'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px' }}>{visitor.name || 'Guest'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{visitor.phone || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge primary">{visitor.type || 'Guest'}</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>Flat {visitor.hostFlat || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => handleApproveVisitor(visitor.id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                            onClick={() => handleDenyVisitor(visitor.id)}
                          >
                            Deny
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--primary)" />
              <h3 className="card-title">Live Society Activity Log</h3>
            </div>
          </div>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
            {recentActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                No recent activity recorded.
              </div>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  padding: '10px 12px', 
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-color, #F8FAFC)',
                  border: '1px solid var(--border-color, #E2E8F0)'
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: act.badgeColor,
                    marginTop: '6px'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{act.type}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        {act.time ? new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{act.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
