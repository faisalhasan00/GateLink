import React from 'react';
import { Calendar, Building, PhoneCall, MessageSquare, Newspaper } from 'lucide-react';

export const FORM_TABS = [
  { id: 'demo', label: 'Book Demo', icon: <Calendar size={16} /> },
  { id: 'register', label: 'Society Registration', icon: <Building size={16} /> },
  { id: 'callback', label: 'Request Callback', icon: <PhoneCall size={16} /> },
  { id: 'contact', label: 'Contact Us', icon: <MessageSquare size={16} /> },
  { id: 'newsletter', label: 'Newsletter', icon: <Newspaper size={16} /> }
];

export default function LeadHeroSection({ activeTab, onSelectTab, isDark }) {
  return (
    <section style={{
      paddingTop: '120px',
      paddingBottom: '40px',
      background: isDark ? '#0F172A' : '#FFFFFF',
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
          24/7 ONBOARDING & SALES HELP
        </span>
        <h1 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '10px 0 16px 0' }}>
          Get Started with GateLink Today
        </h1>
        <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
          Whether you want a live product demo, society registration, callback, or support inquiry, select your request below.
        </p>

        {/* Form Switcher Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {FORM_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: isActive ? '#1E3A8A' : (isDark ? 'rgba(255,255,255,0.1)' : '#CCCCCC'),
                  backgroundColor: isActive ? '#1E3A8A' : 'transparent',
                  color: isActive ? '#FFFFFF' : (isDark ? '#94A3B8' : '#444444'),
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
