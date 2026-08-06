import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Building2, DollarSign, Users, PhoneCall, TrendingUp, Database, ArrowRight, CheckCircle2, Phone, Mail, MapPin, Layers, XCircle, ShieldCheck } from 'lucide-react';
import { seedDatabase, clearDatabase } from '../../utils/seedDatabase';

export default function SuperAdminDashboard() {
  const [societies, setSocieties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

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
          email: data.email || 'N/A',
          societyName: data.societyName || data.society || 'N/A',
          city: data.city || 'N/A',
          flatCount: data.flatCount || data.flats || 'N/A',
          source: data.source || 'Website Form',
          reason: data.reason || '',
          selectedModules: data.selectedModules || [],
          status: data.status || 'New',
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'Just now'
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

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error('Lead status update error:', err);
    }
  };

  const totalMrr = societies.filter(s => s.status === 'Active').reduce((sum, s) => sum + (s.mrr || 0), 0);
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const closedWonCount = leads.filter(l => l.status === 'Closed Won').length;
  const conversionRate = leads.length > 0 ? Math.round((closedWonCount / leads.length) * 100) : 0;

  const stats = [
    { title: 'Total MRR Revenue', value: `₹${totalMrr.toLocaleString()}`, icon: <DollarSign size={24} color="var(--secondary)" />, bg: 'var(--secondary-light)' },
    { title: 'Active Societies', value: societies.filter(s => s.status === 'Active').length.toString(), icon: <Building2 size={24} color="var(--primary)" />, bg: 'var(--primary-light)' },
    { title: 'Inbound Sales Leads', value: leads.length.toString(), icon: <PhoneCall size={24} color="var(--warning)" />, bg: 'var(--warning-light)' },
    { title: 'Conversion Rate', value: `${conversionRate}%`, icon: <TrendingUp size={24} color="var(--danger)" />, bg: 'var(--danger-light)' },
  ];

  return (
    <div>
      {/* Top Header & Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>Super Admin Executive Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Real-time multi-tenant society management, sales CRM pipeline & inbound customer lead hub.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            onClick={handleClear}
            disabled={isSeeding}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}
          >
            <Database size={16} />
            Wipe Dummy Societies
          </button>
          <Link
            to="/societies"
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <Building2 size={16} />
            + Onboard New Society
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
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

      {/* Sales Pipeline Funnel Overview Banner */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>📊 Sales Lead Pipeline Breakdown</div>
          <Link to="/crm" style={{ color: '#00B589', textDecoration: 'none', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Manage All Leads in CRM</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          {['New', 'Contacted', 'Demo Scheduled', 'Proposal Sent', 'Closed Won'].map(stage => {
            const count = leads.filter(l => l.status === stage).length;
            return (
              <div key={stage} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>{stage}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: stage === 'New' ? '#38BDF8' : stage === 'Closed Won' ? '#34D399' : '#FFFFFF', marginTop: '4px' }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid: Real-Time Inbound Leads + Onboarded Societies */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Real-Time Inbound Leads Card */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="card-title" style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>🔥 Live Website Inbound Leads ({leads.length})</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Click any lead row to inspect contact details</p>
            </div>
            <Link to="/crm" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Open CRM</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Contact Name</th>
                  <th>Phone Number</th>
                  <th>Society / Location</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      No inbound website leads submitted yet. Submit any form on the landing page to test!
                    </td>
                  </tr>
                ) : (
                  leads.slice(0, 8).map((ld) => (
                    <tr 
                      key={ld.id} 
                      onClick={() => setSelectedLead(ld)} 
                      style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td><strong>{ld.name}</strong></td>
                      <td>
                        <a 
                          href={`tel:${ld.phone}`} 
                          onClick={e => e.stopPropagation()}
                          style={{ color: '#00B589', fontWeight: 700, textDecoration: 'none' }}
                        >
                          {ld.phone}
                        </a>
                      </td>
                      <td>{ld.societyName !== 'N/A' ? `${ld.societyName} ${ld.city !== 'N/A' ? `(${ld.city})` : ''}` : 'N/A'}</td>
                      <td><span style={{ fontSize: '11px', background: 'var(--bg-color)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>{ld.source}</span></td>
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
            <Link to="/societies" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}>Manage Tiers</Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Society Name</th>
                  <th>City</th>
                  <th>Code</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {societies.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>No active societies seeded.</td></tr>
                ) : (
                  societies.slice(0, 6).map((soc) => (
                    <tr key={soc.id}>
                      <td><strong>{soc.name}</strong></td>
                      <td>{soc.city}</td>
                      <td><code>{soc.code}</code></td>
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

      {/* Lead Inspection Modal Drawer */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '100%', padding: '28px', borderRadius: '8px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#00B589', letterSpacing: '1px', textTransform: 'uppercase' }}>LEAD INSPECTOR</div>
                <h3 style={{ margin: '2px 0 0 0', fontWeight: 900, fontSize: '20px' }}>{selectedLead.name}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <XCircle size={22} color="#64748B" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>PHONE NUMBER</div>
                  <a href={`tel:${selectedLead.phone}`} style={{ fontSize: '15px', fontWeight: 800, color: '#00B589', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Phone size={14} /> {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>EMAIL ADDRESS</div>
                  <a href={`mailto:${selectedLead.email}`} style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Mail size={14} /> {selectedLead.email}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Society / Building:</span>
                  <strong>{selectedLead.societyName} ({selectedLead.city})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Total Flat Count:</span>
                  <strong>{selectedLead.flatCount} Flats</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Inbound Form Source:</span>
                  <strong style={{ color: '#6366F1' }}>{selectedLead.source}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Submission Date:</span>
                  <span>{selectedLead.createdAt}</span>
                </div>
                {selectedLead.reason && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748B' }}>Selected Reason:</span>
                    <strong>{selectedLead.reason}</strong>
                  </div>
                )}
                {selectedLead.selectedModules.length > 0 && (
                  <div>
                    <span style={{ color: '#64748B', display: 'block', marginBottom: '6px' }}>Requested Modules:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedLead.selectedModules.map(m => (
                        <span key={m} style={{ fontSize: '11px', background: '#ECFDF5', color: '#00B589', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          ✓ {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Update Controls */}
              <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontWeight: 800, fontSize: '13px' }}>Update Stage:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusUpdate(selectedLead.id, e.target.value)}
                  style={{ padding: '8px 14px', borderRadius: '4px', border: '1px solid #CBD5E1', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Demo Scheduled">Demo Scheduled</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <a href={`tel:${selectedLead.phone}`} style={{ flex: 1, padding: '12px', borderRadius: '4px', backgroundColor: '#00B589', color: 'white', textDecoration: 'none', fontWeight: 800, textAlign: 'center', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Phone size={16} /> Call Lead Now
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
