import React from 'react';
import { Send, Tag } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

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
          <Input
            label="Broker / Agency Firm Name"
            name="brokerAgencyName"
            value={formData.brokerAgencyName}
            onChange={handleInputChange}
            placeholder="e.g. Apex Realty & Facility Services"
            isDark={isDark}
          />

          <Input
            label="Managing Partner Name *"
            name="partnerName"
            value={formData.partnerName}
            onChange={handleInputChange}
            placeholder="e.g. Vikram Singhal"
            required
            isDark={isDark}
          />

          <Input
            label="Phone / WhatsApp *"
            type="tel"
            name="partnerPhone"
            value={formData.partnerPhone}
            onChange={handleInputChange}
            placeholder="e.g. 9876543210"
            required
            isDark={isDark}
          />

          <Input
            label="Business UPI ID *"
            name="partnerUpi"
            value={formData.partnerUpi}
            onChange={handleInputChange}
            placeholder="e.g. apexrealty@icici"
            required
            isDark={isDark}
          />

          <Input
            label="Primary Operating Cities / Localities"
            name="operatingAreas"
            value={formData.operatingAreas}
            onChange={handleInputChange}
            placeholder="e.g. Hitec City, Gachibowli, Kondapur"
            isDark={isDark}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
              Estimated Pipeline (Next 60 Days)
            </label>
            <select
              name="estimatedSocietyPipeline"
              value={formData.estimatedSocietyPipeline}
              onChange={handleInputChange}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1.5px solid #E2E8F0',
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontSize: '14px',
                outline: 'none'
              }}
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
          <Input
            label="First Society Name *"
            name="targetSocietyName"
            value={formData.targetSocietyName}
            onChange={handleInputChange}
            placeholder="e.g. Prestige High Fields"
            required
            isDark={isDark}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
              Approx Flat Count
            </label>
            <select
              name="approxFlats"
              value={formData.approxFlats}
              onChange={handleInputChange}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1.5px solid #E2E8F0',
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="100-250">100 - 250 Flats</option>
              <option value="250-500">250 - 500 Flats</option>
              <option value="500+">500+ Large Township</option>
            </select>
          </div>

          <Input
            label="Society Committee Contact (Optional)"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            placeholder="e.g. Secretary Name & Phone"
            isDark={isDark}
          />
        </div>
      </div>

      {/* Footer & Submit */}
      <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666' }}>
          🔒 Includes Dedicated Partner Relationship Manager & Lifetime Contract.
        </span>
        <Button
          type="submit"
          variant="primary"
          size="medium"
          loading={submitting}
          icon={Send}
          iconPosition="left"
        >
          Register as Growth Partner
        </Button>
      </div>
    </form>
  );
}
