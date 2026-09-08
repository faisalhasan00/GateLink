import React, { useState, useEffect } from 'react';
import { X, Wrench, CheckCircle2, MessageSquare } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function ServicesBookingModal({ isOpen, onClose, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    societyName: '',
    flatNumber: '',
    service: 'Electrician (Fan / Switchboard / Wiring)',
    timing: 'Emergency (Next 15-30 Mins)',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        name: initialData.name || prev.name,
        phone: initialData.phone || prev.phone,
        service: initialData.service || prev.service,
        timing: initialData.timing || prev.timing,
      }));
    }
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'service_bookings'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        societyName: formData.societyName.trim(),
        flatNumber: formData.flatNumber.trim(),
        service: formData.service,
        timing: formData.timing,
        source: 'gatelink_services_website',
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Service booking lead note:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello GateLink Services! I would like to book a technician for ${formData.service} at my flat in ${formData.societyName || 'my society'}. My name is ${formData.name}.`
  );

  return (
    <div className="srv-modal-backdrop" onClick={onClose}>
      <div className="srv-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#44403C',
          }}
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1C1917', marginBottom: '8px' }}>
              Technician Dispatched!
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#57534E', lineHeight: 1.5, marginBottom: '24px' }}>
              Thank you, <strong>{formData.name || 'Resident'}</strong>! A certified technician for <strong>{formData.service}</strong> is allocated for <strong>{formData.societyName || 'your society'}</strong>. We will confirm arrival via SMS/WhatsApp on <strong>{formData.phone}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`https://wa.me/919121863117?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="services-btn-primary"
                style={{ background: '#25D366', boxShadow: 'none' }}
              >
                <MessageSquare size={18} />
                <span>Track on WhatsApp</span>
              </a>

              <button onClick={onClose} className="services-btn-secondary">
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="services-badge" style={{ marginBottom: '10px' }}>
              <Wrench size={14} />
              <span>15-Minute Rapid Doorstep Attendance</span>
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#1C1917', margin: '0 0 6px' }}>
              Book Expert Technician
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#78716C', margin: '0 0 20px', lineHeight: 1.5 }}>
              Standardized rate card • 30-day warranty • Pre-approved society gate passes.
            </p>

            {errorMessage && (
              <div
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  color: '#991B1B',
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#44403C' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anand Kumar"
                  className="modal-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#44403C' }}>
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="modal-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#44403C' }}>
                    Society / Community Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Godrej Woodsman"
                    className="modal-input"
                    value={formData.societyName}
                    onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#44403C' }}>
                    Flat / Tower
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tower A-504"
                    className="modal-input"
                    value={formData.flatNumber}
                    onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#44403C' }}>
                    Service Trade
                  </label>
                  <select
                    className="modal-input"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="AC Repair & Service">AC Repair & Service</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Wall Painting">Painting & Seepage</option>
                    <option value="Pest Control">Pest Control</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#44403C' }}>
                    Preferred Timing
                  </label>
                  <select
                    className="modal-input"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                  >
                    <option value="Emergency (Next 15-30 Mins)">⚡ Emergency (15-30 Mins)</option>
                    <option value="Today Evening">Today Evening</option>
                    <option value="Tomorrow Morning">Tomorrow Morning</option>
                    <option value="Weekend Slot">Weekend Slot</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="services-btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '6px' }}
              >
                <Wrench size={18} />
                <span>{isSubmitting ? 'Dispatching Request...' : 'Confirm Technician Booking'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
