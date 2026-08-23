import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { useTheme } from '../../context/ThemeContext';
import { personasData } from '../../features/solutions/data/personasData';
import PersonaDetailCard from '../../features/solutions/components/PersonaDetailCard';

export default function SolutionsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activePersona, setActivePersona] = useState('resident');

  const current = personasData.find((p) => p.id === activePersona) || personasData[0];

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', minHeight: '100vh', color: isDark ? '#F8FAFC' : '#0F172A' }}>
      <SeoHead
        title="GateLink Solutions for Residents, Guards & RWAs"
        description="Explore GateLink society management solutions designed for residents, security guards, RWA committee members, and facility managers."
        canonicalUrl="https://gatelink.in/solutions"
      />

      {/* Navigation */}
      <Navbar onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 20px 80px 20px' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#0EA5E9',
              marginBottom: '16px'
            }}
          >
            TAILORED COMMUNITY SOLUTIONS
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Society Management Solutions for Residents, Guards & RWAs
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Select your role below to discover how GateLink eliminates friction, prevents unauthorized intrusions, and modernizes your gated community.
          </p>
        </div>

        {/* Persona Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '36px'
          }}
        >
          {personasData.map((p) => {
            const isActive = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  border: isActive ? '2px solid #0EA5E9' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                  background: isActive ? (isDark ? 'rgba(14, 165, 233, 0.15)' : '#E0F2FE') : (isDark ? '#0F172A' : '#FFFFFF'),
                  color: isActive ? '#0EA5E9' : isDark ? '#94A3B8' : '#475569',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(14, 165, 233, 0.2)' : 'none'
                }}
              >
                {p.icon}
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Animated Persona View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePersona}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <PersonaDetailCard
              current={current}
              isDark={isDark}
              onDemoClick={() => setIsDemoModalOpen(true)}
            />
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Footer */}
      <FooterSection />

      {/* Free Demo Schedule Modal */}
      {isDemoModalOpen && (
        <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      )}
    </div>
  );
}
