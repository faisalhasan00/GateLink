import React, { useState } from 'react';
import { 
  Building2, X 
} from 'lucide-react';
import { writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  validateStep1, generateSocietyCode 
} from '../../utils/societyValidation';
import Step1BasicInfo from '../onboarding/Step1BasicInfo';

const STEP_TITLES = [
  'Basic Information',
  'Address & Location',
  'Society Structure',
  'Occupancy Details',
  'Management & Contact',
  'Review & Confirm'
];

export default function SocietyOnboardingWizard({ isOpen, onClose, existingSocieties = [], onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [autoCodeEdited, setAutoCodeEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '', code: '', type: 'Apartment', registrationNumber: '', yearEstablished: new Date().getFullYear().toString(), mrr: '10000',
    addressLine1: '', addressLine2: '', area: '', landmark: '', city: '', state: '', country: 'India', pinCode: '', latitude: '', longitude: '', fullAddress: '',
    buildings: '', blocks: '1', floors: '10', flats: '100', villas: '0', parkingSlots: '100',
    occupiedFlats: '80', vacantFlats: '20', rentalFlats: '30', ownerOccupiedFlats: '50',
    presidentName: '', secretaryName: '', treasurerName: '', managerName: '', phone: '', email: '', password: '', emergencyContact: ''
  });

  if (!isOpen) return null;

  const validateCurrentStep = () => {
    let errs = {};
    if (currentStep === 1) errs = validateStep1(formData, existingSocieties);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const batch = writeBatch(db);
      const societyId = `SOC-${Date.now().toString().slice(-6)}`;
      const docRef = doc(db, 'societies', societyId);
      batch.set(docRef, { ...formData, id: societyId, createdAt: new Date() });
      await batch.commit();
      if (onSuccess) onSuccess(societyId);
      onClose();
    } catch (err) {
      console.error('Failed to submit onboarding:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={22} color="#1E3A8A" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Society Admin Onboarding</h3>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Step {currentStep} of 6: {STEP_TITLES[currentStep - 1]}</div>
          </div>
        </div>

        {/* Step Renderer */}
        {currentStep === 1 && (
          <Step1BasicInfo
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            autoCodeEdited={autoCodeEdited}
            setAutoCodeEdited={setAutoCodeEdited}
            generateSocietyCode={generateSocietyCode}
          />
        )}

        {currentStep > 1 && (
          <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', textAlign: 'center', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
            {STEP_TITLES[currentStep - 1]} Form Details & Validation (Step {currentStep})
          </div>
        )}

        {/* Navigation Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: currentStep === 1 ? 'not-allowed' : 'pointer', opacity: currentStep === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#1E3A8A', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#059669', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Activating Society...' : 'Confirm & Complete Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
