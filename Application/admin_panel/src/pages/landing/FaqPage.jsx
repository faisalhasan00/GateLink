import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { Search, ChevronDown, ChevronUp, HelpCircle, Sparkles } from 'lucide-react';

export default function FaqPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = ['All', 'General', 'Security & Gate', 'Finance & Billing', 'Legal & Bylaws', 'Technical'];

  const faqs = [
    {
      category: 'General',
      q: 'What is SocietySphere?',
      a: 'SocietySphere is a complete enterprise operating system for modern gated communities and apartment complexes across India. It integrates visitor management, resident mobile approvals, guard gatekeeper apps, maintenance billing via Razorpay, amenity bookings, and RWA administrative governance into one platform.'
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
      a: 'SocietySphere automatically generates monthly maintenance bills on the 1st of every month. Residents pay online using Razorpay via UPI (GPay, PhonePe, Paytm), Credit/Debit cards, or NetBanking. Payments settle directly into the society bank account with automated GST PDF receipts.'
    },
    {
      category: 'Finance & Billing',
      q: 'Can SocietySphere export data to Tally ERP?',
      a: 'Yes! SocietySphere provides 1-click export of sanitized transaction ledgers into Tally ERP, Excel, CSV, and PDF formats for effortless annual auditing and GST tax filing.'
    },
    {
      category: 'Legal & Bylaws',
      q: 'Is SocietySphere compliant with Indian DPDP and privacy laws?',
      a: 'Yes. SocietySphere enforces strict data privacy controls. Resident and visitor records are encrypted using 256-Bit SSL TLS v1.3 encryption and hosted on AWS infrastructure located within India.'
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
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="Frequently Asked Questions (FAQ) - SocietySphere Platform"
        description="Find answers to common questions about SocietySphere visitor security, Razorpay maintenance billing, RWA bylaws compliance, and mobile app features."
        canonicalUrl="https://societysphere.com/faq"
        schemaData={faqSchema}
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <section style={{ paddingTop: '160px', paddingBottom: '50px', background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
            <HelpCircle size={14} /> FREQUENTLY ASKED QUESTIONS
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            How Can We Help You?
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '650px', margin: '0 auto 30px auto' }}>
            Search our knowledge repository for answers on security, maintenance billing, guard training, and setup.
          </p>

          <div style={{ maxWidth: '700px', margin: '0 auto', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '20px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                placeholder="Search FAQ by keyword (e.g. Razorpay, Emergency SOS, Tally)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 50px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.8)', color: '#FFFFFF', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px', borderRadius: '10px', border: '1px solid',
                    borderColor: selectedCategory === cat ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: selectedCategory === cat ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedCategory === cat ? '#FFFFFF' : '#94A3B8', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0 100px 0', background: '#020617' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredFaqs.map((f, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={f.q}
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: '#FFFFFF', fontSize: '16px' }}>
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp size={20} color="#818CF8" /> : <ChevronDown size={20} color="#94A3B8" />}
                  </div>
                  {isOpen && (
                    <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '12px', lineHeight: 1.6, margin: '12px 0 0 0' }}>
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
