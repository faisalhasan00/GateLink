import React from 'react';
import { Handshake, X } from 'lucide-react';

export default function AddPartnerLeadModal({
  isOpen,
  onClose,
  newLeadData,
  setNewLeadData,
  submittingLead,
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
            <Handshake size={20} color="#1E3A8A" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Add Manual Partner Lead</h3>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Register partner lead received via phone, WhatsApp, or direct meeting.</div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner Name *</label>
              <input
                type="text"
                required
                value={newLeadData.partnerName}
                onChange={(e) => setNewLeadData({ ...newLeadData, partnerName: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner Phone *</label>
              <input
                type="tel"
                required
                value={newLeadData.partnerPhone}
                onChange={(e) => setNewLeadData({ ...newLeadData, partnerPhone: e.target.value })}
                placeholder="9876543210"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner UPI ID</label>
              <input
                type="text"
                value={newLeadData.partnerUpi}
                onChange={(e) => setNewLeadData({ ...newLeadData, partnerUpi: e.target.value })}
                placeholder="e.g. rahul@okaxis"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner Type</label>
              <select
                value={newLeadData.partnerType}
                onChange={(e) => setNewLeadData({ ...newLeadData, partnerType: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
              >
                <option value="broker">Property Broker / Agent</option>
                <option value="resident">Society Resident</option>
                <option value="creator">Social Influencer / Promoter</option>
                <option value="independent">Independent Freelancer</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Target Society Name *</label>
              <input
                type="text"
                required
                value={newLeadData.targetSocietyName}
                onChange={(e) => setNewLeadData({ ...newLeadData, targetSocietyName: e.target.value })}
                placeholder="e.g. Palm Meadows"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Target City</label>
              <input
                type="text"
                value={newLeadData.targetCity}
                onChange={(e) => setNewLeadData({ ...newLeadData, targetCity: e.target.value })}
                placeholder="e.g. Mumbai, Pune"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>RWA Contact Person</label>
              <input
                type="text"
                value={newLeadData.contactPerson}
                onChange={(e) => setNewLeadData({ ...newLeadData, contactPerson: e.target.value })}
                placeholder="Secretary Name"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>RWA Phone</label>
              <input
                type="tel"
                value={newLeadData.contactPhone}
                onChange={(e) => setNewLeadData({ ...newLeadData, contactPhone: e.target.value })}
                placeholder="Secretary Phone"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Approx Flat Count</label>
              <select
                value={newLeadData.approxFlats}
                onChange={(e) => setNewLeadData({ ...newLeadData, approxFlats: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
              >
                <option value="40-100">40 - 100 Flats</option>
                <option value="100-250">100 - 250 Flats</option>
                <option value="250-500">250 - 500 Flats</option>
                <option value="500+">500+ Flats</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Commission Tier</label>
              <select
                value={newLeadData.assignedTier}
                onChange={(e) => setNewLeadData({ ...newLeadData, assignedTier: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
              >
                <option value="growth">Tier 3: Growth Partner (Lifetime)</option>
                <option value="onboarding">Tier 2: Onboarding Partner (10%)</option>
                <option value="referral">Tier 1: Referral Partner (5%)</option>
              </select>
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
              disabled={submittingLead}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1E3A8A', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: submittingLead ? 'not-allowed' : 'pointer' }}
            >
              {submittingLead ? 'Saving...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
