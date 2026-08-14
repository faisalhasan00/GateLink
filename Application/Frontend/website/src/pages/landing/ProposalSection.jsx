import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  CheckCircle2, 
  Send, 
  Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ProposalSection({ onOpenDemo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [societyType, setSocietyType] = useState('Gated Apartment Complex');
  const [flatCount, setFlatCount] = useState('100-250');
  const [selectedModules, setSelectedModules] = useState([
    'Visitor Approval Pass',
    'Guard Gatekeeper App',
    'Pay Maintenance Bill Online',
    'Emergency SOS Alert'
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    societyName: '',
    city: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const availableModules = [
    'Visitor Approval Pass',
    'Guard Gatekeeper App',
    'Pay Maintenance Bill Online',
    'Emergency SOS Alert',
    'Amenity Slot Booking',
    'Smart Parking Allocation',
    'Helper & Maid Verification',
    'Staff RBAC & Audit Logs'
  ];

  const toggleModule = (mod) => {
    if (selectedModules.includes(mod)) {
      setSelectedModules(selectedModules.filter(m => m !== mod));
    } else {
      setSelectedModules([...selectedModules, mod]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        societyType,
        flatCount,
        selectedModules,
        source: 'Interactive Proposal Generator',
        status: 'New',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Proposal submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="proposal" style={{ padding: isMobile ? '40px 0' : '80px 0', background: isDark ? '#0F172A' : '#FFFFFF', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px auto' }}>
          <h2 style={{ fontSize: isMobile ? '24px' : '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.25 }}>
            Get a Customized Onboarding Proposal
          </h2>
          <p style={{ fontSize: isMobile ? '14px' : '15px', color: isDark ? '#94A3B8' : '#555555', lineHeight: 1.6, margin: 0 }}>
            Select your society details below to generate a customized deployment plan, guard training schedule, and 14-day free trial setup.
          </p>
        </div>

        {/* Proposal Interactive Form Container */}
        <div style={{
          background: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '6px',
          padding: isMobile ? '20px 16px' : '36px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: isMobile ? '24px' : '40px',
          alignItems: 'start'
        }}>
          
          {/* Controls Left Column */}
          <div style={{ width: '100%' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#EFF6FF', border: '2px solid #1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <CheckCircle2 size={32} color="#1E3A8A" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0' }}>Proposal Requested!</h3>
                <p style={{ color: isDark ? '#94A3B8' : '#666666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Thank you! Our onboarding specialist will contact you within 2 hours with full deployment details.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{ 
                    marginTop: '20px', 
                    padding: '10px 20px', 
                    borderRadius: '12px', 
                    background: '#1E3A8A', 
                    color: 'white', 
                    fontWeight: 700, 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '13px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#172554'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
                >
                  Generate Another Proposal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* 1. Society Type & Flat Count */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Society Category</label>
                    <select
                      value={societyType}
                      onChange={e => setSocietyType(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="Gated Apartment Complex">Gated Apartment Complex</option>
                      <option value="Standalone Society Building">Standalone Society Building</option>
                      <option value="Multi-Tower Township">Multi-Tower Township</option>
                      <option value="Commercial Complex">Commercial Complex</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Total Flat Count</label>
                    <select
                      value={flatCount}
                      onChange={e => setFlatCount(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="Under 50">Under 50 Flats</option>
                      <option value="50-100">50 - 100 Flats</option>
                      <option value="100-250">100 - 250 Flats</option>
                      <option value="250-500">250 - 500 Flats</option>
                      <option value="500+">500+ Flats (Township)</option>
                    </select>
                  </div>
                </div>

                {/* 2. Select Desired Modules */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '10px' }}>Select Required Modules</label>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                    {availableModules.map((mod) => {
                      const isSelected = selectedModules.includes(mod);
                      return (
                        <div
                          key={mod}
                          onClick={() => toggleModule(mod)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: isSelected ? '#1E3A8A' : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                            background: isSelected ? (isDark ? 'rgba(30, 58, 138, 0.25)' : '#EFF6FF') : (isDark ? '#0F172A' : '#F8FAFC'),
                            color: isSelected ? (isDark ? '#FFFFFF' : '#1E3A8A') : (isDark ? '#94A3B8' : '#555555'),
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid', borderColor: isSelected ? '#1E3A8A' : '#CCCCCC', background: isSelected ? '#1E3A8A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {isSelected && <Check size={12} color="white" />}
                          </div>
                          <span>{mod}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Contact Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <input required type="text" placeholder="Your Full Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  <input required type="tel" placeholder="Mobile Phone *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <input required type="email" placeholder="Email Address *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  <input required type="text" placeholder="Society Name & City *" value={formData.societyName} onChange={e => setFormData({...formData, societyName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#1E3A8A',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxSizing: 'border-box',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#172554'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Generating Proposal...' : 'Request Onboarding Proposal'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Live Proposal Summary Card */}
          <div style={{
            background: isDark ? '#0F172A' : '#F8FAFC',
            borderRadius: '4px',
            padding: isMobile ? '20px 16px' : '28px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#0EA5E9', letterSpacing: '1px' }}>PROPOSAL SUMMARY</div>
                <div style={{ fontSize: isMobile ? '15px' : '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>{societyType}</div>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 900, background: '#EFF6FF', color: '#1E3A8A', padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                14-DAY FREE TRIAL
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: isDark ? '#E2E8F0' : '#444444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: isDark ? '#94A3B8' : '#666666' }}>Est. Deployment Time:</span>
                <strong style={{ color: '#0EA5E9', textAlign: 'right' }}>24 - 48 Hours</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: isDark ? '#94A3B8' : '#666666' }}>Dedicated Manager:</span>
                <strong style={{ color: isDark ? '#FFFFFF' : '#2C2C2C', textAlign: 'right' }}>Included Free</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: isDark ? '#94A3B8' : '#666666' }}>Guard On-Site Training:</span>
                <strong style={{ color: isDark ? '#FFFFFF' : '#2C2C2C', textAlign: 'right' }}>Included</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: isDark ? '#94A3B8' : '#666666' }}>Selected Modules:</span>
                <strong style={{ color: '#0EA5E9', textAlign: 'right' }}>{selectedModules.length} Active</strong>
              </div>
            </div>

            <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', fontSize: '12px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.5 }}>
              🛡️ Zero setup fee guarantee. Full data migration from Excel/WhatsApp included.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
