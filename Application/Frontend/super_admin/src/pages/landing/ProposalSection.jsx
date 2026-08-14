import React, { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { superAdminService } from '../../services/superAdminService';

export default function ProposalSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', societyName: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await superAdminService.createLead({
        ...formData,
        source: 'Interactive Proposal Generator',
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
    <section id="proposal" style={{ padding: '60px 0', background: isDark ? '#0F172A' : '#FFFFFF' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <CheckCircle2 size={32} color="#00B589" />
            <h3>Proposal Requested!</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input required type="text" placeholder="Full Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input required type="tel" placeholder="Mobile Phone *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Request Proposal'}</button>
          </form>
        )}
      </div>
    </section>
  );
}
