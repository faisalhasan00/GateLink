import { useState } from 'react';
import { onboardSocietyByPartner } from '../services/partnerService';

export function usePartnerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [activationResult, setActivationResult] = useState(null);

  const [onboardingData, setOnboardingData] = useState({
    // Step 1: Society Info
    societyName: '',
    city: '',
    address: '',
    pincode: '',

    // Step 2: Structure & Gates
    flatCount: '150',
    wingsText: 'Wing A, Wing B, Wing C, Wing D',
    gatesCount: '2',
    guardDevicesCount: '2',

    // Step 3: Partner & RWA Secretary
    partnerName: '',
    partnerPhone: '',
    partnerEmail: '',
    partnerUpi: '',
    partnerType: 'onboarding_partner',
    rwaSecretaryName: '',
    rwaSecretaryPhone: '',
    rwaSecretaryEmail: '',
    assignedTier: 'onboarding',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOnboardingData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!onboardingData.societyName.trim() || !onboardingData.city.trim() || !onboardingData.address.trim()) {
        setValidationError('Please enter Society Name, City, and Address.');
        return;
      }
    } else if (currentStep === 2) {
      if (!onboardingData.flatCount || Number(onboardingData.flatCount) < 10) {
        setValidationError('Please enter a valid Flat Count (Min 10).');
        return;
      }
    }
    setValidationError('');
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCompleteOnboarding = async (e) => {
    e.preventDefault();
    if (!onboardingData.partnerName.trim() || !onboardingData.partnerPhone.trim() || !onboardingData.partnerUpi.trim()) {
      setValidationError('Please enter your Partner Name, Phone, and UPI ID.');
      return;
    }
    if (!onboardingData.rwaSecretaryName.trim() || !onboardingData.rwaSecretaryPhone.trim()) {
      setValidationError('Please enter RWA Secretary Name & Mobile.');
      return;
    }

    setSubmitting(true);
    setValidationError('');

    try {
      const wings = onboardingData.wingsText
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean);

      const res = await onboardSocietyByPartner({
        ...onboardingData,
        wings,
      });

      setActivationResult(res);
      setCurrentStep(4);
    } catch (err) {
      console.error('Error completing partner onboarding:', err);
      setValidationError('Failed to complete onboarding. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetOnboarding = () => {
    setCurrentStep(1);
    setActivationResult(null);
    setValidationError('');
    setOnboardingData({
      societyName: '',
      city: '',
      address: '',
      pincode: '',
      flatCount: '150',
      wingsText: 'Wing A, Wing B, Wing C, Wing D',
      gatesCount: '2',
      guardDevicesCount: '2',
      partnerName: '',
      partnerPhone: '',
      partnerEmail: '',
      partnerUpi: '',
      partnerType: 'onboarding_partner',
      rwaSecretaryName: '',
      rwaSecretaryPhone: '',
      rwaSecretaryEmail: '',
      assignedTier: 'onboarding',
    });
  };

  return {
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
  };
}
