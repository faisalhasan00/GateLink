import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Wrench, Zap } from 'lucide-react';

export default function ServicesNavbar({ onOpenBooking }) {
  return (
    <header className="services-nav">
      <div className="services-nav-container">
        {/* Logo */}
        <Link to="/services" className="services-nav-logo">
          <span className="services-logo-text">GateLink</span>
          <span className="services-logo-sub">Repairs & Services</span>
        </Link>

        {/* Links */}
        <ul className="services-nav-links">
          <li>
            <a href="#services" className="services-nav-link">All Services</a>
          </li>
          <li>
            <a href="#ratecard" className="services-nav-link">Rate Card</a>
          </li>
          <li>
            <a href="#why-us" className="services-nav-link">Gate Guarantee</a>
          </li>
          <li>
            <a href="#faq" className="services-nav-link">FAQs</a>
          </li>
        </ul>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="tel:+919121863117"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#44403C',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
            }}
          >
            <PhoneCall size={16} color="#E11D48" />
            <span>+91 91218 63117</span>
          </a>

          <button
            onClick={() => onOpenBooking && onOpenBooking()}
            className="services-btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Wrench size={16} />
            <span>Book Technician</span>
          </button>
        </div>
      </div>
    </header>
  );
}
