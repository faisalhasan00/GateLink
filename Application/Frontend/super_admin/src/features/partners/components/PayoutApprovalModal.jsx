import React from 'react';
import { DollarSign, X } from 'lucide-react';

export default function PayoutApprovalModal({
  selectedLead,
  payoutAmount,
  setPayoutAmount,
  utrNumber,
  setUtrNumber,
  payoutNotes,
  setPayoutNotes,
  savingPayout,
  onClose,
  onSubmit,
  onInstantCashfreePayout,
}) {
  if (!selectedLead) return null;

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
        maxWidth: '480px',
        width: '100%',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} color="#1E3A8A" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Approve Partner Payout</h3>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Society: {selectedLead.targetSocietyName}</div>
          </div>
        </div>

        {/* 1-Click Cashfree Instant Payout Header Box */}
        <div style={{ padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #1E3A8A 0%, #0EA5E9 100%)', color: '#FFFFFF', marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', opacity: 0.9, textTransform: 'uppercase' }}>
            CASHFREE AUTOMATED PAYOUTS
          </div>
          <div style={{ fontSize: '15px', fontWeight: 900, margin: '4px 0' }}>
            Instant Direct UPI Transfer
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '12px' }}>
            Sends ₹{payoutAmount || 500} directly to <strong>{selectedLead.partnerUpi || 'UPI'}</strong> in 2 seconds.
          </div>
          <button
            type="button"
            disabled={savingPayout || !selectedLead.partnerUpi}
            onClick={onInstantCashfreePayout}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: savingPayout ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
            }}
          >
            ⚡ {savingPayout ? 'Processing Instant UPI...' : `Transfer ₹${payoutAmount || 500} via Cashfree UPI Now`}
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', fontWeight: 700, margin: '14px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          — OR RECORD MANUAL BANK TRANSFER —
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner UPI ID</label>
            <input
              type="text"
              readOnly
              value={selectedLead.partnerUpi || 'No UPI ID Provided'}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#059669', fontWeight: 700, fontSize: '13px' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Payout Amount (₹) *</label>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Min ₹150 • Max ₹500 Cap</span>
            </div>
            <input
              type="number"
              min="150"
              max="500"
              value={payoutAmount}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 500) {
                  setPayoutAmount('500');
                } else {
                  setPayoutAmount(e.target.value);
                }
              }}
              placeholder="500"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>12-Digit Bank / UPI Reference (UTR) Number *</label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 628491028374"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
            <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'block' }}>
              This official proof will be displayed on the partner's status dashboard.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Notes / Description</label>
            <input
              type="text"
              value={payoutNotes}
              onChange={(e) => setPayoutNotes(e.target.value)}
              placeholder="e.g. Month 1 10% Onboarding Bonus"
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
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
              disabled={savingPayout}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1E3A8A', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: savingPayout ? 'not-allowed' : 'pointer' }}
            >
              {savingPayout ? 'Recording...' : 'Confirm & Save Proof'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
