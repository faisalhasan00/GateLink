import React from 'react';

export default function LeadNewsletterForm({ email, setEmail, isDark }) {
  return (
    <div>
      <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>
        Email Address *
      </label>
      <input
        type="email"
        placeholder="e.g. secretary@mygatedsociety.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '4px',
          border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC',
          background: isDark ? '#0F172A' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#333333',
          fontSize: '14px',
          outline: 'none'
        }}
      />
    </div>
  );
}
