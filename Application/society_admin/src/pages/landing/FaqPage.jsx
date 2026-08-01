import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { Search, ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FaqPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(0);

  const categories = ['All', 'General', 'Security & Gate', 'Finance & Billing', 'Legal & Bylaws', 'Technical'];

  const faqs = [
    {
      category: 'General',
      q: 'What is HomeHni Hood?',
      a: 'HomeHni Hood is a complete enterprise operating system for modern gated communities and apartment complexes. It integrates visitor management, resident mobile approvals, guard gatekeeper apps, online maintenance billing, amenity bookings, and RWA administrative governance into one platform.'
    },
    {
      category: 'Security & Gate',
      q: 'How does the 1-Tap Visitor Approval work for residents?',
      a: 'When a guest, delivery agent, or cab arrives at the security gate, the guard enters their details on the Guard App. The resident instantly receives a push notification on their smartphone and can tap "Allow Entry" or "Deny" from their lock screen.'
    },
    {
      category: 'Security & Gate',
      q: 'What happens when a resident triggers the Emergency SOS button?',
      a: 'Tapping the SOS panic button in the Resident App instantly broadcasts loud siren alerts across all active security guard devices at the gate, sends emergency SMS alerts to designated family members, and logs the GPS location and flat number.'
    },
    {
      category: 'Finance & Billing',
      q: 'How are monthly maintenance payments processed?',
      a: 'HomeHni Hood automatically generates monthly maintenance bills on the 1st of every month. Residents pay online via UPI (GPay, PhonePe, Paytm), Credit/Debit cards, or NetBanking. Payments settle directly into the society bank account with automated GST PDF receipts.'
    },
    {
      category: 'Finance & Billing',
      q: 'Can HomeHni Hood export data to Tally ERP?',
      a: 'Yes! HomeHni Hood provides 1-click export of sanitized transaction ledgers into Tally ERP, Excel, CSV, and PDF formats for effortless annual auditing and GST tax filing.'
    },
    {
      category: 'Legal & Bylaws',
      q: 'Is HomeHni Hood compliant with Indian DPDP and privacy laws?',
      a: 'Yes. HomeHni Hood enforces strict data privacy controls. Resident and visitor records are encrypted using 256-Bit SSL TLS v1.3 encryption and hosted on secure tier-4 data centers within India.'
    },
    {
      category: 'Technical',
      q: 'Do security guards need technical training to use the Guard App?',
      a: 'No. The Guard App features a simple, multilingual user interface (English, Hindi, Kannada, Tamil, Telugu, Marathi) designed specifically for fast 5-second entry verification without complex menus.'
    }
  ];

  const filteredFaqs = faqs.filter(f => {
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchSearch = f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dynamic SEO Head */}
      <SeoHead
        title="Frequently Asked Questions (FAQ) - HomeHni Hood"
        description="Find answers to common questions about HomeHni Hood visitor security, online maintenance billing, RWA bylaws compliance, and mobile app features."
        canonicalUrl="https://societysphere.com/faq"
        schemaData={faqSchema}
      />

      {/* Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '40px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', textTransform: 'uppercase', letterSpacing: '1px' }}>
            HELP & KNOWLEDGE BASE
          </span>
          <h1 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '10px 0 16px 0' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
            Explore instant answers regarding gate security, online billing, RWA bylaws, and onboarding workflows.
          </p>

          {/* Search & Category Filter */}
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color={isDark ? '#94A3B8' : '#666666'} style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                placeholder="Search FAQs by keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 48px', borderRadius: '4px', border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #CCCCCC', background: isDark ? '#1E293B' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 18px', borderRadius: '2px', border: '1px solid',
                      borderColor: isSelected ? '#00B589' : (isDark ? 'rgba(255,255,255,0.1)' : '#CCCCCC'),
                      backgroundColor: isSelected ? '#00B589' : 'transparent',
                      color: isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#444444'), fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Accordion Container */}
      <section style={{ padding: '60px 0 100px 0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    borderRadius: '4px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 900, background: '#ECFDF5', color: '#00B589', padding: '3px 8px', borderRadius: '2px' }}>{faq.category}</span>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      color="#00B589"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isExpanded && (
                    <div style={{
                      padding: '0 24px 22px 24px',
                      fontSize: '14px',
                      lineHeight: 1.7,
                      color: isDark ? '#94A3B8' : '#555555',
                      borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9',
                      paddingTop: '16px'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
