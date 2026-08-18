import React from 'react';
import { Send, Tag } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

export default function StandardLeadForm({
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

      {/* Section 1: Partner Info */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
          1. Your Details (For Direct Cash Payouts)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Input
            label="Your Full Name *"
            name="partnerName"
            value={formData.partnerName}
            onChange={handleInputChange}
            placeholder="e.g. Rahul Sharma"
            required
            isDark={isDark}
          />

          <Input
            label="Your Phone / WhatsApp *"
            type="tel"
            name="partnerPhone"
            value={formData.partnerPhone}
            onChange={handleInputChange}
            placeholder="e.g. 9876543210"
            required
            isDark={isDark}
          />

          <Input
            label="Your UPI ID (For Direct Payouts) *"
            name="partnerUpi"
            value={formData.partnerUpi}
            onChange={handleInputChange}
            placeholder="e.g. rahul@okaxis or 9876543210@paytm"
            required
            isDark={isDark}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
              Your Role / Profile
            </label>
            <select
              name="partnerType"
              value={formData.partnerType}
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
          <Input
            label="Society Name *"
            name="targetSocietyName"
            value={formData.targetSocietyName}
            onChange={handleInputChange}
            placeholder="e.g. Green Valley Residency"
            required
            isDark={isDark}
          />

          <Input
            label="Society City / Location"
            name="targetCity"
            value={formData.targetCity}
            onChange={handleInputChange}
            placeholder="e.g. Hyderabad / Farooqnagar"
            isDark={isDark}
          />

          <Input
            label="Secretary / Committee Phone *"
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="e.g. 9845011223"
            required
            isDark={isDark}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
              Approximate Flats
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
        <Button
          type="submit"
          variant="primary"
          size="medium"
          loading={submitting}
          icon={Send}
          iconPosition="left"
        >
          Submit Society Lead
        </Button>
      </div>
    </form>
  );
}
