import React from 'react';
import { Gift, Phone, CheckCircle2, DollarSign, Trash2 } from 'lucide-react';

export default function PartnerLeadsTable({
  loading,
  filteredLeads,
  onStatusChange,
  onOpenPayoutModal,
  onDeleteLead,
}) {
  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading real-time partner leads...
      </div>
    );
  }

  if (filteredLeads.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
        <Gift size={36} color="#94A3B8" style={{ margin: '0 auto 10px auto' }} />
        <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0' }}>No Partner Leads Found</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          No leads match your current search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflowX: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E5E7EB', color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <th style={{ padding: '14px 16px' }}>Lead Ref</th>
            <th style={{ padding: '14px 16px' }}>Target Society</th>
            <th style={{ padding: '14px 16px' }}>RWA Contact</th>
            <th style={{ padding: '14px 16px' }}>Partner Details</th>
            <th style={{ padding: '14px 16px' }}>Tier</th>
            <th style={{ padding: '14px 16px' }}>Pipeline Stage</th>
            <th style={{ padding: '14px 16px' }}>Payout Status</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
              {/* Ref */}
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{lead.referenceId || lead.id.slice(0, 8)}</span>
                {lead.referredByCode && (
                  <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600, marginTop: '2px' }}>
                    Ref: {lead.referredByCode}
                  </div>
                )}
              </td>

              {/* Society */}
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{lead.targetSocietyName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lead.targetCity || 'India'} • {lead.approxFlats} Flats
                </div>
              </td>

              {/* Contact */}
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 700 }}>{lead.contactPerson || 'Secretary'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lead.contactRole}</div>
                {lead.contactPhone && (
                  <a href={`tel:${lead.contactPhone}`} style={{ fontSize: '12px', color: '#0EA5E9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Phone size={11} /> {lead.contactPhone}
                  </a>
                )}
              </td>

              {/* Partner */}
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{lead.partnerName}</div>
                <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>UPI: {lead.partnerUpi || 'Not given'}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{lead.partnerPhone} • {lead.partnerType}</div>
              </td>

              {/* Tier */}
              <td style={{ padding: '14px 16px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  backgroundColor: lead.assignedTier === 'growth' ? '#EFF6FF' : (lead.assignedTier === 'onboarding' ? '#E0F2FE' : '#ECFDF5'),
                  color: lead.assignedTier === 'growth' ? '#1E3A8A' : (lead.assignedTier === 'onboarding' ? '#0284C7' : '#059669')
                }}>
                  {lead.assignedTier === 'growth' ? 'Growth (Lifetime)' : (lead.assignedTier === 'onboarding' ? 'Onboarding' : 'Referral')}
                </span>
              </td>

              {/* Stage Dropdown */}
              <td style={{ padding: '14px 16px' }}>
                <select
                  value={lead.status || 'new'}
                  onChange={(e) => onStatusChange(lead.id, e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: lead.status === 'won' ? '#ECFDF5' : '#FFFFFF',
                    border: lead.status === 'won' ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                    color: lead.status === 'won' ? '#065F46' : '#1E293B',
                    cursor: 'pointer'
                  }}
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="demo_scheduled">Demo Scheduled</option>
                  <option value="won">Won / Active</option>
                  <option value="lost">Lost</option>
                </select>
              </td>

              {/* Payout */}
              <td style={{ padding: '14px 16px' }}>
                {lead.payoutStatus === 'paid' ? (
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800 }}>
                      <CheckCircle2 size={12} /> ₹{lead.payoutTotal || 500} Paid
                    </span>
                    {lead.utrNumber && (
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        UTR: {lead.utrNumber}
                      </div>
                    )}
                  </div>
                ) : lead.status === 'won' ? (
                  <button
                    onClick={() => onOpenPayoutModal(lead)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#1E3A8A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <DollarSign size={13} /> Pay Partner
                  </button>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>On Close</span>
                )}
              </td>

              {/* Actions */}
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button
                  onClick={() => onDeleteLead(lead.id, lead.targetSocietyName)}
                  title="Delete Lead"
                  style={{ padding: '6px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
