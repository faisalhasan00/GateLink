import React from 'react';
import { Send, Sparkles, Tag } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export default function GrowthPartnerForm({
  formData,
  refCodeFromUrl,
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

      {/* Section 1: Agency Business Profile */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#1E3A8A', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
          1. Brokerage / Agency Profile & Payout Info
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Broker / Agency Firm Name</label>
            <input
              type="text"
              name="brokerAgencyName"
              value={formData.brokerAgencyName}
              onChange={handleInputChange}
              placeholder="e.g. Apex Realty & Facility Services"
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Managing Partner Name *</label>
            <input
              type="text"
              name="partnerName"
              value={formData.partnerName}
              onChange={handleInputChange}
              placeholder="e.g. Vikram Singhal"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Phone / WhatsApp *</label>
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Business UPI ID *</label>
            <input
              type="text"
              name="partnerUpi"
              value={formData.partnerUpi}
              onChange={handleInputChange}
              placeholder="e.g. apexrealty@icici"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Primary Operating Cities / Localities</label>
            <input
              type="text"
              name="operatingAreas"
              value={formData.operatingAreas}
              onChange={handleInputChange}
              placeholder="e.g. Hitec City, Gachibowli, Kondapur"
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Estimated Pipeline (Next 60 Days)</label>
            <select
              name="estimatedSocietyPipeline"
              value={formData.estimatedSocietyPipeline}
              onChange={handleInputChange}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            >
              <option value="3 - 5 Societies">3 - 5 Societies (Standard Growth Tier)</option>
              <option value="5 - 10 Societies">5 - 10 Societies</option>
              <option value="10+ Mega Communities">10+ Mega Gated Communities</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: First Target Society */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#1E3A8A', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
          2. First Society in Your Pipeline
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>First Society Name *</label>
            <input
              type="text"
              name="targetSocietyName"
              value={formData.targetSocietyName}
              onChange={handleInputChange}
              placeholder="e.g. Prestige High Fields"
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Approx Flat Count</label>
            <select
              name="approxFlats"
              value={formData.approxFlats}
              onChange={handleInputChange}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            >
              <option value="100-250">100 - 250 Flats</option>
              <option value="250-500">250 - 500 Flats</option>
              <option value="500+">500+ Large Township</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Society Committee Contact (Optional)</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              placeholder="e.g. Secretary Name & Phone"
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* Footer & Submit */}
      <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666' }}>
          🔒 Includes Dedicated Partner Relationship Manager & Lifetime Contract.
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
          <Sparkles size={15} />
          <span>{submitting ? 'Registering...' : 'Register as Growth Partner'}</span>
        </button>
      </div>
    </form>
  );
}
