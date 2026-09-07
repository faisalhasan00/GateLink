import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function EcosystemHeroSection() {
  return (
    <section style={{
      paddingTop: '160px',
      paddingBottom: '50px',
      background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '30px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818CF8',
            fontSize: '13px',
            fontWeight: 800,
            marginBottom: '16px'
          }}>
            <Zap size={14} /> LIVE CONNECTED ARCHITECTURE
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            The Connected GateLink Ecosystem
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '760px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
            See how real-time data flows seamlessly between <strong style={{ color: '#FFFFFF' }}>Visitors, Security Guards, Residents, Admins, Staff, Vendors, and the Society OS</strong>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
