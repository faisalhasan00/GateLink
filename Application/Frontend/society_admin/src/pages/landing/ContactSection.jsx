import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { societyAdminService } from '../../services/societyAdminService';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    societyName: '',
    flatCount: '100-250',
    city: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await societyAdminService.createLead({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        societyName: formData.societyName,
        flatCount: formData.flatCount,
        city: formData.city,
        message: formData.message,
        source: 'Landing Page Lead Form',
        status: 'New'
      });

      setSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        societyName: '',
        flatCount: '100-250',
        city: '',
        message: ''
      });
    } catch (err) {
      console.error('Lead submit error:', err);
      setError('Unable to send message right now. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{ padding: '100px 0', background: '#090D16', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '12px', fontWeight: 800, marginBottom: '16px' }}>
              <Sparkles size={14} /> GET IN TOUCH
            </div>

            <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', marginBottom: '20px', lineHeight: 1.1 }}>
              Ready to modernize your housing society?
            </h2>

            <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '40px' }}>
              Speak with our society onboarding team today. We provide full on-site setup, guard training, and committee data migration.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(79, 70, 229, 0.15)', border: '1px solid rgba(79, 70, 229, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} color="#818CF8" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>CALL OR WHATSAPP</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>+91 98765 43210</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} color="#34D399" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>EMAIL SALES</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>sales@societysphere.com</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} color="#C084FC" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>HEADQUARTERS</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>Bengaluru • Mumbai • Delhi NCR</div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderRadius: '24px',
              padding: '36px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <CheckCircle2 size={36} color="#34D399" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0' }}>Request Submitted!</h3>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Thank you! Our society onboarding manager will get in touch within 2 hours to arrange a live demo and proposal.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: '24px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '13px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer'
                  }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>Request Free Live Demo</h3>
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                    <input required type="text" placeholder="e.g. Rajesh Kumar" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Mobile Number *</label>
                    <input required type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                    <input required type="email" placeholder="admin@society.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Society Name *</label>
                    <input required type="text" placeholder="e.g. Skyline Towers" value={formData.societyName} onChange={e => setFormData({...formData, societyName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>Total Flat Count</label>
                    <select value={formData.flatCount} onChange={e => setFormData({...formData, flatCount: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#0F172A', color: 'white', fontSize: '14px', outline: 'none' }}>
                      <option value="Under 50">Under 50 Flats</option>
                      <option value="50-100">50 - 100 Flats</option>
                      <option value="100-250">100 - 250 Flats</option>
                      <option value="250-500">250 - 500 Flats</option>
                      <option value="500+">500+ Flats (Township)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>City / Location *</label>
                    <input required type="text" placeholder="e.g. Bengaluru" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    marginTop: '8px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : 'Submit Demo Request'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
