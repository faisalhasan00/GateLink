import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { calculateSocietyMonthlyFee } from '../../../utils/pricingEngine';

export default function RecentSocietiesFeed({ societies }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
            Recent Onboarded Societies ({societies.length})
          </h3>
        </div>
        <Link to="/societies" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {societies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px' }}>
            No societies onboarded yet.
          </div>
        ) : (
          societies.slice(0, 6).map((soc) => (
            <div
              key={soc.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: '8px',
                background: '#F8FAFC',
                border: '1px solid var(--border-color)',
                fontSize: '13px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={16} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{soc.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {soc.city || 'India'} • {soc.flatCount || 100} flats
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{Number(soc.mrr || soc.monthlyFee || calculateSocietyMonthlyFee(soc.flatCount || 100)).toLocaleString()}/mo
                </div>
                <span className={`badge ${soc.status === 'Active' ? 'success' : 'danger'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                  {soc.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
