import React from 'react';

export default function LeadCallbackForm({ name, setName, phone, setPhone, isDark }) {
  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC',
    background: isDark ? '#0F172A' : '#FFFFFF',
    color: isDark ? '#FFFFFF' : '#333333',
    fontSize: '14px',
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 700,
    color: isDark ? '#CBD5E1' : '#444444',
    display: 'block',
    marginBottom: '6px'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div>
        <label style={labelStyle}>Full Name *</label>
        <input
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Mobile Phone *</label>
        <input
          type="tel"
          placeholder="10-Digit Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>
  );
}
