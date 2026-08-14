import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Layers, Users, PhoneCall, CheckCircle2, 
  ChevronRight, ChevronLeft, X, AlertTriangle, Lock, ShieldCheck, Map
} from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';
import { 
  validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, 
  generateSocietyCode 
} from '../../utils/societyValidation';
import { sanitizePayload, checkRateLimit, generateUUID } from '../../utils/security';

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
    // Step 1
    name: '',
    code: '',
    type: 'Apartment',
    registrationNumber: '',
    yearEstablished: new Date().getFullYear().toString(),
    mrr: '10000',
    // Step 2
    addressLine1: '',
    addressLine2: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    latitude: '',
    longitude: '',
    fullAddress: '',
    // Step 3
    buildings: 'A, B, C, D',
    blockNames: 'A, B, C, D',
    blocks: '4',
    floors: '10',
    flats: '100',
    flatsPerBlock: '50',
    startFlatNumber: '101',
    villas: '0',
    parkingSlots: '100',
    // Step 4
    occupiedFlats: '80',
    vacantFlats: '20',
    rentalFlats: '30',
    ownerOccupiedFlats: '50',
    // Step 5
    presidentName: '',
    secretaryName: '',
    treasurerName: '',
    managerName: '',
    phone: '',
    email: '',
    password: '',
    emergencyContact: ''
  });

  // Auto-generate Society Code on Name change if code not manually touched
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, name: val };
      if (!autoCodeEdited && val.trim().length >= 2) {
        updated.code = generateSocietyCode(val);
      }
      return updated;
    });
    if (errors.name) setErrors(prev => ({ ...prev, name: null }));
  };

  const handleInputChange = (field, value) => {
    if (field === 'code') setAutoCodeEdited(true);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  // Step validation check before proceeding
  const validateCurrentStep = (stepNumber = currentStep) => {
    let result = { isValid: true, errors: {} };
    if (stepNumber === 1) {
      result = validateStep1(formData, existingSocieties);
    } else if (stepNumber === 2) {
      result = validateStep2(formData);
    } else if (stepNumber === 3) {
      result = validateStep3(formData);
    } else if (stepNumber === 4) {
      result = validateStep4(formData, formData.flats);
    } else if (stepNumber === 5) {
      result = validateStep5(formData, existingSocieties);
    }
    setErrors(result.errors);
    return result.isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleJumpToStep = (stepNum) => {
    setErrors({});
    setCurrentStep(stepNum);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Re-validate all steps
    const v1 = validateStep1(formData, existingSocieties);
    const v2 = validateStep2(formData);
    const v3 = validateStep3(formData);
    const v4 = validateStep4(formData, formData.flats);
    const v5 = validateStep5(formData, existingSocieties);

    if (!v1.isValid || !v2.isValid || !v3.isValid || !v4.isValid || !v5.isValid) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    // Rate limiting check
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      alert(rateCheck.message);
      return;
    }

    setSubmitting(true);

    try {
      const cleanData = sanitizePayload(formData);
      const res = await superAdminService.onboardSocietyBatch(cleanData);
      setSubmitting(false);

      if (onSuccess) {
        onSuccess(res);
      }
    } catch (error) {
      console.error("Batch onboarding error:", error);
      alert("Database error onboarding society: " + error.message);
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ width: '800px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}
      >
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={22} color="var(--primary)" />
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Onboard New Society</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Enterprise multi-step society setup & credential provisioning
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} disabled={submitting}>
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div style={{ padding: '16px 28px', background: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            {STEP_TITLES.map((title, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              return (
                <div 
                  key={stepNum} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: isCompleted ? 'pointer' : 'default' }}
                  onClick={() => isCompleted && handleJumpToStep(stepNum)}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                    background: isCompleted ? 'var(--secondary)' : (isActive ? 'var(--primary)' : '#E2E8F0'),
                    color: (isCompleted || isActive) ? '#FFF' : 'var(--text-secondary)'
                  }}>
                    {isCompleted ? <CheckCircle2 size={14} /> : stepNum}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--text-secondary)', display: idx > 2 ? 'none' : 'inline' }}>
                    {title}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${(currentStep / 6) * 100}%`, 
              height: '100%', 
              background: 'var(--primary)', 
              transition: 'width 0.3s ease' 
            }} />
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px 28px' }}>

          {/* STEP 1: Basic Society Info */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Step 1: Basic Society Information
              </h3>

              <div className="form-group">
                <label>Society Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. HomeHni Residency"
                  style={{ borderColor: errors.name ? 'var(--danger)' : undefined }}
                />
                {errors.name && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Society Code (Auto-generated) *</label>
                  <input
                    required
                    type="text"
                    value={formData.code}
                    onChange={e => handleInputChange('code', e.target.value.toUpperCase())}
                    placeholder="e.g. GCN125"
                    style={{ fontFamily: 'monospace', fontWeight: 700, borderColor: errors.code ? 'var(--danger)' : undefined }}
                  />
                  {errors.code && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.code}</span>}
                </div>

                <div className="form-group">
                  <label>Society Type *</label>
                  <select 
                    value={formData.type} 
                    onChange={e => handleInputChange('type', e.target.value)}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Gated Community">Gated Community</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Mixed Use">Mixed Use</option>
                  </select>
                  {errors.type && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.type}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Registration Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={e => handleInputChange('registrationNumber', e.target.value)}
                    placeholder="e.g. REG-MUM-2024-998"
                  />
                  {errors.registrationNumber && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.registrationNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Year Established</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.yearEstablished}
                    onChange={e => handleInputChange('yearEstablished', e.target.value)}
                    placeholder="2020"
                  />
                  {errors.yearEstablished && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.yearEstablished}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Address & Location */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Step 2: Address & Geographic Location
              </h3>

              <div className="form-group">
                <label>Address Line 1 *</label>
                <input
                  required
                  type="text"
                  value={formData.addressLine1}
                  onChange={e => handleInputChange('addressLine1', e.target.value)}
                  placeholder="Plot No. 42, Sector 15"
                  style={{ borderColor: errors.addressLine1 ? 'var(--danger)' : undefined }}
                />
                {errors.addressLine1 && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.addressLine1}</span>}
              </div>

              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={e => handleInputChange('addressLine2', e.target.value)}
                  placeholder="Near City Park"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Area / Locality *</label>
                  <input
                    required
                    type="text"
                    value={formData.area}
                    onChange={e => handleInputChange('area', e.target.value)}
                    placeholder="Powai"
                    style={{ borderColor: errors.area ? 'var(--danger)' : undefined }}
                  />
                  {errors.area && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.area}</span>}
                </div>

                <div className="form-group">
                  <label>Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={e => handleInputChange('landmark', e.target.value)}
                    placeholder="Opposite Hiranandani Hospital"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    placeholder="Mumbai"
                    style={{ borderColor: errors.city ? 'var(--danger)' : undefined }}
                  />
                  {errors.city && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    required
                    type="text"
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    placeholder="Maharashtra"
                    style={{ borderColor: errors.state ? 'var(--danger)' : undefined }}
                  />
                  {errors.state && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label>PIN Code (Indian 6-digit) *</label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={e => handleInputChange('pinCode', e.target.value)}
                    placeholder="400076"
                    style={{ borderColor: errors.pinCode ? 'var(--danger)' : undefined }}
                  />
                  {errors.pinCode && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.pinCode}</span>}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Map size={14} color="var(--primary)" /> Google Maps Coordinates (Optional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Latitude (e.g. 19.1197)" 
                    value={formData.latitude} 
                    onChange={e => handleInputChange('latitude', e.target.value)} 
                    style={{ fontSize: '13px' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Longitude (e.g. 72.9051)" 
                    value={formData.longitude} 
                    onChange={e => handleInputChange('longitude', e.target.value)} 
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Society Structure */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Step 3: Physical Structure & Capacities
              </h3>

              <div className="form-group">
                <label>Building / Block Names (Comma Separated) *</label>
                <input
                  required
                  type="text"
                  value={formData.blockNames}
                  onChange={e => handleInputChange('blockNames', e.target.value)}
                  placeholder="e.g. Tower A, Tower B, Block C or A, B, C, D"
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  These block names will populate the resident registration dropdowns.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Flats per Block / Tower *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.flatsPerBlock}
                    onChange={e => handleInputChange('flatsPerBlock', e.target.value)}
                    placeholder="e.g. 50 or 100"
                  />
                </div>

                <div className="form-group">
                  <label>Starting Flat Number for Block *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.startFlatNumber}
                    onChange={e => handleInputChange('startFlatNumber', e.target.value)}
                    placeholder="e.g. 101, 309, 1001"
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    e.g. If 101, flats will start from 101 up to 101 + Flats Per Block.
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Total Blocks / Towers *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="500"
                    value={formData.blocks}
                    onChange={e => handleInputChange('blocks', e.target.value)}
                    placeholder="4"
                    style={{ borderColor: errors.blocks ? 'var(--danger)' : undefined }}
                  />
                  {errors.blocks && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.blocks}</span>}
                </div>

                <div className="form-group">
                  <label>Total Floors per Tower</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.floors}
                    onChange={e => handleInputChange('floors', e.target.value)}
                    placeholder="12"
                  />
                  {errors.floors && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.floors}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Total Flats *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.flats}
                    onChange={e => handleInputChange('flats', e.target.value)}
                    placeholder="200"
                    style={{ borderColor: errors.flats ? 'var(--danger)' : undefined }}
                  />
                  {errors.flats && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.flats}</span>}
                </div>

                <div className="form-group">
                  <label>Total Villas (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.villas}
                    onChange={e => handleInputChange('villas', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Total Parking Slots</label>
                <input
                  type="number"
                  min="0"
                  value={formData.parkingSlots}
                  onChange={e => handleInputChange('parkingSlots', e.target.value)}
                  placeholder="250"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Occupancy & Equation Validation */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Step 4: Occupancy & Live Equation Validation
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Target Total Flats: <strong style={{ color: 'var(--primary)' }}>{formData.flats || 0}</strong>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Occupied Flats</label>
                  <input
                    type="number"
                    value={formData.occupiedFlats}
                    onChange={e => handleInputChange('occupiedFlats', e.target.value)}
                  />
                  {errors.occupiedFlats && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.occupiedFlats}</span>}
                </div>

                <div className="form-group">
                  <label>Vacant Flats</label>
                  <input
                    type="number"
                    value={formData.vacantFlats}
                    onChange={e => handleInputChange('vacantFlats', e.target.value)}
                  />
                  {errors.vacantFlats && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.vacantFlats}</span>}
                </div>
              </div>

              {errors.equationOccupancy && (
                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> {errors.equationOccupancy}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Rental Flats</label>
                  <input
                    type="number"
                    value={formData.rentalFlats}
                    onChange={e => handleInputChange('rentalFlats', e.target.value)}
                  />
                  {errors.rentalFlats && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.rentalFlats}</span>}
                </div>

                <div className="form-group">
                  <label>Owner Occupied Flats</label>
                  <input
                    type="number"
                    value={formData.ownerOccupiedFlats}
                    onChange={e => handleInputChange('ownerOccupiedFlats', e.target.value)}
                  />
                  {errors.ownerOccupiedFlats && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.ownerOccupiedFlats}</span>}
                </div>
              </div>

              {errors.equationRentalOwner && (
                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> {errors.equationRentalOwner}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Management & Contact Info */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Step 5: Society Management & Contact Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>President Name</label>
                  <input
                    type="text"
                    value={formData.presidentName}
                    onChange={e => handleInputChange('presidentName', e.target.value)}
                    placeholder="Rajesh Malhotra"
                  />
                  {errors.presidentName && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.presidentName}</span>}
                </div>

                <div className="form-group">
                  <label>Secretary Name</label>
                  <input
                    type="text"
                    value={formData.secretaryName}
                    onChange={e => handleInputChange('secretaryName', e.target.value)}
                    placeholder="Anil Verma"
                  />
                  {errors.secretaryName && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.secretaryName}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Admin Login Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="admin@society.com"
                    style={{ borderColor: errors.email ? 'var(--danger)' : undefined }}
                  />
                  {errors.email && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Contact Mobile (+91) *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98201 12345"
                    style={{ borderColor: errors.phone ? 'var(--danger)' : undefined }}
                  />
                  {errors.phone && <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.phone}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Admin Password (Auto-generated if blank)</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    placeholder="Optional temporary password"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={e => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="+91 98201 99999"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review Screen */}
          {currentStep === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={28} color="var(--primary)" />
                <div>
                  <h4 style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>Review Society Onboarding Details</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Please verify all information before finalizing transaction. All entries will be sanitized and saved.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Basic Info Summary */}
                <div style={{ background: '#FFF', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px' }}>1. Basic Info</strong>
                    <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => handleJumpToStep(1)}>Edit</button>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-primary)' }}>
                    <div><strong>Name:</strong> {formData.name}</div>
                    <div><strong>Code:</strong> <code>{formData.code}</code></div>
                    <div><strong>Type:</strong> {formData.type}</div>
                    <div><strong>Reg No:</strong> {formData.registrationNumber || 'N/A'}</div>
                    <div><strong>Year Est:</strong> {formData.yearEstablished}</div>
                  </div>
                </div>

                {/* Address Summary */}
                <div style={{ background: '#FFF', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px' }}>2. Address</strong>
                    <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => handleJumpToStep(2)}>Edit</button>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>{formData.addressLine1}, {formData.area}</div>
                    <div>{formData.city}, {formData.state} - {formData.pinCode}</div>
                    <div><strong>Country:</strong> {formData.country}</div>
                  </div>
                </div>

                {/* Structure Summary */}
                <div style={{ background: '#FFF', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px' }}>3. Structure</strong>
                    <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => handleJumpToStep(3)}>Edit</button>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><strong>Blocks:</strong> {formData.blocks} | <strong>Floors:</strong> {formData.floors}</div>
                    <div><strong>Total Flats:</strong> {formData.flats}</div>
                    <div><strong>Parking Slots:</strong> {formData.parkingSlots}</div>
                  </div>
                </div>

                {/* Occupancy Summary */}
                <div style={{ background: '#FFF', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px' }}>4. Occupancy</strong>
                    <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => handleJumpToStep(4)}>Edit</button>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><strong>Occupied:</strong> {formData.occupiedFlats} | <strong>Vacant:</strong> {formData.vacantFlats}</div>
                    <div><strong>Rental:</strong> {formData.rentalFlats} | <strong>Owner:</strong> {formData.ownerOccupiedFlats}</div>
                  </div>
                </div>

                {/* Management Summary */}
                <div style={{ background: '#FFF', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px' }}>5. Committee & Contact</strong>
                    <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => handleJumpToStep(5)}>Edit</button>
                  </div>
                  <div style={{ fontSize: '13px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><strong>President:</strong> {formData.presidentName || 'N/A'}</div>
                    <div><strong>Secretary:</strong> {formData.secretaryName || 'N/A'}</div>
                    <div><strong>Admin Email:</strong> <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{formData.email}</span></div>
                    <div><strong>Phone:</strong> {formData.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleBack}
            disabled={currentStep === 1 || submitting}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--secondary)' }}
            >
              {submitting ? 'Provisioning...' : 'Confirm & Create Society 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
