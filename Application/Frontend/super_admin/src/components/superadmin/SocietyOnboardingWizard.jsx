import React, { useState } from 'react';
import { 
  Building2, X 
} from 'lucide-react';
import { writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, generateSocietyCode 
} from '../../utils/societyValidation';
import Step1BasicInfo from '../onboarding/Step1BasicInfo';
import { superAdminService } from '../../services/superAdminService';

const STEP_TITLES = [
  'Basic Information',
  'Address & Location',
  'Society Structure',
  'Occupancy Details',
  'Management & Contact',
  'Review & Confirm'
];

export default function SocietyOnboardingWizard({ isOpen = true, onClose, existingSocieties = [], onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [autoCodeEdited, setAutoCodeEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '', code: '', type: 'Apartment', registrationNumber: '', yearEstablished: new Date().getFullYear().toString(), mrr: '10000',
    addressLine1: '', addressLine2: '', area: 'Madhapur', landmark: '', city: 'Hyderabad', state: 'Telangana', country: 'India', pinCode: '500081', latitude: '', longitude: '', fullAddress: '',
    buildings: 'Tower A, Tower B', blocks: '2', floors: '10', flats: '100', villas: '0', parkingSlots: '100',
    occupiedFlats: '80', vacantFlats: '20', rentalFlats: '30', ownerOccupiedFlats: '50',
    presidentName: '', secretaryName: '', treasurerName: '', managerName: '', phone: '', email: '', password: '', emergencyContact: ''
  });

  if (!isOpen) return null;

  const validateCurrentStep = () => {
    let res = { isValid: true, errors: {} };
    if (currentStep === 1) {
      res = validateStep1(formData, existingSocieties);
    } else if (currentStep === 2) {
      res = validateStep2(formData);
    } else if (currentStep === 3) {
      res = validateStep3(formData);
    } else if (currentStep === 4) {
      res = validateStep4(formData, formData.flats);
    } else if (currentStep === 5) {
      res = validateStep5(formData, existingSocieties);
    }
    setErrors(res.errors || {});
    return res.isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await superAdminService.onboardSocietyBatch(formData);
      if (onSuccess) onSuccess(res);
      onClose();
    } catch (err) {
      console.error('Failed to submit onboarding:', err);
      alert('Failed to onboard society: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={22} color="#1E3A8A" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Super Admin Society Onboarding</h3>
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

        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Street Address *</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={e => handleChange('addressLine1', e.target.value)}
                placeholder="e.g. Plot 42, Hitech City Main Rd"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: errors.addressLine1 ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: '13px' }}
              />
              {errors.addressLine1 && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.addressLine1}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Area / Locality</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={e => handleChange('area', e.target.value)}
                  placeholder="e.g. Madhapur"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  placeholder="e.g. Hyderabad"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: errors.city ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => handleChange('state', e.target.value)}
                  placeholder="e.g. Telangana"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>PIN Code</label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={e => handleChange('pinCode', e.target.value)}
                  placeholder="500081"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Tower / Block Names (comma separated)</label>
              <input
                type="text"
                value={formData.buildings}
                onChange={e => handleChange('buildings', e.target.value)}
                placeholder="e.g. Tower A, Tower B, Tower C"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Total Towers</label>
                <input
                  type="number"
                  value={formData.blocks}
                  onChange={e => handleChange('blocks', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Floors per Tower</label>
                <input
                  type="number"
                  value={formData.floors}
                  onChange={e => handleChange('floors', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Total Flats</label>
                <input
                  type="number"
                  value={formData.flats}
                  onChange={e => handleChange('flats', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 800, color: '#1E3A8A' }}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Occupied Flats</label>
                <input
                  type="number"
                  value={formData.occupiedFlats}
                  onChange={e => handleChange('occupiedFlats', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Vacant Flats</label>
                <input
                  type="number"
                  value={formData.vacantFlats}
                  onChange={e => handleChange('vacantFlats', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Owner Occupied</label>
                <input
                  type="number"
                  value={formData.ownerOccupiedFlats}
                  onChange={e => handleChange('ownerOccupiedFlats', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Tenant Occupied</label>
                <input
                  type="number"
                  value={formData.rentalFlats}
                  onChange={e => handleChange('rentalFlats', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>President / Admin Name</label>
                <input
                  type="text"
                  value={formData.presidentName}
                  onChange={e => handleChange('presidentName', e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Contact Phone *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="9876543210"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: errors.phone ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: '13px' }}
                />
                {errors.phone && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.phone}</span>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Admin Login Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="admin@society.com"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: errors.email ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#1E3A8A' }}
                />
                {errors.email && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.email}</span>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Temp Password (Optional)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => handleChange('password', e.target.value)}
                  placeholder="Auto-generated if blank"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1E293B', fontWeight: 800 }}>Confirm Onboarding Summary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', color: '#475569' }}>
              <div><strong>Society Name:</strong> {formData.name || 'N/A'}</div>
              <div><strong>Society Code:</strong> <span style={{ color: '#1E3A8A', fontWeight: 800 }}>{formData.code || 'N/A'}</span></div>
              <div><strong>Type:</strong> {formData.type}</div>
              <div><strong>City:</strong> {formData.city}</div>
              <div><strong>Total Flats:</strong> {formData.flats}</div>
              <div><strong>Monthly MRR:</strong> ₹{formData.mrr}</div>
              <div><strong>Admin Email:</strong> {formData.email || 'N/A'}</div>
              <div><strong>Admin Phone:</strong> {formData.phone || 'N/A'}</div>
            </div>
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
