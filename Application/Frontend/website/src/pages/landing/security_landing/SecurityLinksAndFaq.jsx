import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "How does security management software help apartment gate guards?",
    a: "GateLink equips security guards with a dedicated mobile and tablet application that replaces physical paper registers. Guards can scan dynamic QR codes, verify 6-digit OTP passcodes, capture visitor photos on the spot, log vehicle numbers, record exit timestamps, and conduct scheduled patrol rounds with timestamped QR checkpoint verification."
  },
  {
    q: "How does GateLink verify visitors at the gate?",
    a: "Gate guards have three verified verification paths: scanning pre-approved digital QR passes generated on the resident app, validating 6-digit numeric OTP passcodes, or performing quick on-the-spot registration by capturing the visitor's photo and details, which sends a real-time approval notification to the resident."
  },
  {
    q: "How does the guard night patrol and QR checkpoint feature work?",
    a: "Society administrators configure physical QR checkpoint tags at strategic locations across the premises (such as basements, perimeter gates, clubhouses, and rooftop access). During patrol shifts, guards scan each checkpoint tag with their mobile app. The system logs exact scan timestamps and enables guards to log incident reports with severity details for administrative review."
  },
  {
    q: "Who receives emergency SOS alerts when triggered?",
    a: "When a resident or guard triggers an emergency SOS siren from the app (categorized under Medical, Fire, Security Threat, or Lift/Accident), instant audible siren notifications are broadcast across active guard terminal devices and RWA committee dashboards with flat numbers and contact details for rapid community coordination."
  },
  {
    q: "Can GateLink synchronize security operations across multiple gates?",
    a: "Yes. GateLink uses cloud-based real-time synchronization so that all entry points—such as Main Gate, Service Gate, and Tower Checkpoints—share synchronized visitor logs. A visitor who enters through the Main Gate can be checked out at the Service Gate with updated status records visible instantly across all security terminals."
  }
];

export default function SecurityLinksAndFaq({ isDark }) {
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
            Discover how GateLink connects guard operations with comprehensive visitor management, billing, and community administration.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Link to="/visitor-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#EF4444', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>visitor management and digital gate pass system</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/society-management-software" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#EF4444', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>complete society management software for housing societies</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/maintenance-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#EF4444', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>society maintenance billing and payment management</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/features" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#EF4444', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>explore all GateLink security and society features</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <HelpCircle size={16} /> Frequently Asked Questions
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Common questions regarding GateLink apartment security management, guard operations, and gate automation.
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
                    color="#EF4444" 
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
      <section style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #450A0A 100%)' : 'linear-gradient(135deg, #450A0A 0%, #0F172A 100%)', padding: '48px 32px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', marginBottom: '12px' }}>
          Modernize Your Gated Community's Security Operations
        </h2>
        <p style={{ fontSize: '15px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
          Equip your security team with smart gatekeeper apps, QR patrol tracking, and real-time emergency SOS alerts with GateLink.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/contact" 
            style={{ padding: '14px 28px', borderRadius: '12px', background: '#EF4444', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)' }}
          >
            <span>schedule a GateLink security management demo</span>
            <ArrowRight size={18} />
          </Link>
          <Link 
            to="/features" 
            style={{ padding: '14px 28px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            Explore All Features
          </Link>
        </div>
      </section>
    </>
  );
}
