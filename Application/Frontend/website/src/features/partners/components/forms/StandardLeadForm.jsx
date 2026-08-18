import React from 'react';
import { Send, Tag } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export default function StandardLeadForm({
  formData,
  refCodeFromUrl,
  selectedTier,
  submitting,
  validationError,
  handleInputChange,
  handleFormSubmit,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Promoter Code Notification */}
      {refCodeFromUrl && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <Tag size={16} color="#059669" />
          <span>Referred by Partner Code: <strong>{refCodeFromUrl.toUpperCase()}</strong></span>
        </div>
      )}

      {validationError && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
          {validationError}
        </div>
      )}

      {/* Section 1: Partner Info */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
          1. Your Details (For Direct Cash Payouts)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Full Name *</label>
            <input
              type="text"
              name="partnerName"
              value={formData.partnerName}
              onChange={handleInputChange}
              placeholder="e.g. Rahul Sharma"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Phone / WhatsApp *</label>
            <input
              type="tel"
              name="partnerPhone"
              value={formData.partnerPhone}
              onChange={handleInputChange}
              placeholder="e.g. 9876543210"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your UPI ID (For Direct Payouts) *</label>
            <input
              type="text"
              name="partnerUpi"
              value={formData.partnerUpi}
              onChange={handleInputChange}
              placeholder="e.g. rahul@okaxis or 9876543210@paytm"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Role / Profile</label>
            <select
              name="partnerType"
              value={formData.partnerType}
              onChange={handleInputChange}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            >
              <option value="resident">Resident / Flat Owner</option>
              <option value="committee">RWA Committee Member</option>
              <option value="broker">Property Broker / Agent</option>
              <option value="freelancer">Independent Friend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Target Society */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
          2. Target Society / Building Information
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Society Name *</label>
            <input
              type="text"
              name="targetSocietyName"
              value={formData.targetSocietyName}
              onChange={handleInputChange}
              placeholder="e.g. Green Valley Residency"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Society City / Location</label>
            <input
              type="text"
              name="targetCity"
              value={formData.targetCity}
              onChange={handleInputChange}
              placeholder="e.g. Hyderabad / Farooqnagar"
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Secretary / Committee Phone *</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="e.g. 9845011223"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Approximate Flats</label>
            <select
              name="approxFlats"
              value={formData.approxFlats}
              onChange={handleInputChange}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            >
              <option value="50-100">50 - 100 Flats</option>
              <option value="100-250">100 - 250 Flats</option>
              <option value="250-500">250 - 500 Flats</option>
              <option value="500+">500+ Flats</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer & Submit */}
      <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666' }}>
          🔒 Direct payout guarantee. We never share partner contact info.
        </span>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 32px',
            borderRadius: '12px',
            backgroundColor: '#1E3A8A',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Send size={15} />
          <span>{submitting ? 'Submitting Lead...' : 'Submit Society Lead'}</span>
        </button>
      </div>
    </form>
  );
}
