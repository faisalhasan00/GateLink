import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { X, CheckCircle2, Send } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DemoModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', societyName: '', city: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        source: 'Enroll Society Modal',
        status: 'New',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Modal lead submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
        zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '4px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: isDark ? '#FFFFFF' : '#333333', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#EFF6FF', border: '2px solid #1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={32} color="#1E3A8A" />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 8px 0' }}>Request Received!</h3>
              <p style={{ color: isDark ? '#94A3B8' : '#666666', fontSize: '14px', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                Our onboarding team will contact you within 2 hours with full details.
              </p>
              <button 
                onClick={onClose} 
                style={{ 
                  padding: '10px 24px', 
                  borderRadius: '12px', 
                  background: '#1E3A8A', 
                  color: 'white', 
                  fontWeight: 700, 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '14px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#172554'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9', paddingBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, background: '#EFF6FF', color: '#1E3A8A', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  24-HOUR SOCIETY ONBOARDING
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '8px 0 0 0' }}>
                  Enroll Your Society
                </h3>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#444444', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Your Full Name *</label>
                <input required type="text" placeholder="e.g. Rajesh Kumar" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#444444', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Mobile Phone *</label>
                <input required type="tel" placeholder="10-Digit Mobile Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#444444', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address *</label>
                <input required type="email" placeholder="admin@society.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#444444', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Society / Building Name *</label>
                <input required type="text" placeholder="Skyline Heights" value={formData.societyName} onChange={e => setFormData({...formData, societyName: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '13px', outline: 'none' }} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: '8px',
                  padding: '12px',
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
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#172554'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
              >
                <Send size={15} />
                <span>{submitting ? 'Submitting...' : 'Submit Enrollment Request'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
