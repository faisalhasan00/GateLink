import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';

export default function InteriorsNavbar({ onOpenConsultation }) {
  return (
    <header className="interiors-nav">
      <div className="interiors-nav-container">
        {/* Logo */}
        <Link to="/interiors" className="interiors-nav-logo">
          <span className="interiors-logo-text">GateLink</span>
          <span className="interiors-logo-sub">Interiors</span>
        </Link>

        {/* Links */}
        <ul className="interiors-nav-links">
          <li>
            <a href="#estimator" className="interiors-nav-link">Cost Calculator</a>
          </li>
          <li>
            <a href="#lookbook" className="interiors-nav-link">Design Lookbook</a>
          </li>
          <li>
            <a href="#why-us" className="interiors-nav-link">Society Advantage</a>
          </li>
          <li>
            <a href="#process" className="interiors-nav-link">How It Works</a>
          </li>
          <li>
            <a href="#faq" className="interiors-nav-link">FAQs</a>
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
            className="interiors-phone-link"
          >
            <PhoneCall size={16} color="#E25B38" />
            <span>+91 91218 63117</span>
          </a>

          <button
            onClick={onOpenConsultation}
            className="interiors-btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Sparkles size={16} />
            <span>Get Free Quote</span>
          </button>
        </div>
      </div>
    </header>
  );
}
