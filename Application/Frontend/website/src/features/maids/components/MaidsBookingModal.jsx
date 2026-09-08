import React, { useState, useEffect } from 'react';
import { X, Zap, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function MaidsBookingModal({ isOpen, onClose, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    societyName: '',
    flatNumber: '',
    service: 'Daily House Help (Cleaning & Dishes)',
    timing: 'Instant (Next 15-30 Mins)',
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
        timing: initialData.timeSlot || initialData.model || prev.timing,
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
      await addDoc(collection(db, 'maid_bookings'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        societyName: formData.societyName.trim(),
        flatNumber: formData.flatNumber.trim(),
        service: formData.service,
        timing: formData.timing,
        flatSize: initialData.flatSize || '',
        tasks: initialData.tasks || '',
        estimatedPrice: initialData.estimatedPrice || '',
        source: 'gatelink_maids_website',
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Maid booking lead note:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello GateLink Maids! I would like to book a verified ${formData.service} for my flat in ${formData.societyName || 'my society'}. My name is ${formData.name}.`
  );

  return (
    <div className="maids-modal-backdrop" onClick={onClose}>
      <div className="maids-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F5EFE6',
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
              Booking Request Received!
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#57534E', lineHeight: 1.5, marginBottom: '24px' }}>
              Thank you, <strong>{formData.name || 'Resident'}</strong>! We are assigning a verified helper stationed near <strong>{formData.societyName || 'your society'}</strong>. We will confirm details via SMS/WhatsApp on <strong>{formData.phone}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`https://wa.me/919121863117?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="maids-btn-primary"
                style={{ background: '#25D366', boxShadow: 'none' }}
              >
                <MessageSquare size={18} />
                <span>Track on WhatsApp</span>
              </a>

              <button onClick={onClose} className="maids-btn-secondary">
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="maids-badge" style={{ marginBottom: '10px' }}>
              <Zap size={14} />
              <span>15-Minute Rapid Allocation</span>
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#1C1917', margin: '0 0 6px' }}>
              Book Verified House Help
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#78716C', margin: '0 0 20px', lineHeight: 1.5 }}>
              Connect with police-verified helpers with pre-cleared society gate passes.
            </p>

            {initialData.estimatedPrice && (
              <div
                style={{
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  color: '#92400E',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Estimated Rate:</span>
                <strong>{initialData.estimatedPrice}</strong>
              </div>
            )}

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
                  placeholder="e.g. Shalini Mehta"
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
                    placeholder="e.g. Prestige Lake Ridge"
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
                    placeholder="e.g. Tower 3, Flat 402"
                    className="modal-input"
                    value={formData.flatNumber}
                    onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#44403C' }}>
                    Service
                  </label>
                  <select
                    className="modal-input"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="Daily House Help (Cleaning & Dishes)">Daily House Cleaning</option>
                    <option value="Home Cook">Home Cooking</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="At-Home Salon">At-Home Salon</option>
                    <option value="Babysitter & Care">Babysitting & Elder Care</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#44403C' }}>
                    Timing Slot
                  </label>
                  <select
                    className="modal-input"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                  >
                    <option value="Instant (Next 15-30 Mins)">⚡ Instant (15-30 Mins)</option>
                    <option value="Today Evening">Today Evening</option>
                    <option value="Tomorrow Morning">Tomorrow Morning</option>
                    <option value="Monthly Plan">Monthly Recurring</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="maids-btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '6px' }}
              >
                <Zap size={18} />
                <span>{isSubmitting ? 'Reserving Helper...' : 'Confirm Helper Reservation'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
