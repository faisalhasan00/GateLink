import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FaqSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How fast can our housing society get onboarded on GateLink?',
      a: 'Our dedicated onboarding team sets up your society database, imports flat owner rosters, configures gate rules, and trains security guards in under 24 hours.'
    },
    {
      q: 'Can security guards who are not tech-savvy use the Guard App?',
      a: 'Yes! The Guard App features a simple 1-tap multilingual interface with voice assistance and zero typing required for routine guest and delivery entries.'
    },
    {
      q: 'How does Online Maintenance Billing work?',
      a: 'Society treasurers generate automated monthly maintenance bills. Residents receive instant WhatsApp notifications with direct UPI & Card payment links and downloadable GST PDF receipts.'
    },
    {
      q: 'What happens during power outages or internet drops at the main gate?',
      a: 'The Guard App operates with offline-first support, logging all gatekeeper entry timestamps locally and syncing automatically once internet connectivity restores.'
    },
    {
      q: 'Are resident contact details and gate logs secure under India’s DPDP Act 2023?',
      a: 'Absolutely. All data is encrypted using 256-Bit SSL encryption in transit and AES-256 at rest, stored in tier-4 Indian data centers, and strictly protected under DPDP Act guidelines.'
    },
    {
      q: 'How does the Emergency SOS Panic Siren alert security guards?',
      a: 'When a resident triggers the SOS panic button on their app, loud sirens sound immediately on all active guard tablets and committee phones with live flat location details.'
    },
    {
      q: 'Can flat owners manage multiple properties or tenant approvals?',
      a: 'Yes! Owners can seamlessly switch between multiple flats, grant tenant approvals, view payment history, and generate pre-approved guest QR passes from a single smartphone app.'
    },
    {
      q: 'What support does GateLink provide after setup?',
      a: 'We offer 24/7 technical support, dedicated account management for RWA committees, on-site guard re-training, and free lifetime feature updates.'
    }
  ];

  return (
    <section style={{
      padding: '80px 0 100px 0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E7EB'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 900, color: '#00B589', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            <HelpCircle size={16} /> GOT QUESTIONS? WE HAVE ANSWERS
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '0 0 16px 0' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#666666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything you need to know about GateLink gated community security, maintenance billing, and society onboarding.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: isDark ? '#1E293B' : '#FFFFFF',
                  borderRadius: '4px',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#FFFFFF' : '#2C2C2C',
                    fontSize: '17px',
                    fontWeight: 800,
                    lineHeight: 1.4
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#00B589', fontSize: '15px', fontWeight: 900 }}>0{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    color="#00B589"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0
                    }}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div style={{
                        padding: '0 24px 22px 52px',
                        fontSize: '14px',
                        lineHeight: 1.7,
                        color: isDark ? '#94A3B8' : '#555555',
                        borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9',
                        paddingTop: '16px'
                      }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
