import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Building, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ArrowRight,
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
    'Razorpay Maintenance Billing',
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

  const availableModules = [
    'Visitor Approval Pass',
    'Guard Gatekeeper App',
    'Razorpay Maintenance Billing',
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
    <section id="proposal" style={{ padding: '90px 0', background: isDark ? '#0F172A' : '#F8FAFC', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', color: '#2563EB', fontSize: '13px', fontWeight: 800, marginBottom: '12px' }}>
            <FileText size={14} /> INSTANT SOCIETY ONBOARDING PROPOSAL
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-1px', margin: '0 0 12px 0' }}>
            Get a Customized Onboarding Proposal
          </h2>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#475569', margin: 0, lineHeight: 1.6 }}>
            Select your society details below to generate a customized deployment plan, guard training schedule, and 14-day free trial setup.
          </p>
        </div>

        {/* Proposal Interactive Form Container */}
        <div style={{
          background: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '24px',
          padding: '40px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          
          {/* Controls Left Column */}
          <div>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ECFDF5', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <CheckCircle2 size={36} color="#059669" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 10px 0' }}>Proposal Requested!</h3>
                <p style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Thank you! Our onboarding specialist will contact you within 2 hours with full deployment details.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '24px', padding: '10px 20px', borderRadius: '10px', background: '#2563EB', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13px' }}
                >
                  Generate Another Proposal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Society Type & Flat Count */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#CBD5E1' : '#334155', display: 'block', marginBottom: '6px' }}>Society Category</label>
                    <select
                      value={societyType}
                      onChange={e => setSocietyType(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', background: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="Gated Apartment Complex">Gated Apartment Complex</option>
                      <option value="Standalone Society Building">Standalone Society Building</option>
                      <option value="Multi-Tower Township">Multi-Tower Township</option>
                      <option value="Commercial Complex">Commercial Complex</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#CBD5E1' : '#334155', display: 'block', marginBottom: '6px' }}>Total Flat Count</label>
                    <select
                      value={flatCount}
                      onChange={e => setFlatCount(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', background: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13px', outline: 'none' }}
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
                  <label style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#CBD5E1' : '#334155', display: 'block', marginBottom: '10px' }}>Select Required Modules</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {availableModules.map((mod) => {
                      const isSelected = selectedModules.includes(mod);
                      return (
                        <div
                          key={mod}
                          onClick={() => toggleModule(mod)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid',
                            borderColor: isSelected ? '#2563EB' : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                            background: isSelected ? (isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF') : (isDark ? '#0F172A' : '#F8FAFC'),
                            color: isSelected ? (isDark ? '#FFFFFF' : '#2563EB') : (isDark ? '#94A3B8' : '#475569'),
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid', borderColor: isSelected ? '#2563EB' : '#CBD5E1', background: isSelected ? '#2563EB' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isSelected && <Check size={12} color="white" />}
                          </div>
                          <span>{mod}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Contact Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input required type="text" placeholder="Your Full Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', background: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13px', outline: 'none' }} />
                  <input required type="tel" placeholder="Mobile Phone *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', background: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13px', outline: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input required type="email" placeholder="Email Address *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', background: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13px', outline: 'none' }} />
                  <input required type="text" placeholder="Society Name & City *" value={formData.societyName} onChange={e => setFormData({...formData, societyName: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', background: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13px', outline: 'none' }} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: '#2563EB',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
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
            borderRadius: '20px',
            padding: '32px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#2563EB', letterSpacing: '1px' }}>PROPOSAL SUMMARY</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>{societyType}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 900, background: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '10px' }}>
                14-DAY FREE TRIAL
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Est. Deployment Time:</span>
                <strong style={{ color: '#059669' }}>24 - 48 Hours</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Dedicated Onboarding Manager:</span>
                <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>Included Free</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Guard On-Site Training:</span>
                <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>Included</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Selected Modules:</span>
                <strong style={{ color: '#2563EB' }}>{selectedModules.length} Active</strong>
              </div>
            </div>

            <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', padding: '14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5 }}>
              🛡️ Zero setup fee guarantee. Full data migration from Excel/WhatsApp included.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
