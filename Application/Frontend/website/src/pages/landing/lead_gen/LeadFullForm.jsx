import React from 'react';

export default function LeadFullForm({ formData, onChange, isDark }) {
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
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input
            type="email"
            placeholder="email@domain.com"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Mobile Phone *</label>
          <input
            type="tel"
            placeholder="10-Digit Mobile Phone"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Society / Building Name *</label>
          <input
            type="text"
            placeholder="e.g. Sunshine Apartments"
            value={formData.societyName}
            onChange={(e) => onChange('societyName', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>City / Location *</label>
          <input
            type="text"
            placeholder="e.g. Hyderabad, Mumbai, Dubai"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Total Flat Count</label>
          <select
            value={formData.flatCount}
            onChange={(e) => onChange('flatCount', e.target.value)}
            style={inputStyle}
          >
            <option value="Under 50">Under 50 Flats</option>
            <option value="50-100">50 - 100 Flats</option>
            <option value="100-250">100 - 250 Flats</option>
            <option value="250-500">250 - 500 Flats</option>
            <option value="500+">500+ Flats (Township)</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Specific Requirements / Notes</label>
        <textarea
          rows={3}
          placeholder="Tell us about your gate security or maintenance accounting needs..."
          value={formData.requirements}
          onChange={(e) => onChange('requirements', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
    </>
  );
}
