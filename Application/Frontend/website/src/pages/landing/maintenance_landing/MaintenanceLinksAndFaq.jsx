import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "How does maintenance billing software work for housing societies?",
    a: "Maintenance billing software automates the monthly invoicing cycle for housing societies and RWAs. Society administrators configure recurring billing rules—such as base maintenance, parking charges, water fees, and sinking funds. On the scheduled billing date, the system automatically generates itemized invoices for all flats, notifies residents via the mobile app, collects online payments, and updates the society ledger in real time."
  },
  {
    q: "Can society maintenance bills include multiple billing components?",
    a: "Yes. GateLink supports itemized billing configurations where committees can define separate line items including base maintenance charges, fixed vehicle parking fees, water consumption charges, and long-term sinking funds. Each component is clearly detailed on the resident's digital invoice and printable tax receipt."
  },
  {
    q: "How do residents pay maintenance fees online?",
    a: "Residents can review their monthly maintenance invoice in the GateLink resident app and make secure payments through the integrated Cashfree payment gateway. The app supports popular Indian payment methods including UPI apps (Google Pay, PhonePe, Paytm), Debit and Credit Cards, and Net Banking. Payment confirmation is recorded instantly."
  },
  {
    q: "Can societies record offline payments such as cheques or NEFT transfers?",
    a: "Yes. For residents who pay via bank NEFT transfer, RTGS, cheque, or direct deposit, residents can submit their transaction reference (UTR) number through the app. Society administrators and treasurers can review the submitted payment details in the admin dashboard, verify the bank credit, and approve the offline payment record to issue an official receipt."
  },
  {
    q: "How does GateLink track overdue maintenance dues and defaulters?",
    a: "GateLink maintains a real-time status tracker for all society flats categorized by paid, unpaid, and overdue records. The administrative dashboard displays cumulative outstanding balances, identifies pending flats past the due date, computes configured late penalty fees, and allows administrators to review defaulter records for committee review."
  }
];

export default function MaintenanceLinksAndFaq({ isDark }) {
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
            Learn how GateLink connects financial maintenance billing with comprehensive society management and gate security.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Link to="/society-management-software" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#10B981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>complete society management software for housing societies</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/visitor-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#10B981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>visitor management and gate pass system</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/security-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#10B981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>apartment security and guard management</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/features" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#10B981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>explore GateLink billing and platform features</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <HelpCircle size={16} /> Frequently Asked Questions
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Common questions about GateLink maintenance billing and accounting software for housing societies.
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
                    color="#10B981" 
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
      <section style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #064E3B 100%)' : 'linear-gradient(135deg, #064E3B 0%, #0F172A 100%)', padding: '48px 32px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', marginBottom: '12px' }}>
          Modernize Your Society's Maintenance &amp; Billing
        </h2>
        <p style={{ fontSize: '15px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
          Automate recurring invoice generation, collect digital maintenance payments via Cashfree, and maintain transparent financial records with GateLink.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/contact" 
            style={{ padding: '14px 28px', borderRadius: '12px', background: '#10B981', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)' }}
          >
            <span>schedule a live maintenance billing demo</span>
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
