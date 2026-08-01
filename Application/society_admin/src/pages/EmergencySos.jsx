import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  AlertTriangle, 
  Check, 
  X,
  FileText
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

export default function EmergencySos() {
  const [sosAlerts, setSosAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'societies/SOC-001/sos_alerts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSosAlerts(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateSosStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'societies/SOC-001/sos_alerts', id), {
        status: newStatus,
        resolvedAt: newStatus === 'Resolved' ? new Date().toISOString() : null
      });
      alert(`SOS Alert status updated to ${newStatus}.`);
    } catch (e) {
      alert('Error updating SOS alert: ' + e.message);
    }
  };

  const activeAlerts = sosAlerts.filter(s => s.status !== 'Resolved' && s.status !== 'Closed');
  const resolvedAlerts = sosAlerts.filter(s => s.status === 'Resolved' || s.status === 'Closed');

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="skeleton-loader" style={{ height: '100px', borderRadius: '12px', marginBottom: '24px' }}></div>
        <div className="skeleton-loader" style={{ height: '300px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. Incident Command Summary */}
      <div className="dashboard-grid">
        <div className="stat-card" style={{ borderColor: activeAlerts.length > 0 ? 'var(--danger)' : 'var(--border-color)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
            <ShieldAlert size={22} color="var(--danger)" />
          </div>
          <div className="stat-info">
            <p>Active SOS Incidents</p>
            <h3 style={{ color: activeAlerts.length > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>{activeAlerts.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <CheckCircle size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Resolved Incidents</p>
            <h3>{resolvedAlerts.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <Clock size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Avg Response Time</p>
            <h3>&lt; 2 Mins</h3>
          </div>
        </div>
      </div>

      {/* 2. Active SOS Incidents Banner */}
      {activeAlerts.length > 0 && (
        <div className="card" style={{ border: '2px solid var(--danger)', backgroundColor: 'var(--danger-light)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <ShieldAlert size={26} color="var(--danger)" />
            <h3 style={{ margin: 0, color: 'var(--danger)', fontSize: '18px', fontWeight: 800 }}>🚨 CRITICAL EMERGENCY SOS ALERTS IN PROGRESS</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeAlerts.map(alert => (
              <div key={alert.id} style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--danger)' }}>{alert.type} Emergency — Flat {alert.flatNumber}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>Resident: {alert.residentName} ({alert.phone})</div>
                  {alert.notes && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Note: "{alert.notes}"</div>}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleUpdateSosStatus(alert.id, 'Acknowledged')}>
                    Acknowledge
                  </button>
                  <button className="btn btn-primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981', padding: '6px 12px', fontSize: '12px' }} onClick={() => handleUpdateSosStatus(alert.id, 'Resolved')}>
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SOS History Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Emergency SOS Incident Log</h3>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Emergency Type</th>
                <th>Resident & Flat</th>
                <th>Contact</th>
                <th>Triggered Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sosAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <ShieldAlert size={36} color="var(--border-color)" style={{ marginBottom: '8px' }} />
                    <div style={{ fontWeight: 600 }}>No emergency SOS alerts logged.</div>
                  </td>
                </tr>
              ) : (
                sosAlerts.map(s => (
                  <tr key={s.id}>
                    <td>
                      <span className="badge danger" style={{ fontWeight: 800 }}>{s.type || 'Medical'}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{s.residentName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Flat {s.flatNumber}</div>
                    </td>
                    <td><div style={{ fontSize: '13px', fontWeight: 600 }}>{s.phone}</div></td>
                    <td><div style={{ fontSize: '12px' }}>{s.createdAt ? new Date(s.createdAt).toLocaleString() : 'Recent'}</div></td>
                    <td>
                      <span className={`badge ${s.status === 'Resolved' ? 'success' : 'danger'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.status !== 'Resolved' && (
                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleUpdateSosStatus(s.id, 'Resolved')}>
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
