import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, XCircle } from 'lucide-react';

export default function RecentLeadsFeed({
  leads,
  selectedLead,
  setSelectedLead,
  onStatusUpdate
}) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
            Live Website Inbound Leads ({leads.length})
          </h3>
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

      {selectedLead && (
        <div style={{ marginTop: '20px', padding: '16px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid var(--border-color)', position: 'relative' }}>
          <button
            onClick={() => setSelectedLead(null)}
            style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <XCircle size={18} />
          </button>
          <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
            Lead Details: {selectedLead.name}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <div>
              <Phone size={13} style={{ display: 'inline', marginRight: '6px' }} />
              <a href={`tel:${selectedLead.phone}`}>{selectedLead.phone}</a>
            </div>
            {selectedLead.email && (
              <div>
                <Mail size={13} style={{ display: 'inline', marginRight: '6px' }} />
                <a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a>
              </div>
            )}
            <div>Society: <strong>{selectedLead.societyName || 'N/A'}</strong></div>
            <div>Stage: <strong>{selectedLead.status}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
