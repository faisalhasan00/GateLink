import React from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

export default function Step1SocietyDetails({
  onboardingData,
  handleInputChange,
  nextStep,
  isDark,
}) {
  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: isDark ? '#FFFFFF' : '#1E293B' }}>
        Step 1: Society Identity & Location
      </h3>
      <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 20px 0' }}>
        Enter the official building name and location details of the society you are onboarding.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Input
          label="Society / Gated Community Name *"
          name="societyName"
          value={onboardingData.societyName}
          onChange={handleInputChange}
          placeholder="e.g. Palm Meadows Residency"
          required
          isDark={isDark}
        />

        <Input
          label="City *"
          name="city"
          value={onboardingData.city}
          onChange={handleInputChange}
          placeholder="e.g. Hyderabad / Pune / Bengaluru"
          required
          isDark={isDark}
        />

        <Input
          label="Full Address *"
          name="address"
          value={onboardingData.address}
          onChange={handleInputChange}
          placeholder="e.g. Plot No 42, Financial District, Gachibowli"
          required
          isDark={isDark}
        />

        <Input
          label="Pincode"
          name="pincode"
          value={onboardingData.pincode}
          onChange={handleInputChange}
          placeholder="e.g. 500032"
          isDark={isDark}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={nextStep} variant="primary" size="medium">
          Next: Tower & Gate Setup →
        </Button>
      </div>
    </div>
  );
}
