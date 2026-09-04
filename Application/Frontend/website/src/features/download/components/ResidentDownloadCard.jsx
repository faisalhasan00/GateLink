import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Play, QrCode, CheckCircle2, Bell, CreditCard, ShieldCheck } from 'lucide-react';

export default function ResidentDownloadCard({ isDark, onOpenDemo }) {
  return (
    <motion.div
      key="resident"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '24px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
        padding: '48px',
        boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.06)'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
        {/* Left Information */}
        <div>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '6px',
              background: '#0EA5E9',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '1px',
              marginBottom: '16px'
            }}
          >
            FOR APARTMENT RESIDENTS & FLAT OWNERS
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1E293B', margin: '0 0 14px 0' }}>
            GateLink Resident App
          </h2>

          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
            Complete society living in your pocket. Approve visitors in 1-tap, pre-invite guests with QR codes, pay maintenance via UPI, and raise emergency SOS alerts instantly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {[
              '1-Tap Delivery & Cab Pre-Approvals (Swiggy, Zomato, Amazon, Uber)',
              'Online Maintenance Billing & Instant GST PDF Receipts via Cashfree',
              'Domestic Staff (Maid, Driver, Cook) Arrival & Exit Notifications',
              'Clubhouse & Amenity Booking with Automated Slot Locking',
              '1-Touch Emergency Panic Siren to Gate Guards and Family'
            ].map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
                <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Download Store Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderRadius: '12px',
                background: '#0F172A',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <Apple size={28} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>App Store</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>Coming Soon</div>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderRadius: '12px',
                background: '#0F172A',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <Play size={26} color="#0EA5E9" fill="#0EA5E9" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>Google Play</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>Coming Soon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right QR Code & Mobile Mockup Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              padding: '24px',
              borderRadius: '20px',
              background: isDark ? '#0F172A' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
              textAlign: 'center',
              maxWidth: '280px',
              width: '100%'
            }}
          >
            <div
              style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 16px auto',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}
            >
              <QrCode size={150} color="#0F172A" />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E293B', marginBottom: '4px' }}>
              Mobile Apps Launching Soon
            </div>
            <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>
              Coming Soon for iOS & Android
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
