import React from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import { usePartnerOnboarding } from '../../hooks/usePartnerOnboarding';
import Step1SocietyDetails from './Step1SocietyDetails';
import Step2StructureGates from './Step2StructureGates';
import Step3RwaSecretary from './Step3RwaSecretary';
import Step4ActivationSuccess from './Step4ActivationSuccess';

export default function PartnerOnboardingWizard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    currentStep,
    onboardingData,
    submitting,
    validationError,
    activationResult,
    handleInputChange,
    nextStep,
    prevStep,
    handleCompleteOnboarding,
    resetOnboarding,
  } = usePartnerOnboarding();

  return (
    <section id="onboarding-wizard" style={{ padding: '60px 0', maxWidth: '840px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
          PARTNER DIRECT ONBOARDING PORTAL
        </span>
        <h2 style={{ fontSize: '30px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '8px 0 10px 0' }}>
          Direct Self-Serve Society Setup
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', margin: 0 }}>
          Skip the sales queue! Configure the society structure, set up gates, and generate an instant WhatsApp activation invite for the RWA Secretary.
        </p>
      </div>

      {/* Progress Bar Steps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', position: 'relative' }}>
        {[
          { num: 1, label: 'Society Info' },
          { num: 2, label: 'Gates & Wings' },
          { num: 3, label: 'RWA & Partner' },
          { num: 4, label: 'Instant Activation' },
        ].map((step) => {
          const isActive = currentStep === step.num;
          const isDone = currentStep > step.num;
          return (
            <div key={step.num} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isDone ? '#059669' : (isActive ? '#1E3A8A' : (isDark ? '#334155' : '#E2E8F0')),
                color: isDone || isActive ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                fontWeight: 800,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px auto',
                transition: 'all 0.3s ease'
              }}>
                {isDone ? '✓' : step.num}
              </div>
              <div style={{ fontSize: '12px', fontWeight: isActive || isDone ? 700 : 500, color: isActive ? (isDark ? '#FFFFFF' : '#1E293B') : (isDark ? '#94A3B8' : '#64748B') }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Form Container */}
      <div style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '16px',
        padding: '36px',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        {validationError && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            {validationError}
          </div>
        )}

        {currentStep === 1 && (
          <Step1SocietyDetails
            onboardingData={onboardingData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            isDark={isDark}
          />
        )}

        {currentStep === 2 && (
          <Step2StructureGates
            onboardingData={onboardingData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            isDark={isDark}
          />
        )}

        {currentStep === 3 && (
          <Step3RwaSecretary
            onboardingData={onboardingData}
            handleInputChange={handleInputChange}
            prevStep={prevStep}
            submitting={submitting}
            onSubmit={handleCompleteOnboarding}
            isDark={isDark}
          />
        )}

        {currentStep === 4 && (
          <Step4ActivationSuccess
            activationResult={activationResult}
            onReset={resetOnboarding}
            isDark={isDark}
          />
        )}
      </div>
    </section>
  );
}
