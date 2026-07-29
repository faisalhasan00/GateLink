import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { X, CheckCircle2, Send, Sparkles } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
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
        source: 'Landing Page Modal',
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
        backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
        zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <CheckCircle2 size={48} color="#34D399" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'white' }}>Demo Scheduled!</h3>
              <p style={{ color: '#94A3B8', fontSize: '13px', marginTop: '8px' }}>Our technical team will call you within 2 hours to walk through SocietySphere.</p>
              <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '10px', background: '#4F46E5', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818CF8', fontSize: '12px', fontWeight: 800 }}>
                <Sparkles size={14} /> FREE 1-ON-1 DEMO
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'white', margin: 0 }}>Schedule a Custom Demo</h3>
              
              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Your Name *</label>
                <input required type="text" placeholder="Rajesh Kumar" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Mobile Phone *</label>
                <input required type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address *</label>
                <input required type="email" placeholder="admin@society.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Society / Building Name *</label>
                <input required type="text" placeholder="Skyline Heights" value={formData.societyName} onChange={e => setFormData({...formData, societyName: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px' }} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Send size={14} />
                <span>{submitting ? 'Scheduling...' : 'Confirm Demo Booking'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
