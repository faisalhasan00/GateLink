import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import DemoModal from './DemoModal';
import { 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Calendar, 
  PhoneCall, 
  Newspaper, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function LeadGenerationPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('demo'); // demo, register, callback, contact, newsletter

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    societyName: '',
    city: '',
    flatCount: '100-250',
    currentSoftware: 'None (Paper Registers / WhatsApp)',
    requirements: ''
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackName, setCallbackName] = useState('');

  // Status State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Validation function
  const validateForm = () => {
    if (activeFormTab === 'newsletter') {
      if (!newsletterEmail || !/\S+@\S+\.\S+/.test(newsletterEmail)) {
        setValidationError('Please enter a valid email address.');
        return false;
      }
      return true;
    }

    if (activeFormTab === 'callback') {
      if (!callbackName.trim()) {
        setValidationError('Please enter your full name.');
        return false;
      }
      if (!callbackPhone || callbackPhone.length < 10) {
        setValidationError('Please enter a valid 10-digit mobile number.');
        return false;
      }
      return true;
    }

    if (!formData.name.trim()) {
      setValidationError('Full Name is required.');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setValidationError('Valid email address is required.');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setValidationError('Valid 10-digit mobile phone is required.');
      return false;
    }
    if (!formData.societyName.trim()) {
      setValidationError('Society / Building Name is required.');
      return false;
    }
    if (!formData.city.trim()) {
      setValidationError('City / Location is required.');
      return false;
    }
    return true;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let leadPayload = {};

      if (activeFormTab === 'newsletter') {
        leadPayload = {
          email: newsletterEmail,
          source: 'Newsletter Subscription',
          status: 'Subscribed'
        };
      } else if (activeFormTab === 'callback') {
        leadPayload = {
          name: callbackName,
          phone: callbackPhone,
          source: 'Callback Request',
          status: 'New'
        };
      } else {
        leadPayload = {
          ...formData,
          source: activeFormTab === 'demo' ? 'Book Product Demo' : activeFormTab === 'register' ? 'Society Onboarding Registration' : 'Contact Support Inquiry',
          status: 'New'
        };
      }

      await addDoc(collection(db, 'leads'), {
        ...leadPayload,
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Firestore lead error:', err);
      setValidationError('Failed to submit request. Please try again or call support.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setValidationError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      societyName: '',
      city: '',
      flatCount: '100-250',
      currentSoftware: 'None (Paper Registers / WhatsApp)',
      requirements: ''
    });
    setNewsletterEmail('');
    setCallbackPhone('');
    setCallbackName('');
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dynamic SEO Head */}
      <SeoHead
        title="Contact Us & Book Demo - HomeHni Hood"
        description="Contact HomeHni Hood onboarding specialists, book a live product demo, request a callback, or register your society."
        canonicalUrl="https://societysphere.com/contact"
      />

      {/* Sticky Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '40px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', textTransform: 'uppercase', letterSpacing: '1px' }}>
            24/7 ONBOARDING & SALES HELP
          </span>
          <h1 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '10px 0 16px 0' }}>
            Get Started with HomeHni Hood Today
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
            Whether you want a live product demo, society registration, callback, or support inquiry, select your request below.
          </p>

          {/* Form Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { id: 'demo', label: 'Book Demo', icon: <Calendar size={16} /> },
              { id: 'register', label: 'Society Registration', icon: <Building size={16} /> },
              { id: 'callback', label: 'Request Callback', icon: <PhoneCall size={16} /> },
              { id: 'contact', label: 'Contact Us', icon: <MessageSquare size={16} /> },
              { id: 'newsletter', label: 'Newsletter', icon: <Newspaper size={16} /> }
            ].map((tab) => {
              const isActive = activeFormTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveFormTab(tab.id); resetForm(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '2px',
                    border: '1px solid', borderColor: isActive ? '#00B589' : (isDark ? 'rgba(255,255,255,0.1)' : '#CCCCCC'),
                    backgroundColor: isActive ? '#00B589' : 'transparent',
                    color: isActive ? '#FFFFFF' : (isDark ? '#94A3B8' : '#444444'), fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Lead Form Workspace */}
      <section style={{ padding: '60px 0 100px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '4px',
            padding: '36px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ECFDF5', border: '2px solid #00B589', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <CheckCircle2 size={36} color="#00B589" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0' }}>
                  {activeFormTab === 'newsletter' ? 'Subscription Confirmed!' : 'Request Received Successfully!'}
                </h3>
                <p style={{ color: isDark ? '#94A3B8' : '#666666', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  {activeFormTab === 'newsletter' ? 'Thank you for subscribing to HomeHni Hood insights.' : 'Our onboarding team will contact you within 2 hours with complete details.'}
                </p>
                <button
                  onClick={resetForm}
                  style={{ padding: '10px 24px', borderRadius: '2px', background: '#00B589', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Header title inside card */}
                <div style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 6px 0' }}>
                    {activeFormTab === 'demo' && 'Schedule a Live Product Demo'}
                    {activeFormTab === 'register' && 'Register Housing Society for Onboarding'}
                    {activeFormTab === 'callback' && 'Request an Instant Phone Callback'}
                    {activeFormTab === 'contact' && 'Send Us a Direct Message'}
                    {activeFormTab === 'newsletter' && 'Subscribe to RWA & Security Newsletter'}
                  </h3>
                  <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', margin: 0 }}>
                    Fill out the fields below and our team will get in touch.
                  </p>
                </div>

                {/* Validation Error Alert */}
                {validationError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 700 }}>
                    <AlertCircle size={16} />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Newsletter Form */}
                {activeFormTab === 'newsletter' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. secretary@mygatedsociety.com"
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                )}

                {/* Callback Form */}
                {activeFormTab === 'callback' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={callbackName}
                        onChange={e => setCallbackName(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Mobile Phone *</label>
                      <input
                        type="tel"
                        placeholder="10-Digit Mobile Number"
                        value={callbackPhone}
                        onChange={e => setCallbackPhone(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {/* Standard Full Lead Form (Demo, Register, Contact) */}
                {(activeFormTab === 'demo' || activeFormTab === 'register' || activeFormTab === 'contact') && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                        <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                        <input type="email" placeholder="email@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Mobile Phone *</label>
                        <input type="tel" placeholder="10-Digit Mobile Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Society / Building Name *</label>
                        <input type="text" placeholder="e.g. Sunshine Apartments" value={formData.societyName} onChange={e => setFormData({...formData, societyName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>City / Location *</label>
                        <input type="text" placeholder="e.g. Bengaluru, Mumbai, Dubai" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Total Flat Count</label>
                        <select value={formData.flatCount} onChange={e => setFormData({...formData, flatCount: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}>
                          <option value="Under 50">Under 50 Flats</option>
                          <option value="50-100">50 - 100 Flats</option>
                          <option value="100-250">100 - 250 Flats</option>
                          <option value="250-500">250 - 500 Flats</option>
                          <option value="500+">500+ Flats (Township)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Specific Requirements / Notes</label>
                      <textarea rows={3} placeholder="Tell us about your gate security or maintenance accounting needs..." value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px',
                    borderRadius: '2px',
                    backgroundColor: '#00B589',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#009E77'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00B589'}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
