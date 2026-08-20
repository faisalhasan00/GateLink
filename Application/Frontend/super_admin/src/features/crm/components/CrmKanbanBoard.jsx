import React from 'react';
import { Phone, Mail, Trash2 } from 'lucide-react';

export default function CrmKanbanBoard({
  stages,
  leads,
  onStageChange,
  onDeleteLead
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
      {stages.map((stage) => {
        const stageLeads = leads.filter((item) => item.status === stage);
        return (
          <div key={stage} style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stage}</h4>
              <span className="badge primary" style={{ fontSize: '11px', fontWeight: 900, borderRadius: '12px', padding: '2px 8px' }}>
                {stageLeads.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '120px' }}>
              {stageLeads.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '30px 0', fontStyle: 'italic' }}>
                  No leads in {stage}
                </div>
              ) : (
                stageLeads.map((lead) => (
                  <div key={lead.id} className="card" style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '15px', color: 'var(--text-primary)' }}>{lead.name}</div>
                        {lead.societyName !== 'N/A' && (
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#00B589', marginTop: '2px' }}>
                            🏛️ {lead.societyName} {lead.city !== 'N/A' ? `(${lead.city})` : ''}
                          </div>
                        )}
                      </div>
                      <button onClick={() => onDeleteLead(lead.id)} aria-label="Delete Lead" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', margin: '10px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={13} color="#00B589" />
                        <a href={`tel:${lead.phone}`} style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
                          {lead.phone}
                        </a>
                      </div>
                      {lead.email !== 'N/A' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={13} color="#3B82F6" />
                          <a href={`mailto:${lead.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                            {lead.email}
                          </a>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Stage:</span>
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => onStageChange(lead.id, e.target.value)}
                        style={{ flex: 1, padding: '4px 8px', fontSize: '12px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', outline: 'none' }}
                      >
                        {stages.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
