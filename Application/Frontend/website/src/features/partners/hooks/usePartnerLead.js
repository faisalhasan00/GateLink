import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submitPartnerLead } from '../services/partnerService';

export function usePartnerLead() {
  const [searchParams] = useSearchParams();
  const refCodeFromUrl = searchParams.get('ref') || searchParams.get('code') || '';

  const [formData, setFormData] = useState({
    partnerName: '',
    partnerPhone: '',
    partnerEmail: '',
    partnerCity: '',
    partnerUpi: '',
    partnerType: 'broker',
    referredByCode: refCodeFromUrl,
    targetSocietyName: '',
    targetCity: '',
    contactPerson: '',
    contactRole: 'RWA Secretary',
    contactPhone: '',
    approxFlats: '100-250',
    notes: '',
  });

  useEffect(() => {
    if (refCodeFromUrl) {
      setFormData((prev) => ({ ...prev, referredByCode: refCodeFromUrl }));
    }
  }, [refCodeFromUrl]);

  const [selectedTier, setSelectedTier] = useState('growth');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partnerName.trim()) {
      setValidationError('Please enter your Full Name.');
      return;
    }
    if (!formData.partnerPhone.trim() || formData.partnerPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.targetSocietyName.trim()) {
      setValidationError('Target Society / Building Name is required.');
      return;
    }

    setSubmitting(true);
    setValidationError('');

    try {
      const res = await submitPartnerLead({ ...formData, assignedTier: selectedTier });
      setSubmittedRef(res.referenceId);
      setFormData({
        partnerName: '',
        partnerPhone: '',
        partnerEmail: '',
        partnerCity: '',
        partnerUpi: '',
        partnerType: 'broker',
        referredByCode: refCodeFromUrl,
        targetSocietyName: '',
        targetCity: '',
        contactPerson: '',
        contactRole: 'RWA Secretary',
        contactPhone: '',
        approxFlats: '100-250',
        notes: '',
      });
    } catch (err) {
      console.error('Error submitting lead:', err);
      setValidationError('Failed to submit. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => setSubmittedRef(null);

  return {
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
  };
}
