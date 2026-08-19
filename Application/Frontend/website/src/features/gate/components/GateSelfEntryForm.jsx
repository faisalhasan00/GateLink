import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function GateSelfEntryForm({
  visitorType, setVisitorType,
  flatNumber, setFlatNumber,
  visitorName, setVisitorName,
  visitorPhone, setVisitorPhone,
  companyName, setCompanyName,
  submitting, onSubmit
}) {
  return (
    <form onSubmit={onSubmit} style={{
      background: '#1E293B',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          Visiting Category
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {['Delivery', 'Cab', 'Guest', 'Service'].map((type) => {
            const isSel = visitorType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setVisitorType(type)}
                style={{
                  padding: '10px 4px',
                  borderRadius: '10px',
                  border: isSel ? '2px solid #0EA5E9' : '1px solid #334155',
                  backgroundColor: isSel ? 'rgba(14, 165, 233, 0.15)' : '#0F172A',
                  color: isSel ? '#38BDF8' : '#94A3B8',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          Flat / Wing Number *
        </label>
        <input
          type="text"
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
          placeholder="e.g. A-402 or B-101"
          required
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #334155',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            fontSize: '15px',
            fontWeight: 800
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          Your Full Name *
        </label>
        <input
          type="text"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          placeholder="e.g. Amit Sharma"
          required
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #334155',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            fontSize: '14px',
            fontWeight: 700
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          Your Mobile Number *
        </label>
        <input
          type="tel"
          value={visitorPhone}
          onChange={(e) => setVisitorPhone(e.target.value)}
          placeholder="e.g. 9876543210"
          required
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #334155',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            fontSize: '14px',
            fontWeight: 700
          }}
        />
      </div>

      {visitorType === 'Delivery' && (
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            Company Name (Optional)
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Zomato, Swiggy, Amazon, Blinkit"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #334155',
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              fontSize: '14px'
            }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #1E3A8A 100%)',
          color: '#FFFFFF',
          fontSize: '15px',
          fontWeight: 900,
          cursor: submitting ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '8px',
          boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)'
        }}
      >
        {submitting ? 'Sending Entry Request...' : 'Request Gate Entry Now'} <ArrowRight size={18} />
      </button>
    </form>
  );
}
