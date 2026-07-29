import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  ArrowRight, 
  Globe, 
  CheckCircle2, 
  Apple, 
  Play, 
  Check, 
  ShieldCheck, 
  PhoneCall
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function HeroSection({ onOpenDemo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reason: 'Society Enrollment'
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        source: 'Hero Quick Enrollment Form',
        status: 'New',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Hero lead submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section 
      id="home"
      style={{
        paddingTop: '110px',
        paddingBottom: '60px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        position: 'relative',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB'
      }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
        
        {/* Left Side: Copy + Form + Badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Headline */}
          <h1 style={{
            fontSize: '44px',
            fontWeight: 900,
            color: isDark ? '#FFFFFF' : '#2C2C2C',
            letterSpacing: '-1px',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            Visitor, Society and Accounting Management System
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '16px',
            color: isDark ? '#94A3B8' : '#555555',
            lineHeight: 1.6,
            marginBottom: '12px'
          }}>
            A world-class technology to make your daily life more convenient and safe.
          </p>

          {/* Quick Enrollment Form */}
          {submitted ? (
            <div style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <CheckCircle2 size={32} color="#059669" />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#065F46' }}>Enrollment Request Received!</div>
                <div style={{ fontSize: '13px', color: '#047857', marginTop: '2px' }}>Our onboarding team will call +91 {formData.phone} shortly.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
              
              {/* Row 1: Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  required
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '4px',
                    border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC',
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#333333',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />

                <div style={{ display: 'flex', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', borderRadius: '4px', background: isDark ? '#1E293B' : '#FFFFFF', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 10px', background: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5', borderRight: '1px solid #E0E0E0', fontSize: '13px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#333333' }}>
                    <span>🇮🇳</span>
                    <span>+91 ▾</span>
                  </div>
                  <input
                    required
                    type="tel"
                    placeholder="Enter Phone No."
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 10px',
                      border: 'none',
                      background: 'transparent',
                      color: isDark ? '#FFFFFF' : '#333333',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Select Reason Dropdown & Button */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <select
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '4px',
                    border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC',
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#333333',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="Society Enrollment">Select Reason</option>
                  <option value="Society Enrollment">Society Enrollment</option>
                  <option value="Book Product Demo">Book Product Demo</option>
                  <option value="Guard App Installation">Guard App Installation</option>
                  <option value="Society Accounting Setup">Society Accounting Setup</option>
                </select>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: '4px',
                    backgroundColor: '#00B589',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
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
                  <span>{submitting ? 'Submitting...' : 'Enroll your society'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Security Certification Badges (ISO 27001 & PCI DSS) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* ISO Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              borderRadius: '4px',
              background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0'
            }}>
              <Globe size={20} color="#00B589" />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', lineHeight: 1.1 }}>ISO 27001</div>
                <div style={{ fontSize: '9px', color: isDark ? '#94A3B8' : '#666666', fontWeight: 700, textTransform: 'uppercase' }}>CERTIFIED</div>
              </div>
            </div>

            {/* PCI DSS Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              borderRadius: '4px',
              background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0'
            }}>
              <ShieldCheck size={20} color="#00B589" />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', lineHeight: 1.1 }}>PCI DSS</div>
                <div style={{ fontSize: '9px', color: isDark ? '#94A3B8' : '#666666', fontWeight: 700, textTransform: 'uppercase' }}>Level 1 CERTIFIED</div>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Right Side: Hero Vector Illustration + App Download Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
        >
          {/* Main Hero Vector Artwork */}
          <div style={{ width: '100%', maxWidth: '540px', marginBottom: '24px' }}>
            <img 
              src="/assets/hero_illustration.png" 
              alt="SocietySphere Management App Illustration" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }} 
            />
          </div>

          {/* App Download Subhead */}
          <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#333333', marginBottom: '12px' }}>
            Download SocietySphere<br />
            <span style={{ color: isDark ? '#94A3B8' : '#666666', fontWeight: 500 }}>Your Society Management App for a Convenient Life</span>
          </div>

          {/* iPhone & Android Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/download"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '4px',
                border: isDark ? '1px solid rgba(255,255,255,0.3)' : '1px solid #707070',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#333333',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              <Apple size={16} /> iPhone
            </Link>

            <Link
              to="/download"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '4px',
                border: isDark ? '1px solid rgba(255,255,255,0.3)' : '1px solid #707070',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#333333',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              <Play size={15} fill={isDark ? '#FFFFFF' : '#333333'} /> Android
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
