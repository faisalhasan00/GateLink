import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, PlusCircle, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

export default function BazaarNavbar({ onOpenPostModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bazaar-navbar">
      <div className="bazaar-navbar-container">
        {/* Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" className="bazaar-brand-group">
            <img 
              src="/logo.png" 
              alt="GateLink Logo" 
              style={{ height: '34px', width: 'auto' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E3A8A', letterSpacing: '-0.03em' }}>
              GateLink
            </span>
          </Link>

          <span className="bazaar-brand-badge">
            <ShoppingBag size={14} style={{ color: '#059669' }} />
            Bazaar
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="bazaar-nav-links">
            <li><a href="#categories" className="bazaar-nav-link">Categories</a></li>
            <li><a href="#live-feed" className="bazaar-nav-link">Society Feed</a></li>
            <li><a href="#why-bazaar" className="bazaar-nav-link">Why GateLink</a></li>
            <li><a href="#how-it-works" className="bazaar-nav-link">How It Works</a></li>
            <li><a href="#faq" className="bazaar-nav-link">FAQ</a></li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="bazaar-nav-actions">
          <Link to="/" className="bazaar-btn-secondary" style={{ display: 'none' }}>
            Main Hub
          </Link>
          <button 
            type="button" 
            className="bazaar-btn-primary"
            onClick={onOpenPostModal}
          >
            <PlusCircle size={16} />
            <span>Post Free Ad</span>
          </button>
          
          <button 
            type="button"
            className="bazaar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <a 
            href="#categories" 
            className="bazaar-nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </a>
          <a 
            href="#live-feed" 
            className="bazaar-nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Society Feed
          </a>
          <a 
            href="#why-bazaar" 
            className="bazaar-nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Why GateLink
          </a>
          <a 
            href="#how-it-works" 
            className="bazaar-nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a 
            href="#faq" 
            className="bazaar-nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </a>
          <button 
            type="button" 
            className="bazaar-btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPostModal();
            }}
          >
            <PlusCircle size={16} />
            <span>Post Free Ad</span>
          </button>
        </div>
      )}
    </header>
  );
}
