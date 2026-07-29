import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Building2, DollarSign, Users, PhoneCall, TrendingUp, Database, ArrowRight, CheckCircle2 } from 'lucide-react';
import { seedDatabase, clearDatabase } from '../../utils/seedDatabase';

export default function SuperAdminDashboard() {
  const [societies, setSocieties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    // Listen to societies
    const qSoc = query(collection(db, 'societies'));
    const unsubSoc = onSnapshot(qSoc, (snapshot) => {
      setSocieties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to real-time website inbound leads
    const qLeads = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubLeads = onSnapshot(qLeads, (snapshot) => {
      setLeads(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.fullName || 'Anonymous',
          phone: data.phone || 'N/A',
          societyName: data.societyName || data.society || 'N/A',
          city: data.city || 'N/A',
          source: data.source || 'Website Form',
          status: data.status || 'New',
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'
        };
      }));
    });

    return () => {
      unsubSoc();
      unsubLeads();
    };
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
    { title: 'Inbound Sales Leads', value: leads.length.toString(), icon: <PhoneCall size={24} color="var(--warning)" />, bg: 'var(--warning-light)' },
    { title: 'Total Mobile Users', value: societies.length > 0 ? societies.length.toString() : '0', icon: <Users size={24} color="var(--danger)" />, bg: 'var(--danger-light)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Super Admin Executive Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Real-time multi-tenant society management & inbound customer lead hub.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
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
            {isSeeding ? 'Initializing...' : 'Initialize Demo Data'}
          </button>
        </div>
      </div>

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

      {/* Main Content Grid: Real-Time Inbound Leads + Onboarded Societies */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Real-Time Inbound Leads Card */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="card-title" style={{ fontSize: '16px', fontWeight: 800 }}>🔥 Real-Time Inbound Leads ({leads.length})</h3>
            <Link to="/super-admin/crm" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View Full CRM</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Contact Name</th>
                  <th>Phone</th>
                  <th>Society / City</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      No inbound website leads submitted yet. Submit any form on the homepage to test!
                    </td>
                  </tr>
                ) : (
                  leads.slice(0, 6).map((ld) => (
                    <tr key={ld.id}>
                      <td><strong>{ld.name}</strong></td>
                      <td>
                        <a href={`tel:${ld.phone}`} style={{ color: '#00B589', fontWeight: 700, textDecoration: 'none' }}>
                          {ld.phone}
                        </a>
                      </td>
                      <td>{ld.societyName !== 'N/A' ? `${ld.societyName} (${ld.city})` : 'N/A'}</td>
                      <td><span style={{ fontSize: '11px', background: '#F1F5F9', padding: '3px 8px', borderRadius: '4px' }}>{ld.source}</span></td>
                      <td>
                        <span className={`badge ${ld.status === 'Closed Won' ? 'success' : ld.status === 'New' ? 'primary' : 'warning'}`}>
                          {ld.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Onboarded Societies Card */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="card-title" style={{ fontSize: '16px', fontWeight: 800 }}>🏛️ Active Societies ({societies.length})</h3>
            <Link to="/super-admin/societies" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}>Manage</Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Society Name</th>
                  <th>City</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {societies.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '24px' }}>No active societies seeded.</td></tr>
                ) : (
                  societies.slice(0, 5).map((soc) => (
                    <tr key={soc.id}>
                      <td><strong>{soc.name}</strong></td>
                      <td>{soc.city}</td>
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

      </div>
    </div>
  );
}
