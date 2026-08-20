import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function HeroQuickEnrollForm({ isDark, isMobileScreen, onOpenDemo }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reason: 'Interested for demo'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        source: 'Hero Quick Enrollment Form',
        status: 'New',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Hero lead submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isMobileScreen) {
    return (
      <div style={{ marginBottom: '28px', width: '100%' }}>
        <button
          onClick={onOpenDemo}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0EA5E9 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 800,
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)'
          }}
        >
          <span>Get Free Demo & Price Quote</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <CheckCircle2 size={32} color="#1E3A8A" />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 900, color: '#1E3A8A' }}>Enrollment Request Received!</div>
          <div style={{ fontSize: '13px', color: '#1E40AF', marginTop: '2px' }}>
            Our onboarding team will call +91 {formData.phone} shortly.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form id="hero-enrollment-form" onSubmit={handleSubmit} style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
      {/* Row 1: Name & Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input
          required
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1.5px solid #E2E8F0',
            background: isDark ? '#1E293B' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#0F172A',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <input
          required
          type="tel"
          placeholder="Mobile (e.g. 9876543210)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1.5px solid #E2E8F0',
            background: isDark ? '#1E293B' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#0F172A',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Row 2: Reason dropdown + Submit Button */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <select
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1.5px solid #E2E8F0',
            background: isDark ? '#1E293B' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#0F172A',
            fontSize: '14px',
            outline: 'none'
          }}
        >
          <option value="Interested for demo">Interested for demo</option>
          <option value="Need pricing quotation">Need pricing quotation</option>
          <option value="Looking to onboard society">Looking to onboard society</option>
          <option value="Channel partner inquiry">Channel partner inquiry</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0EA5E9 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)'
          }}
        >
          <span>{submitting ? 'Submitting...' : 'Enrol Your Society'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
