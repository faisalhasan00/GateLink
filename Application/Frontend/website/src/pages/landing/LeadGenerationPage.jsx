import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import DemoModal from './DemoModal';
import { Send, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import LeadHeroSection from './lead_gen/LeadHeroSection';
import LeadSuccessCard from './lead_gen/LeadSuccessCard';
import LeadNewsletterForm from './lead_gen/LeadNewsletterForm';
import LeadCallbackForm from './lead_gen/LeadCallbackForm';
import LeadFullForm from './lead_gen/LeadFullForm';

const FORM_TITLES = {
  demo: 'Schedule a Live Product Demo',
  register: 'Register Housing Society for Onboarding',
  callback: 'Request an Instant Phone Callback',
  contact: 'Send Us a Direct Message',
  newsletter: 'Subscribe to RWA & Security Newsletter'
};

export default function LeadGenerationPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('demo');

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

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleFieldChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let leadPayload = {};
      if (activeFormTab === 'newsletter') {
        leadPayload = { email: newsletterEmail, source: 'Newsletter Subscription', status: 'Subscribed' };
      } else if (activeFormTab === 'callback') {
        leadPayload = { name: callbackName, phone: callbackPhone, source: 'Callback Request', status: 'New' };
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
      <SeoHead
        title="Contact Us & Book Demo - GateLink"
        description="Contact GateLink onboarding specialists, book a live product demo, request a callback, or register your society."
        canonicalUrl="https://gatelink.in/contact"
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <LeadHeroSection
        activeTab={activeFormTab}
        onSelectTab={(tabId) => { setActiveFormTab(tabId); resetForm(); }}
        isDark={isDark}
      />

      {/* Main Lead Form Workspace */}
      <section style={{ padding: '60px 0 100px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '16px',
            padding: '36px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            {submitted ? (
              <LeadSuccessCard activeFormTab={activeFormTab} onReset={resetForm} isDark={isDark} />
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 6px 0' }}>
                    {FORM_TITLES[activeFormTab]}
                  </h3>
                  <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', margin: 0 }}>
                    Fill out the fields below and our team will get in touch.
                  </p>
                </div>

                {validationError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 700 }}>
                    <AlertCircle size={16} />
                    <span>{validationError}</span>
                  </div>
                )}

                {activeFormTab === 'newsletter' && (
                  <LeadNewsletterForm email={newsletterEmail} setEmail={setNewsletterEmail} isDark={isDark} />
                )}

                {activeFormTab === 'callback' && (
                  <LeadCallbackForm name={callbackName} setName={setCallbackName} phone={callbackPhone} setPhone={setCallbackPhone} isDark={isDark} />
                )}

                {(activeFormTab === 'demo' || activeFormTab === 'register' || activeFormTab === 'contact') && (
                  <LeadFullForm formData={formData} onChange={handleFieldChange} isDark={isDark} />
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#1E3A8A',
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
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#172554')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E3A8A')}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
