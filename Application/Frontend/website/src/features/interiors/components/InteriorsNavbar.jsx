import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';
import logo from "../../../assets/Interior/in_logo_cropped.png";

export default function InteriorsNavbar({ onOpenConsultation }) {
  const [imgError, setImgError] = useState(false);
  return (
    <header className="interiors-nav">
      <div className="interiors-nav-container">
        {/* Logo */}
        <Link to="/interiors" className="interiors-nav-logo">
          {!imgError ? (
            <img 
              src={logo} 
              alt="GateLink Interiors" 
              className="interiors-logo-image" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="interiors-logo-fallback">
              <span className="interiors-logo-text">GateLink</span>
              <span className="interiors-logo-sub">INTERIORS</span>
            </div>
          )}
        </Link>

        {/* Actions */}
        <div className="interiors-nav-actions">
          <a
            href="tel:+919121863117"
            className="interiors-phone-link"
          >
            <PhoneCall size={16} color="#E25B38" className="interiors-phone-icon" />
            <span className="interiors-phone-number">+91 91218 63117</span>
          </a>

          <button
            onClick={onOpenConsultation}
            className="interiors-btn-primary interiors-nav-quote-btn"
          >
            <Sparkles size={16} />
            <span>Get Free Quote</span>
          </button>
        </div>
      </div>
    </header>
  );
}
