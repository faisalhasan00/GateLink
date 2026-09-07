import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function LeadSuccessCard({ activeFormTab, onReset, isDark }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#EFF6FF',
        border: '2px solid #1E3A8A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto'
      }}>
        <CheckCircle2 size={36} color="#1E3A8A" />
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0' }}>
        {activeFormTab === 'newsletter' ? 'Subscription Confirmed!' : 'Request Received Successfully!'}
      </h3>
      <p style={{ color: isDark ? '#94A3B8' : '#666666', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
        {activeFormTab === 'newsletter'
          ? 'Thank you for subscribing to GateLink insights.'
          : 'Our onboarding team will contact you within 2 hours with complete details.'}
      </p>
      <button
        onClick={onReset}
        style={{
          padding: '10px 24px',
          borderRadius: '12px',
          background: '#1E3A8A',
          color: 'white',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#172554')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E3A8A')}
      >
        Submit Another Request
      </button>
    </div>
  );
}
