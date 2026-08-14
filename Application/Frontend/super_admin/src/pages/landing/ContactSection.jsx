
import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';

export default function ContactSection() {
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', societyName: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await superAdminService.createLead({
        ...formData,
        source: 'Landing Page Lead Form',
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
    <section id="contact" style={{ padding: '80px 0', background: '#090D16', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <h2>Ready to modernize your housing society?</h2>
        {submitted ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <CheckCircle2 size={32} color="#34D399" />
            <h3>Request Submitted!</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <input required type="text" placeholder="Full Name *" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ padding: '12px', borderRadius: '8px' }} />
            <input required type="tel" placeholder="Phone *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '12px', borderRadius: '8px' }} />
            <button type="submit" className="btn btn-primary" disabled={submitting}>Submit Demo Request</button>
          </form>
        )}
      </div>
    </section>
  );
}
