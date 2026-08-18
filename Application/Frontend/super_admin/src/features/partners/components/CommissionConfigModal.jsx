import React from 'react';
import { Sliders, X } from 'lucide-react';

export default function CommissionConfigModal({
  isOpen,
  onClose,
  commissionRates,
  setCommissionRates,
  savingConfig,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sliders size={20} color="#1E3A8A" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Partner Commission Control</h3>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Adjust the payout percentages dynamically whenever you want.</div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tier 1 */}
          <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669', marginBottom: '8px' }}>
              Tier 1: Referral Partner (Intro Only)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Month 1 Bonus (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={commissionRates.tier1Month1Percent}
                  onChange={(e) => setCommissionRates({ ...commissionRates, tier1Month1Percent: Number(e.target.value) })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Monthly Recurring (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={commissionRates.tier1MonthlyPercent}
                  onChange={(e) => setCommissionRates({ ...commissionRates, tier1MonthlyPercent: Number(e.target.value) })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', marginBottom: '8px' }}>
              Tier 2: Onboarding Partner (Assists Demo)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Month 1 Bonus (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={commissionRates.tier2Month1Percent}
                  onChange={(e) => setCommissionRates({ ...commissionRates, tier2Month1Percent: Number(e.target.value) })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Monthly Recurring (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={commissionRates.tier2MonthlyPercent}
                  onChange={(e) => setCommissionRates({ ...commissionRates, tier2MonthlyPercent: Number(e.target.value) })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          {/* Tier 3 */}
          <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E3A8A', marginBottom: '8px' }}>
              Tier 3: Growth Partner (Exclusive / Lifetime)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Month 1 Bonus (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={commissionRates.tier3Month1Percent}
                  onChange={(e) => setCommissionRates({ ...commissionRates, tier3Month1Percent: Number(e.target.value) })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Monthly Recurring (%) [Lifetime]</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={commissionRates.tier3MonthlyPercent}
                  onChange={(e) => setCommissionRates({ ...commissionRates, tier3MonthlyPercent: Number(e.target.value) })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          {/* Base Platform Rates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Base SaaS Rate (₹/Flat/Mo)</label>
              <input
                type="number"
                value={commissionRates.baseRatePerFlat}
                onChange={(e) => setCommissionRates({ ...commissionRates, baseRatePerFlat: Number(e.target.value) })}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Min Flat Threshold</label>
              <input
                type="number"
                value={commissionRates.minFlatsThreshold}
                onChange={(e) => setCommissionRates({ ...commissionRates, minFlatsThreshold: Number(e.target.value) })}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingConfig}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1E3A8A', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: savingConfig ? 'not-allowed' : 'pointer' }}
            >
              {savingConfig ? 'Saving...' : 'Save Commission Rates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
