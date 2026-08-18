import React from 'react';
import { Plus, Sliders } from 'lucide-react';

export default function PartnerLeadsHeader({
  totalSocietiesWon,
  totalCommissionsPaid,
  onOpenConfig,
  onOpenAddModal,
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
          Partner & Referral Leads CRM
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
          Track incoming society leads from property brokers, residents, and social media promoters, and approve UPI payouts.
        </p>
      </div>

      {/* Top Action & Aggregate Stats */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={onOpenConfig}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#EFF6FF', color: '#1E3A8A', border: '1px solid #BFDBFE', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
        >
          <Sliders size={16} /> Edit Commission % Rates
        </button>
        <button
          className="btn btn-primary"
          onClick={onOpenAddModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#1E3A8A', color: '#FFFFFF', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Add Partner Lead
        </button>
        <div style={{ padding: '10px 18px', borderRadius: '12px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>Won Societies</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#059669' }}>{totalSocietiesWon} Live</div>
        </div>
        <div style={{ padding: '10px 18px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#1E3A8A', textTransform: 'uppercase' }}>Commissions Paid</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#1E3A8A' }}>₹{totalCommissionsPaid.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
}
