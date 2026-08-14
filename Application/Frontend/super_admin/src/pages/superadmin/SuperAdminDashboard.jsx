import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, DollarSign, PhoneCall, TrendingUp, ArrowRight, Phone, Mail, XCircle } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';

export default function SuperAdminDashboard() {
  const [societies, setSocieties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    let unsubSoc;
    if (typeof superAdminService?.subscribeSocieties === 'function') {
      unsubSoc = superAdminService.subscribeSocieties(
        (data) => setSocieties(data),
        (err) => console.error(err)
      );
    }

    let unsubLeads;
    const subLeadsFn = superAdminService?.subscribeLeads || superAdminService?.subscribeCrmLeads;
    if (typeof subLeadsFn === 'function') {
      unsubLeads = subLeadsFn.call(
        superAdminService,
        (data) => setLeads(data),
        (err) => console.error(err)
      );
    }

    return () => {
      if (unsubSoc) unsubSoc();
      if (unsubLeads) unsubLeads();
    };
  }, []);

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      await superAdminService.updateLeadStatus(leadId, newStatus);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error('Lead status update error:', err);
    }
  };

  const totalMrr = societies.filter(s => s.status === 'Active' || s.status === 'active').reduce((sum, s) => sum + (s.mrr || 0), 0);
  const closedWonCount = leads.filter(l => l.status === 'Closed Won').length;
  const conversionRate = leads.length > 0 ? Math.round((closedWonCount / leads.length) * 100) : 0;

  const stats = [
    { title: 'Total MRR Revenue', value: `₹${totalMrr.toLocaleString()}`, icon: <DollarSign size={24} color="var(--secondary)" />, bg: 'var(--secondary-light)' },
    { title: 'Active Societies', value: societies.filter(s => s.status === 'Active' || s.status === 'active').length.toString(), icon: <Building2 size={24} color="var(--primary)" />, bg: 'var(--primary-light)' },
    { title: 'Inbound Sales Leads', value: leads.length.toString(), icon: <PhoneCall size={24} color="var(--warning)" />, bg: 'var(--warning-light)' },
    { title: 'Conversion Rate', value: `${conversionRate}%`, icon: <TrendingUp size={24} color="var(--danger)" />, bg: 'var(--danger-light)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>Super Admin Executive Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Real-time multi-tenant society management, sales CRM pipeline & inbound customer lead hub.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/societies" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Building2 size={16} /> + Onboard New Society
          </Link>
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

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="card-title" style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>🔥 Live Website Inbound Leads ({leads.length})</h3>
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 8).map((ld) => (
                  <tr key={ld.id} onClick={() => setSelectedLead(ld)} style={{ cursor: 'pointer' }}>
                    <td><strong>{ld.name}</strong></td>
                    <td>{ld.phone}</td>
                    <td>{ld.societyName || 'N/A'}</td>
                    <td><span className="badge primary">{ld.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {societies.slice(0, 6).map((soc) => (
                  <tr key={soc.id}>
                    <td><strong>{soc.name}</strong></td>
                    <td>{soc.city}</td>
                    <td><span className="badge success">{soc.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '100%', padding: '28px', borderRadius: '8px' }}>
            <div className="modal-header">
              <h3>{selectedLead.name}</h3>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <XCircle size={22} color="#64748B" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>Phone: {selectedLead.phone}</div>
              <div>Email: {selectedLead.email}</div>
              <div>Society: {selectedLead.societyName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                <span>Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusUpdate(selectedLead.id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed Won">Closed Won</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
