import React from 'react';
import { Send, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function PartnerLeadForm({
  formData,
  refCodeFromUrl,
  submitting,
  submittedRef,
  validationError,
  handleInputChange,
  handleFormSubmit,
  resetForm
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="lead-form" style={{ padding: '60px 0 80px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
            DIRECT REGISTRATION
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '8px 0 10px 0' }}>
            Submit a Society Lead & Partner
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', margin: 0 }}>
            Submit the society contact. Our enterprise team handles the presentation and close, and your commission is transferred automatically.
          </p>
        </div>

        <div style={{
          background: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '16px',
          padding: '36px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {submittedRef ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', border: '2px solid #1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <CheckCircle2 size={36} color="#1E3A8A" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0' }}>
                Society Lead Registered Successfully!
              </h3>
              <p style={{ color: isDark ? '#94A3B8' : '#666666', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                Your Lead Reference ID is <strong style={{ color: isDark ? '#FFFFFF' : '#2C2C2C' }}>{submittedRef}</strong>. Our enterprise team will schedule a demo with the society committee and keep you updated via WhatsApp.
              </p>
              <button
                onClick={resetForm}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  backgroundColor: '#1E3A8A',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Submit Another Society Lead
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              {/* If referred by a friend */}
              {refCodeFromUrl && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#065F46',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <Tag size={16} color="#059669" />
                  <span>Referred by Partner Code: <strong>{refCodeFromUrl.toUpperCase()}</strong> (Sub-Partner Linked)</span>
                </div>
              )}

              {validationError && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                  {validationError}
                </div>
              )}

              {/* Section 1: Partner Info */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
                  1. Partner & Payout Details (Your Information)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Full Name *</label>
                    <input
                      type="text"
                      name="partnerName"
                      value={formData.partnerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      name="partnerPhone"
                      value={formData.partnerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Email Address</label>
                    <input
                      type="email"
                      name="partnerEmail"
                      value={formData.partnerEmail}
                      onChange={handleInputChange}
                      placeholder="rahul@example.com"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your UPI ID (For Direct Payouts) *</label>
                    <input
                      type="text"
                      name="partnerUpi"
                      value={formData.partnerUpi}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@okaxis or 9876543210@paytm"
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Who Are You?</label>
                    <select
                      name="partnerType"
                      value={formData.partnerType}
                      onChange={handleInputChange}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    >
                      <option value="broker">Property Broker / Real Estate Dealer</option>
                      <option value="resident">Apartment Resident / Flat Owner</option>
                      <option value="freelancer">Freelancer / Social Media Creator</option>
                      <option value="agency">Security / Facility Agency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your City</label>
                    <input
                      type="text"
                      name="partnerCity"
                      value={formData.partnerCity}
                      onChange={handleInputChange}
                      placeholder="e.g. Hyderabad / Farooqnagar"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Target Society */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
                  2. Target Society / Apartment Information
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Society / Apartment Name *</label>
                    <input
                      type="text"
                      name="targetSocietyName"
                      value={formData.targetSocietyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Green Valley Residency"
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Society City / Location</label>
                    <input
                      type="text"
                      name="targetCity"
                      value={formData.targetCity}
                      onChange={handleInputChange}
                      placeholder="e.g. Farooqnagar / Gachibowli"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Contact Person Name</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="e.g. Mr. K. Rao"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Contact Person Role</label>
                    <select
                      name="contactRole"
                      value={formData.contactRole}
                      onChange={handleInputChange}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    >
                      <option value="RWA Secretary">RWA Secretary</option>
                      <option value="RWA President">RWA President</option>
                      <option value="Treasurer">RWA Treasurer / Committee</option>
                      <option value="Builder / Developer">Builder / Developer</option>
                      <option value="Resident Friend">Resident Friend living there</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Contact Phone Number</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9845011223"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Approximate Flats</label>
                    <select
                      name="approxFlats"
                      value={formData.approxFlats}
                      onChange={handleInputChange}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                    >
                      <option value="50-100">50 - 100 Flats</option>
                      <option value="100-250">100 - 250 Flats</option>
                      <option value="250-500">250 - 500 Flats</option>
                      <option value="500+">500+ Large Township</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666' }}>
                  🔒 Direct payout guarantee. We never share partner contact info.
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '12px 32px',
                    borderRadius: '12px',
                    backgroundColor: '#1E3A8A',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={15} />
                  <span>{submitting ? 'Submitting Lead...' : 'Submit Society Lead'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
