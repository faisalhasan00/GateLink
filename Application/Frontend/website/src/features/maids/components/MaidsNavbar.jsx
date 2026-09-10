import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PhoneCall, Zap } from 'lucide-react';

export default function MaidsNavbar({ onOpenBooking }) {
  return (
    <header className="maids-nav">
      <div className="maids-nav-container">
        {/* Logo */}
        <Link to="/maids" className="maids-nav-logo">
          <span className="maids-logo-text">GateLink</span>
          <span className="maids-logo-sub">Maids & Care</span>
        </Link>

        {/* Links */}
        <ul className="maids-nav-links">
          <li>
            <a href="#services" className="maids-nav-link">Services</a>
          </li>
          <li>
            <a href="#calculator" className="maids-nav-link">Rates & Calculator</a>
          </li>
          <li>
            <a href="#why-us" className="maids-nav-link">Verified Safety</a>
          </li>
          <li>
            <a href="#faq" className="maids-nav-link">FAQs</a>
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
            <PhoneCall size={16} color="#7C3AED" />
            <span>+91 91218 63117</span>
          </a>

          <button
            onClick={() => onOpenBooking && onOpenBooking()}
            className="maids-btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Zap size={16} />
            <span>Book in 15 Mins</span>
          </button>
        </div>
      </div>
    </header>
  );
}
