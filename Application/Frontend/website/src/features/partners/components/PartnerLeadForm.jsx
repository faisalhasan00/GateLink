import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import PartnerFormTierToggle from './forms/PartnerFormTierToggle';
import StandardLeadForm from './forms/StandardLeadForm';
import GrowthPartnerForm from './forms/GrowthPartnerForm';
import PartnerFormSuccess from './forms/PartnerFormSuccess';

export default function PartnerLeadForm({
  formData,
  refCodeFromUrl,
  selectedTier,
  setSelectedTier,
  submitting,
  submittedRef,
  validationError,
  handleInputChange,
  handleFormSubmit,
  resetForm,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isGrowthTier = selectedTier === 'growth';

  return (
    <section id="lead-form" style={{ padding: '60px 0 80px 0' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Clean Header & 2-Way Toggle */}
        <PartnerFormTierToggle
          selectedTier={selectedTier}
          onSelectTier={setSelectedTier}
        />

        {/* Card Container */}
        <div style={{
          background: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '16px',
          padding: '36px',
          border: isGrowthTier ? '2px solid #1E3A8A' : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB'),
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          {submittedRef ? (
            <PartnerFormSuccess
              submittedRef={submittedRef}
              selectedTier={selectedTier}
              onReset={resetForm}
            />
          ) : isGrowthTier ? (
            <GrowthPartnerForm
              formData={formData}
              refCodeFromUrl={refCodeFromUrl}
              submitting={submitting}
              validationError={validationError}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
            />
          ) : (
            <StandardLeadForm
              formData={formData}
              refCodeFromUrl={refCodeFromUrl}
              selectedTier={selectedTier}
              submitting={submitting}
              validationError={validationError}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
            />
          )}
        </div>
      </div>
    </section>
  );
}
