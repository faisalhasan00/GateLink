import React, { useState, useEffect } from 'react';
import { Users, UserCheck, ShieldAlert, Car, Clock } from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { clearDatabase } from '../utils/seedDatabase';

export default function Dashboard() {
  const [stats, setStats] = useState({ residents: 0, visitors: 0, complaints: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Users (Residents)
    const qUsers = query(collection(db, 'societies/SOC-001/users'), where('role', '==', 'resident'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setStats(prev => ({ ...prev, residents: snapshot.docs.length }));
    });

    // Listen to live Visitors (Today)
    const qVisitors = query(collection(db, 'societies/SOC-001/visitors'), orderBy('entryTime', 'desc'), limit(10));
    const unsubVisitors = onSnapshot(qVisitors, (snapshot) => {
      const visitorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentActivity(visitorsData);
      
      // Calculate how many visitors are currently inside
      const insideCount = visitorsData.filter(v => v.status === 'inside').length;
      setStats(prev => ({ ...prev, visitors: insideCount }));
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubVisitors();
    };
  }, []);

  const statCards = [
    { title: 'Total Residents', value: stats.residents.toString(), icon: <Users size={24} color="var(--primary)" />, bg: 'var(--primary-light)' },
    { title: 'Active Visitors', value: stats.visitors.toString(), icon: <UserCheck size={24} color="var(--secondary)" />, bg: 'var(--secondary-light)' },
    { title: 'Open Complaints', value: stats.complaints.toString(), icon: <ShieldAlert size={24} color="var(--danger)" />, bg: 'var(--danger-light)' },
    { title: 'Vehicles Inside', value: '0', icon: <Car size={24} color="var(--warning)" />, bg: 'var(--warning-light)' },
  ];

  if (loading) return <div style={{ padding: '20px' }}>Loading real-time data...</div>;

  return (
    <div>
      <div className="dashboard-grid">
        {statCards.map((stat, i) => (
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

      <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Live Gate Activity</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-outline" 
                style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                onClick={async () => {
                  if (window.confirm("Clear all visitor, resident, and testing data from database?")) {
                    await clearDatabase(db);
                  }
                }}
              >
                Clear All Data
              </button>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Purpose</th>
                  <th>Flat</th>
                  <th>Time In</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No gate activity recorded yet.</td></tr>
                ) : (
                  recentActivity.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: '#6B7280' }}>
                            {activity.name ? activity.name.charAt(0) : 'V'}
                          </div>
                          <strong>{activity.name || 'Visitor'}</strong>
                        </div>
                      </td>
                      <td>{activity.type || '-'}</td>
                      <td>{activity.hostFlat || '-'}</td>
                      <td>{activity.entryTime ? new Date(activity.entryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</td>
                      <td>
                        <span className={`badge ${activity.status === 'inside' ? 'success' : 'primary'}`}>
                          {activity.status}
                        </span>
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
            <h3 className="card-title">System Alerts</h3>
          </div>
          <div style={{ padding: '24px', color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
            No active system alerts.
          </div>
        </div>
      </div>
    </div>
  );
}
