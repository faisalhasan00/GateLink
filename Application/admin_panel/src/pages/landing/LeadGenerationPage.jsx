import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import { 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Sparkles, 
  Calendar, 
  PhoneCall, 
  Newspaper, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function LeadGenerationPage() {
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
          source: 'Newsletter Signup',
          status: 'New',
          createdAt: serverTimestamp()
        };
      } else if (activeFormTab === 'callback') {
        leadPayload = {
          name: callbackName,
          phone: callbackPhone,
          source: 'Request Callback Form',
          status: 'New',
          createdAt: serverTimestamp()
        };
      } else {
        leadPayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          societyName: formData.societyName,
          city: formData.city,
          flatCount: formData.flatCount,
          currentSoftware: formData.currentSoftware,
          requirements: formData.requirements,
          source: activeFormTab === 'demo' ? 'Book Demo Form' : activeFormTab === 'register' ? 'Society Registration Form' : 'General Contact Form',
          status: 'New',
          createdAt: serverTimestamp()
        };
      }

      await addDoc(collection(db, 'leads'), leadPayload);

      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      setValidationError('Failed to submit request. Please try calling us directly.');
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
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Sticky Navbar */}
      <Navbar onOpenDemo={() => { setActiveFormTab('demo'); window.scrollTo({ top: 300, behavior: 'smooth' }); }} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '50px',
        background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
              <Sparkles size={14} /> 24/7 ONBOARDING & SALES HELP
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
              Get Started with SocietySphere Today
            </h1>
            <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '720px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
              Whether you want a live demo, society registration, callback, or newsletter, select your request below.
            </p>

            {/* Form Switcher Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setActiveFormTab('demo'); resetForm(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '14px',
                  border: '1px solid', borderColor: activeFormTab === 'demo' ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: activeFormTab === 'demo' ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                  color: activeFormTab === 'demo' ? '#FFFFFF' : '#94A3B8', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                }}
              >
                <Calendar size={16} /> Book Demo
              </button>

              <button
                onClick={() => { setActiveFormTab('register'); resetForm(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '14px',
                  border: '1px solid', borderColor: activeFormTab === 'register' ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: activeFormTab === 'register' ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                  color: activeFormTab === 'register' ? '#FFFFFF' : '#94A3B8', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                }}
              >
                <Building size={16} /> Society Registration
              </button>

              <button
                onClick={() => { setActiveFormTab('callback'); resetForm(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '14px',
                  border: '1px solid', borderColor: activeFormTab === 'callback' ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: activeFormTab === 'callback' ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                  color: activeFormTab === 'callback' ? '#FFFFFF' : '#94A3B8', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                }}
              >
                <PhoneCall size={16} /> Request Callback
              </button>

              <button
                onClick={() => { setActiveFormTab('contact'); resetForm(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '14px',
                  border: '1px solid', borderColor: activeFormTab === 'contact' ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: activeFormTab === 'contact' ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                  color: activeFormTab === 'contact' ? '#FFFFFF' : '#94A3B8', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                }}
              >
                <MessageSquare size={16} /> Contact Us
              </button>

              <button
                onClick={() => { setActiveFormTab('newsletter'); resetForm(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '14px',
                  border: '1px solid', borderColor: activeFormTab === 'newsletter' ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: activeFormTab === 'newsletter' ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                  color: activeFormTab === 'newsletter' ? '#FFFFFF' : '#94A3B8', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                }}
              >
                <Newspaper size={16} /> Newsletter
              </button>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Main Lead Form Workspace */}
      <section style={{ padding: '50px 0 100px 0', background: '#020617' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          
          <motion.div
            key={activeFormTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
            }}
          >
            {submitted ? (
              /* Success Celebration Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '40px 20px' }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '2px solid #10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
                }}>
                  <CheckCircle2 size={44} color="#34D399" />
                </div>
                
                <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0' }}>
                  {activeFormTab === 'newsletter' ? 'Subscribed Successfully!' : 'Request Received Successfully!'}
                </h3>
                
                <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 30px auto' }}>
                  {activeFormTab === 'newsletter' 
                    ? 'Thank you for subscribing to SocietySphere Insights! You will receive our monthly society management guides.' 
                    : 'Thank you! Our society onboarding manager will contact you within 2 hours to confirm your request.'}
                </p>

                <button
                  onClick={resetForm}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    background: '#4F46E5',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              /* Active Form Inputs */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                    {activeFormTab === 'demo' && 'Schedule 1-on-1 Society Demo'}
                    {activeFormTab === 'register' && 'Register Housing Society'}
                    {activeFormTab === 'callback' && 'Request 30-Second Callback'}
                    {activeFormTab === 'contact' && 'Contact Sales & Technical Support'}
                    {activeFormTab === 'newsletter' && 'Subscribe to SocietySphere Insights'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', margin: '4px 0 0 0' }}>
                    All data is securely saved to Firebase and encrypted with bank-grade 256-Bit SSL.
                  </p>
                </div>

                {validationError && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #EF4444',
                    color: '#FCA5A5',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Form Case 1: Newsletter */}
                {activeFormTab === 'newsletter' && (
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="admin@society.com"
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                    />
                  </div>
                )}

                {/* Form Case 2: Request Callback */}
                {activeFormTab === 'callback' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Your Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Rajesh Kumar"
                        value={callbackName}
                        onChange={e => setCallbackName(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Mobile Phone Number *</label>
                      <input
                        required
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={callbackPhone}
                        onChange={e => setCallbackPhone(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {/* Form Case 3: Demo, Registration & Contact */}
                {(activeFormTab === 'demo' || activeFormTab === 'register' || activeFormTab === 'contact') && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Rajesh Kumar"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                        <input
                          required
                          type="email"
                          placeholder="admin@society.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Mobile Phone *</label>
                        <input
                          required
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Society / Building Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Skyline Heights"
                          value={formData.societyName}
                          onChange={e => setFormData({ ...formData, societyName: e.target.value })}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>City / Location *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Bengaluru"
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Total Number of Flats</label>
                        <select
                          value={formData.flatCount}
                          onChange={e => setFormData({ ...formData, flatCount: e.target.value })}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#0F172A', color: 'white', fontSize: '15px', outline: 'none' }}
                        >
                          <option value="Under 50">Under 50 Flats</option>
                          <option value="50-100">50 - 100 Flats</option>
                          <option value="100-250">100 - 250 Flats</option>
                          <option value="250-500">250 - 500 Flats</option>
                          <option value="500+">500+ Flats (Township)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Current Software Used</label>
                        <select
                          value={formData.currentSoftware}
                          onChange={e => setFormData({ ...formData, currentSoftware: e.target.value })}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#0F172A', color: 'white', fontSize: '15px', outline: 'none' }}
                        >
                          <option value="None (Paper Registers / WhatsApp)">None (Paper Registers / WhatsApp)</option>
                          <option value="MyGate">MyGate</option>
                          <option value="NoBrokerHood">NoBrokerHood</option>
                          <option value="ApartmentAdda">ApartmentAdda</option>
                          <option value="Custom Excel Software">Custom Excel Software</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Special Requirements / Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Need Tally integration & guard training"
                          value={formData.requirements}
                          onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '15px', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    marginTop: '12px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <Send size={18} />
                  <span>{submitting ? 'Submitting to Firebase...' : 'Submit Lead Request'}</span>
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
