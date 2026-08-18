import React from 'react';
import { Send } from 'lucide-react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

export default function Step3RwaSecretary({
  onboardingData,
  handleInputChange,
  prevStep,
  submitting,
  onSubmit,
  isDark,
}) {
  return (
    <form onSubmit={onSubmit}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: isDark ? '#FFFFFF' : '#1E293B' }}>
        Step 3: Partner Payout & RWA Secretary Contacts
      </h3>
      <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 20px 0' }}>
        Enter your payout info and the Secretary's contact details to generate their secret activation code.
      </p>

      {/* Partner Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E3A8A', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', paddingBottom: '6px', marginBottom: '14px' }}>
          Your Partner Details (For Payout)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <Input
            label="Your Name *"
            name="partnerName"
            value={onboardingData.partnerName}
            onChange={handleInputChange}
            placeholder="e.g. Rahul Sharma"
            required
            isDark={isDark}
          />
          <Input
            label="Your Phone / WhatsApp *"
            type="tel"
            name="partnerPhone"
            value={onboardingData.partnerPhone}
            onChange={handleInputChange}
            placeholder="e.g. 9876543210"
            required
            isDark={isDark}
          />
          <Input
            label="Your UPI ID (For Direct Payouts) *"
            name="partnerUpi"
            value={onboardingData.partnerUpi}
            onChange={handleInputChange}
            placeholder="e.g. rahul@okaxis"
            required
            isDark={isDark}
          />
        </div>
      </div>

      {/* RWA Secretary Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', paddingBottom: '6px', marginBottom: '14px' }}>
          RWA Secretary Contact Details
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <Input
            label="RWA Secretary Name *"
            name="rwaSecretaryName"
            value={onboardingData.rwaSecretaryName}
            onChange={handleInputChange}
            placeholder="e.g. Mr. K. Rao"
            required
            isDark={isDark}
          />
          <Input
            label="Secretary WhatsApp Mobile *"
            type="tel"
            name="rwaSecretaryPhone"
            value={onboardingData.rwaSecretaryPhone}
            onChange={handleInputChange}
            placeholder="e.g. 9845011223"
            required
            isDark={isDark}
          />
          <Input
            label="Secretary Email (Optional)"
            type="email"
            name="rwaSecretaryEmail"
            value={onboardingData.rwaSecretaryEmail}
            onChange={handleInputChange}
            placeholder="secretary@palmmeadows.com"
            isDark={isDark}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={prevStep} variant="ghost" size="medium">
          ← Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="medium"
          loading={submitting}
          icon={Send}
          iconPosition="left"
        >
          Provision Society & Generate Code
        </Button>
      </div>
    </form>
  );
}
