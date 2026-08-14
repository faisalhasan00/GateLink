import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Phone } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function MobileMenu({
  isOpen,
  isDark,
  societyAdminUrl,
  onEnrollClick,
  onClose,
}) {
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: isDark
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid #E5E7EB',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        padding: '16px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: 'calc(100vh - 70px)',
        overflowY: 'auto',
      }}
    >
      {/* Mobile Links */}
      <div>
        <div
          onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            fontSize: '15px',
            fontWeight: 700,
            color: isDark ? '#FFFFFF' : '#1E293B',
            cursor: 'pointer',
            borderBottom: isDark
              ? '1px solid rgba(255, 255, 255, 0.06)'
              : '1px solid #F1F5F9',
          }}
        >
          <span>About Us</span>
          {mobileAboutOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {mobileAboutOpen && (
          <div
            style={{
              paddingLeft: '14px',
              paddingTop: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <Link
              to="/about"
              onClick={onClose}
              style={{
                color: isDark ? '#94A3B8' : '#64748B',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              About Us
            </Link>
            <Link
              to="/ecosystem"
              onClick={onClose}
              style={{
                color: isDark ? '#94A3B8' : '#64748B',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              UAE Ecosystem
            </Link>
            <Link
              to="/blog"
              onClick={onClose}
              style={{
                color: isDark ? '#94A3B8' : '#64748B',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Blog
            </Link>
            <Link
              to="/privacy"
              onClick={onClose}
              style={{
                color: isDark ? '#94A3B8' : '#64748B',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Privacy Policy
            </Link>
          </div>
        )}
      </div>

      <div>
        <div
          onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            fontSize: '15px',
            fontWeight: 700,
            color: isDark ? '#FFFFFF' : '#1E293B',
            cursor: 'pointer',
            borderBottom: isDark
              ? '1px solid rgba(255, 255, 255, 0.06)'
              : '1px solid #F1F5F9',
          }}
        >
          <span>Features</span>
          {mobileFeaturesOpen ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {mobileFeaturesOpen && (
          <div
            style={{
              paddingLeft: '14px',
              paddingTop: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <Link
              to="/features"
              onClick={onClose}
              style={{
                color: isDark ? '#94A3B8' : '#64748B',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              All Features
            </Link>
            <Link
              to="/solutions"
              onClick={onClose}
              style={{
                color: isDark ? '#94A3B8' : '#64748B',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Solutions
            </Link>
            <Link
              to="/pricing"
              onClick={onClose}
              style={{
                color: isDark ? '#94A3B8' : '#64748B',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Pricing Plans
            </Link>
          </div>
        )}
      </div>

      <Link
        to="/contact"
        onClick={onClose}
        style={{
          padding: '12px 0',
          fontSize: '15px',
          fontWeight: 700,
          color: isDark ? '#FFFFFF' : '#1E293B',
          textDecoration: 'none',
          borderBottom: isDark
            ? '1px solid rgba(255, 255, 255, 0.06)'
            : '1px solid #F1F5F9',
        }}
      >
        Contact Us
      </Link>

      {/* Mobile Phone Launcher */}
      <a
        href="tel:+919999999999"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 0',
          color: isDark ? '#93C5FD' : '#1E3A8A',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: 700,
        }}
      >
        <Phone size={16} />
        <span>Call: +91 99999 99999</span>
      </a>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '8px',
        }}
      >
        <a
          href={societyAdminUrl}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: isDark ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid #1E3A8A',
            color: isDark ? '#FFFFFF' : '#1E3A8A',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 700,
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          Society Login
        </a>

        <Button variant="primary" size="medium" fullWidth onClick={onEnrollClick}>
          Enroll your society
        </Button>
      </div>
    </div>
  );
}
