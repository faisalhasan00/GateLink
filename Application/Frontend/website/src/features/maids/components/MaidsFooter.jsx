import React from 'react';
import { Link } from 'react-router-dom';

export default function MaidsFooter() {
  return (
    <footer className="maids-cinematic-footer">
      <div className="maids-footer-main-container">
        {/* Top Grid: Download Card + Pages + Contact/Socials */}
        <div className="maids-footer-top-grid">
          {/* Left: Download App White Card with QR */}
          <div className="maids-footer-qr-card">
            <div className="maids-footer-qr-info">
              <span className="maids-footer-qr-top">Download</span>
              <h4 className="maids-footer-qr-brand">
                <span className="maids-footer-qr-highlight">GateLink</span> app
              </h4>
              <div className="maids-footer-store-badges">
                {/* Apple Store Icon */}
                <div className="maids-store-icon-pill" title="App Store">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.74-.95 2.76.99.08 2.04-.52 2.68-1.26z" />
                  </svg>
                </div>
                {/* Google Play Store Icon */}
                <div className="maids-store-icon-pill" title="Google Play">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.39 0 .77.15 1.06.44l11.66 8.56-4.66 4.5-9.56 5zm11.22-9.5l2.44-1.79-11.16-8.21 8.72 10zm-9.72 9.5l11.16-8.21-2.44-1.79-8.72 10zm13.16-7.21l3.56 2.61c.67.49.82 1.43.33 2.1-.21.29-.53.46-.89.46l-4.5-3.3 1.5-1.87z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Clean Functional QR Code Preview */}
            <div className="maids-footer-qr-box">
              <svg viewBox="0 0 100 100" className="maids-footer-qr-svg">
                {/* 3 Corner Anchor Squares */}
                <rect x="10" y="10" width="24" height="24" rx="4" fill="#1e1e1e" />
                <rect x="15" y="15" width="14" height="14" rx="2" fill="#ffffff" />
                <rect x="18" y="18" width="8" height="8" rx="1" fill="#7C3AED" />

                <rect x="66" y="10" width="24" height="24" rx="4" fill="#1e1e1e" />
                <rect x="71" y="15" width="14" height="14" rx="2" fill="#ffffff" />
                <rect x="74" y="18" width="8" height="8" rx="1" fill="#7C3AED" />

                <rect x="10" y="66" width="24" height="24" rx="4" fill="#1e1e1e" />
                <rect x="15" y="71" width="14" height="14" rx="2" fill="#ffffff" />
                <rect x="18" y="74" width="8" height="8" rx="1" fill="#7C3AED" />

                {/* Data Matrix Dots in Purple and Charcoal */}
                <rect x="40" y="12" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="52" y="12" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="40" y="24" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="46" y="32" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="58" y="24" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="12" y="44" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="24" y="44" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="36" y="44" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="48" y="44" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="60" y="44" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="72" y="44" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="84" y="44" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="44" y="56" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="56" y="56" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="68" y="56" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="40" y="68" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="52" y="68" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="64" y="68" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="76" y="68" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="46" y="80" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="58" y="80" width="6" height="6" rx="1" fill="#7C3AED" />
                <rect x="70" y="80" width="6" height="6" rx="1" fill="#1e1e1e" />
                <rect x="82" y="80" width="6" height="6" rx="1" fill="#7C3AED" />
              </svg>
            </div>
          </div>

          {/* Middle: Pages Navigation */}
          <div className="maids-footer-col">
            <span className="maids-footer-col-label">Pages</span>
            <ul className="maids-footer-links-list">
              <li>
                <Link to="/about" className="maids-footer-link">About Us</Link>
              </li>
              <li>
                <Link to="/about" className="maids-footer-link">Career</Link>
              </li>
              <li>
                <Link to="/terms" className="maids-footer-link">Terms &amp; Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="maids-footer-link">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="maids-footer-link">Refund &amp; Cancellation</Link>
              </li>
            </ul>
          </div>

          {/* Right: Contact, Address & Socials */}
          <div className="maids-footer-col">
            <div className="maids-footer-contact-block">
              <span className="maids-footer-col-label">Contact</span>
              <a href="mailto:support@gatelink.in" className="maids-footer-contact-val">
                support@gatelink.in
              </a>
            </div>

            <div className="maids-footer-contact-block">
              <span className="maids-footer-col-label">Address</span>
              <p className="maids-footer-address-val">
                GateLink Hub, Financial District,<br />
                Gachibowli, Hyderabad, Telangana 500032
              </p>
            </div>

            <div className="maids-footer-contact-block">
              <span className="maids-footer-col-label">Socials</span>
              <div className="maids-footer-socials-row">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="maids-social-circle" title="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="maids-social-circle" title="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="maids-social-circle" title="X (Twitter)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="maids-social-circle" title="LinkedIn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Big Watermark Text */}
        <div className="maids-footer-watermark-wrapper">
          <span className="maids-footer-watermark-text">gatelink</span>
        </div>

        {/* Bottom Copyright Row */}
        <div className="maids-footer-copyright-bar">
          <p className="maids-footer-copyright-text">
            &copy; {new Date().getFullYear()} <strong>GateLink Technologies Pvt. Ltd.</strong> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

