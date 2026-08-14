import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import DemoModal from './DemoModal';
import { 
  Send, 
  CheckCircle2, 
  Building, 
  Calendar, 
  PhoneCall, 
  Newspaper, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { superAdminService } from '../../services/superAdminService';

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
        leadPayload = { ...formData, source: activeFormTab, status: 'New' };
      }

      await superAdminService.createLead(leadPayload);
      setSubmitted(true);
    } catch (err) {
      console.error('Lead error:', err);
      setValidationError('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead title="Contact Us - Super Admin" description="Contact GateLink." canonicalUrl="https://gatelink.in/contact" />
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <section style={{ paddingTop: '120px', paddingBottom: '40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          <h2>Get Started with GateLink</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={() => setActiveFormTab('demo')}>Book Demo</button>
            <button className="btn btn-outline" onClick={() => setActiveFormTab('callback')}>Callback</button>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CheckCircle2 size={36} color="#00B589" />
              <h3>Request Received Successfully!</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {validationError && <div style={{ color: 'red' }}>{validationError}</div>}
              <input type="text" placeholder="Full Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="tel" placeholder="Mobile Phone *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request'}</button>
            </form>
          )}
        </div>
      </section>
      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
