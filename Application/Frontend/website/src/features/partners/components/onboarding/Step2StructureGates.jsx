import React from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

export default function Step2StructureGates({
  onboardingData,
  handleInputChange,
  nextStep,
  prevStep,
  isDark,
}) {
  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: isDark ? '#FFFFFF' : '#1E293B' }}>
        Step 2: Wings, Flat Count & Gate Configuration
      </h3>
      <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 20px 0' }}>
        Configure the physical structure, gates, and tablet requirements for security guards.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Input
          label="Total Flat Count *"
          type="number"
          name="flatCount"
          value={onboardingData.flatCount}
          onChange={handleInputChange}
          placeholder="150"
          required
          isDark={isDark}
        />

        <Input
          label="Towers / Wings (Comma Separated)"
          name="wingsText"
          value={onboardingData.wingsText}
          onChange={handleInputChange}
          placeholder="Wing A, Wing B, Wing C, Wing D"
          isDark={isDark}
        />

        <Input
          label="Number of Entry / Exit Gates *"
          type="number"
          name="gatesCount"
          value={onboardingData.gatesCount}
          onChange={handleInputChange}
          placeholder="2"
          required
          isDark={isDark}
        />

        <Input
          label="Guard Tablet Devices Needed *"
          type="number"
          name="guardDevicesCount"
          value={onboardingData.guardDevicesCount}
          onChange={handleInputChange}
          placeholder="2"
          required
          isDark={isDark}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={prevStep} variant="ghost" size="medium">
          ← Back
        </Button>
        <Button onClick={nextStep} variant="primary" size="medium">
          Next: RWA Secretary Contact →
        </Button>
      </div>
    </div>
  );
}
