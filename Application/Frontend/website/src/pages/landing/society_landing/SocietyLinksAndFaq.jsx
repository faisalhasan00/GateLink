import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "What is society management software and why do housing societies need it?",
    a: "Society management software is an integrated digital platform designed for apartment associations, housing societies, and Resident Welfare Associations (RWAs). It centralizes critical daily operations—such as resident directory management, online maintenance bill collections, visitor entry verification at security gates, complaint ticketing, and community broadcasts—into one cohesive system, eliminating error-prone paper logs and unorganized messaging groups."
  },
  {
    q: "How does GateLink simplify monthly maintenance bill collection?",
    a: "GateLink automates the entire maintenance cycle. Management committees can configure custom billing formulas (flat rates or area-based rates), generate itemized monthly invoices, and enable residents to pay securely online via UPI, credit/debit cards, and net banking with instant digital receipts. Treasurers gain real-time visibility into collection statuses, pending dues, and defaulter records."
  },
  {
    q: "How does GateLink secure society gates and handle visitors?",
    a: "GateLink equips security guards at the main gate with a dedicated mobile application. When guests, delivery agents, or service providers arrive, guards verify their entry via pre-approved QR passcodes or trigger real-time resident approval notifications. Residents can also pre-authorize expected visitors directly from their mobile app for zero-wait gate entry."
  },
  {
    q: "How do residents raise maintenance complaints and book society amenities?",
    a: "Residents can log maintenance complaints (such as plumbing, electrical, or general issues) directly through the resident application with photos and descriptions. The management committee can assign tickets to maintenance staff and track resolution statuses. Similarly, residents can view real-time availability and reserve society amenities like the clubhouse, party hall, or sports facilities without scheduling conflicts."
  },
  {
    q: "Who has access to the GateLink society management portal?",
    a: "GateLink features role-based access control tailored for all stakeholders in a gated community. RWA committee members and estate administrators manage accounting, directory records, and notices via the administrative dashboard; residents manage visitors, pay bills, and log requests via the resident app; and security staff operate the streamlined guard terminal at the gate."
  }
];

export default function SocietyLinksAndFaq({ isDark }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <>
      {/* Specialized Modules Cluster Navigation */}
      <section style={{ background: isDark ? '#0F172A' : '#EFF6FF', padding: '36px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #DBEAFE', marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>
            Explore Specialized Platform Capabilities
          </h2>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            Discover how each dedicated GateLink module streamlines specific areas of your apartment complex.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Link to="/visitor-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Visitor Management System</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/maintenance-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Maintenance &amp; Billing System</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/security-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Guard &amp; Security System</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/features" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>All Platform Features</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0EA5E9', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <HelpCircle size={16} /> Got Questions?
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Common questions about GateLink society management software for apartment complexes and RWAs.
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

      {/* Bottom Call to Action */}
      <section style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', padding: '48px 32px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', marginBottom: '12px' }}>
          Modernize Your Housing Society with GateLink
        </h2>
        <p style={{ fontSize: '15px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
          Join forward-thinking residential communities and management committees. Streamline dues billing, improve gate security, and foster transparent community living.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/contact" 
            style={{ padding: '14px 28px', borderRadius: '12px', background: '#0EA5E9', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)' }}
          >
            <span>Schedule a Free Demo</span>
            <ArrowRight size={18} />
          </Link>
          <Link 
            to="/features" 
            style={{ padding: '14px 28px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            Browse All Modules
          </Link>
        </div>
      </section>
    </>
  );
}
