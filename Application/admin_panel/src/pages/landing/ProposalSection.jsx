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
  Sliders,
  Check
} from 'lucide-react';

export default function ProposalSection({ onOpenDemo }) {
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
    <section id="proposal" style={{ padding: '100px 0', background: '#0F172A', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', fontSize: '13px', fontWeight: 800, marginBottom: '12px' }}>
            <FileText size={14} /> INSTANT SOCIETY ONBOARDING PROPOSAL
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', margin: '0 0 12px 0' }}>
            Get a Customized Proposal for Your Community
          </h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
            Every housing society is unique. Select your requirements below to calculate your onboarding timeline, dedicated manager setup, and trial proposal.
          </p>
        </div>

        {/* Proposal Interactive Form Container */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          
          {/* Controls Left Column */}
          <div>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <CheckCircle2 size={40} color="#34D399" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0' }}>Custom Proposal Generated!</h3>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Thank you! Your tailored onboarding proposal has been sent to our onboarding team. We will call you within 2 hours with full setup details.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '24px', padding: '10px 20px', borderRadius: '10px', background: '#4F46E5', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13px' }}
                >
                  Generate Another Proposal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Society Type & Flat Count */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Society Category</label>
                    <select
                      value={societyType}
                      onChange={e => setSocietyType(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '14px', outline: 'none' }}
                    >
                      <option value="Gated Apartment Complex">Gated Apartment Complex</option>
                      <option value="Standalone Society Building">Standalone Society Building</option>
                      <option value="Multi-Tower Township">Multi-Tower Township</option>
                      <option value="Commercial Complex">Commercial Complex</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Total Flat Count</label>
                    <select
                      value={flatCount}
                      onChange={e => setFlatCount(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '14px', outline: 'none' }}
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
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '10px' }}>Select Required Modules</label>
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
                            borderColor: isSelected ? '#6366F1' : 'rgba(255,255,255,0.1)',
                            background: isSelected ? 'rgba(79, 70, 229, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                            color: isSelected ? '#FFFFFF' : '#94A3B8',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid', borderColor: isSelected ? '#6366F1' : 'rgba(255,255,255,0.2)', background: isSelected ? '#4F46E5' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <input required type="text" placeholder="Your Full Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px', outline: 'none' }} />
                  <input required type="tel" placeholder="Mobile Phone *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px', outline: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input required type="email" placeholder="Email Address *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px', outline: 'none' }} />
                  <input required type="text" placeholder="Society Name & City *" value={formData.societyName} onChange={e => setFormData({...formData, societyName: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px', outline: 'none' }} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Generating Proposal...' : 'Request Custom Proposal'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Live Proposal Summary Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#818CF8', letterSpacing: '1px' }}>PROPOSAL ESTIMATE</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF' }}>{societyType}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 900, background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '4px 10px', borderRadius: '10px' }}>
                14-DAY TRIAL INCLUDED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Est. Setup Time:</span>
                <strong style={{ color: '#34D399' }}>24 - 48 Hours</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Dedicated Manager:</span>
                <strong style={{ color: '#FFFFFF' }}>Assigned Free</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Guard Training:</span>
                <strong style={{ color: '#FFFFFF' }}>Included (On-Site/Virtual)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Selected Modules:</span>
                <strong style={{ color: '#818CF8' }}>{selectedModules.length} Active</strong>
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
              🛡️ Zero setup fee guarantee. Full data migration from Excel/WhatsApp included.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
