import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Building2, DollarSign, Users, Megaphone, TrendingUp, Database } from 'lucide-react';
import { seedDatabase, clearDatabase } from '../../utils/seedDatabase';

export default function SuperAdminDashboard() {
  const [societies, setSocieties] = useState([]);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'societies'));
    const unsub = onSnapshot(q, (snapshot) => {
      setSocieties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    const result = await seedDatabase(db);
    alert(result.message);
    setIsSeeding(false);
  };

  const handleClear = async () => {
    setIsSeeding(true);
    const result = await clearDatabase(db);
    alert(result.message);
    setIsSeeding(false);
  };

  const totalMrr = societies.filter(s => s.status === 'Active').reduce((sum, s) => sum + (s.mrr || 0), 0);

  const stats = [
    { title: 'Total Revenue (MRR)', value: `₹${totalMrr.toLocaleString()}`, icon: <DollarSign size={24} color="var(--secondary)" />, bg: 'var(--secondary-light)' },
    { title: 'Active Societies', value: societies.filter(s => s.status === 'Active').length.toString(), icon: <Building2 size={24} color="var(--primary)" />, bg: 'var(--primary-light)' },
    { title: 'Total Mobile Users', value: societies.length > 0 ? societies.length.toString() : '0', icon: <Users size={24} color="var(--warning)" />, bg: 'var(--warning-light)' },
    { title: 'Active Ad Campaigns', value: '0', icon: <Megaphone size={24} color="var(--danger)" />, bg: 'var(--danger-light)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
        <button
          className="btn btn-outline"
          onClick={handleClear}
          disabled={isSeeding}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}
        >
          <Database size={16} />
          Clear All Data
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSeed}
          disabled={isSeeding}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Database size={16} />
          {isSeeding ? 'Initializing...' : 'Initialize Society'}
        </button>
      </div>

      <div className="dashboard-grid">
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

      <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Onboarded Societies (Live)</h3>
            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>View All</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Society ID</th>
                  <th>Society Name</th>
                  <th>City</th>
                  <th>Access Code</th>
                  <th>Monthly Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {societies.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>No societies seeded yet. Click "Seed Database".</td></tr>
                ) : (
                  societies.map((soc) => (
                    <tr key={soc.id}>
                      <td><code>{soc.id}</code></td>
                      <td><strong>{soc.name}</strong></td>
                      <td>{soc.city}</td>
                      <td>
                        <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, fontFamily: 'monospace' }}>
                          {soc.code}
                        </span>
                      </td>
                      <td><strong>₹{soc.mrr?.toLocaleString()}</strong></td>
                      <td>
                        <span className={`badge ${soc.status === 'Active' ? 'success' : 'danger'}`}>
                          {soc.status}
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
            <h3 className="card-title">Platform Insights</h3>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'var(--secondary-light)', borderRadius: '10px' }}>
                <TrendingUp size={20} color="var(--secondary)" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{societies.length > 0 ? '+100% Growth' : '0% Growth'}</p>
                <p style={{ fontSize: '12px' }}>{societies.length} active societies</p>
              </div>
            </div>

            <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Ad Network Revenue</p>
              <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>₹0</h4>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>From local business sponsored banners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
