import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { superAdminService } from '../../services/superAdminService';

export default function HeroSection({ onOpenDemo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitting(true);
    try {
      await superAdminService.createLead({
        ...formData,
        source: 'Hero Quick Enrollment Form',
        status: 'New'
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="home" style={{ padding: '80px 0', background: isDark ? '#0F172A' : '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <h1>Visitor, Society and Accounting Management System</h1>
        {submitted ? (
          <div style={{ padding: '20px', background: '#ECFDF5' }}>
            <CheckCircle2 size={24} color="#059669" />
            <span>Enrollment Request Received!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input required type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" className="btn btn-primary" disabled={submitting}>Enroll</button>
          </form>
        )}
      </div>
    </section>
  );
}
