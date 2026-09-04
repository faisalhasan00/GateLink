import React from 'react';
import { motion } from 'framer-motion';
import { Play, QrCode, CheckCircle2, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

export default function GuardDownloadCard({ isDark, onOpenDemo }) {
  return (
    <motion.div
      key="guard"
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
              background: '#10B981',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '1px',
              marginBottom: '16px'
            }}
          >
            FOR GATE SECURITY GUARDS & MULTILINGUAL TERMINALS
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1E293B', margin: '0 0 14px 0' }}>
            GateLink Guard App
          </h2>

          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
            High-speed security console designed for fast gate entries. 5-second check-in, QR code scanning, offline mode sync, multilingual interface (Hindi & English), and instant emergency response.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {[
              '5-Second Rapid Visitor Check-in with Phone Number Lookup',
              'Fast Passcode & QR Code Gate Scanner with Auto-Verification',
              'Vehicle Plate OCR & Parking Spot Allocation Logging',
              'Multilingual UI (हिंदी, English) Optimized for Fast Touch Input',
              'Emergency Alarm Receiver Sounding Loud Sirens on Guard Phone'
            ].map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Android Store Button */}
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
              <Play size={26} color="#10B981" fill="#10B981" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>Google Play (Guard Edition)</div>
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
              Guard App Launching Soon
            </div>
            <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>
              Optimized for 4G Gate Android Tablets & Terminals
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
