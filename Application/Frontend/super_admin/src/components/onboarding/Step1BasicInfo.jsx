import React from 'react';

export default function Step1BasicInfo({ formData, setFormData, errors, autoCodeEdited, setAutoCodeEdited, generateSocietyCode }) {
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!autoCodeEdited && val.trim().length >= 2) {
        updated.code = generateSocietyCode(val);
      }
      return updated;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
          Society / Gated Community Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="e.g. Palm Meadows Residency"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px',
            borderRadius: '8px',
            border: errors.name ? '1px solid #EF4444' : '1px solid #CBD5E1',
            fontSize: '14px',
            fontWeight: 700,
          }}
        />
        {errors.name && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '2px', display: 'block' }}>{errors.name}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            Unique Society Code *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => {
              setAutoCodeEdited(true);
              setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }));
            }}
            placeholder="PALM01"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '8px',
              border: errors.code ? '1px solid #EF4444' : '1px solid #CBD5E1',
              fontSize: '13px',
              fontWeight: 800,
              color: '#1E3A8A',
            }}
          />
          {errors.code && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '2px', display: 'block' }}>{errors.code}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            Property Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
            }}
          >
            <option value="Apartment">Apartment Complex</option>
            <option value="Villa">Villa Gated Community</option>
            <option value="Mixed">Mixed (Flats & Villas)</option>
            <option value="Commercial">Commercial / Tech Park</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            RWA Reg. Number
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
            placeholder="e.g. REG/2021/8492"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            Monthly Plan Bill (₹)
          </label>
          <input
            type="number"
            value={formData.mrr}
            onChange={(e) => setFormData((prev) => ({ ...prev, mrr: e.target.value }))}
            placeholder="5000"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              fontWeight: 700,
              color: '#059669',
            }}
          />
        </div>
      </div>
    </div>
  );
}
