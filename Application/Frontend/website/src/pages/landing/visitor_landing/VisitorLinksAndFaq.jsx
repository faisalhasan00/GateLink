import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "How does a visitor management system work in an apartment society?",
    a: "A visitor management system replaces manual paper logbooks with a connected mobile workflow. Residents generate pre-approved QR passcodes or receive real-time push notifications when unexpected visitors arrive. Main gate security guards use a dedicated terminal app to verify the visitor's details, scan the QR code or passcode, log entry timestamps, and record vehicle numbers before allowing entry."
  },
  {
    q: "How can residents approve or invite visitors?",
    a: "Residents can pre-create digital visitor invitations directly within the GateLink resident app by entering the guest's name, phone number, and visit date. The app generates a secure QR code and 6-digit OTP passcode that can be shared via WhatsApp. When unannounced guests arrive, the guard enters their flat number, triggering an immediate approval notification on the resident's phone."
  },
  {
    q: "How are delivery and courier staff recorded at the gate?",
    a: "Security guards use a fast-track delivery logging screen on the guard terminal. Guards select the delivery partner (such as Swiggy, Zomato, Amazon, or courier services), record the flat destination, and log the delivery personnel's details. Residents receive an automated entry alert notifying them that their package or delivery is on its way."
  },
  {
    q: "Can GateLink track domestic helpers and daily staff?",
    a: "Yes. GateLink maintains dedicated profiles for daily staff including domestic maids, drivers, cooks, and tutors. When daily staff arrive at the gate, guards verify their unique passcode or entry record. The system records real-time check-in and check-out timestamps and sends an instant notification to all associated resident flats."
  },
  {
    q: "Can visitor activity be synchronized across multiple gates?",
    a: "Yes. GateLink synchronizes visitor entry and exit data in real time across all society gates using secure cloud infrastructure. If a visitor enters through Gate 1 and exits through Gate 2, guards at all terminal locations have instant visibility into active visitor sessions, parking allocations, and exit timestamps."
  }
];

export default function VisitorLinksAndFaq({ isDark }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <>
      {/* Internal Cross-Linking Cluster */}
      <section style={{ background: isDark ? '#0F172A' : '#EFF6FF', padding: '36px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #DBEAFE', marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>
            Explore GateLink Society &amp; Security Solutions
          </h2>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            Learn how GateLink connects visitor management with comprehensive society administration and security guard operations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Link to="/security-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>apartment security and guard management</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/society-management-software" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>complete society management software</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/maintenance-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>society maintenance billing and payments</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/features" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>All Platform Capabilities</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0EA5E9', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <HelpCircle size={16} /> Frequently Asked Questions
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Common questions about GateLink visitor management system for apartment societies.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                style={{ 
                  background: isDark ? '#0F172A' : '#FFFFFF', 
                  borderRadius: '14px', 
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', 
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button 
                  onClick={() => toggleFaq(idx)} 
                  style={{ 
                    width: '100%', 
                    padding: '20px 24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    gap: '16px', 
                    background: 'transparent', 
                    border: 'none', 
                    cursor: 'pointer', 
                    textAlign: 'left' 
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                    {item.q}
                  </span>
                  <ChevronDown 
                    size={20} 
                    color="#0EA5E9" 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.2s ease', 
                      flexShrink: 0 
                    }} 
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 20px 24px', fontSize: '14px', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.7, borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9', paddingTop: '14px' }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', padding: '48px 32px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', marginBottom: '12px' }}>
          Upgrade Your Society's Visitor Management
        </h2>
        <p style={{ fontSize: '15px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
          Eliminate gate queues, verify delivery staff, and secure your apartment community with GateLink's digital gatekeeping platform.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/contact" 
            style={{ padding: '14px 28px', borderRadius: '12px', background: '#0EA5E9', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)' }}
          >
            <span>schedule a GateLink visitor management demo</span>
            <ArrowRight size={18} />
          </Link>
          <Link 
            to="/features" 
            style={{ padding: '14px 28px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            Browse All Features
          </Link>
        </div>
      </section>
    </>
  );
}
