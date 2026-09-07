import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { useTheme } from '../../context/ThemeContext';
import { SOLUTIONS_PERSONAS } from './solutions/solutionsData';
import SolutionsHeroSection from './solutions/SolutionsHeroSection';
import PersonaDetailWorkspace from './solutions/PersonaDetailWorkspace';

export default function SolutionsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activePersona, setActivePersona] = useState('resident');

  const currentPersona = SOLUTIONS_PERSONAS.find((p) => p.id === activePersona) || SOLUTIONS_PERSONAS[0];

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead
        title="Solutions by Role - GateLink"
        description="Tailored society management solutions for residents, security guards, RWA committee members, accountants, developers, and facility managers."
        canonicalUrl="https://gatelink.in/solutions"
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <SolutionsHeroSection
        activePersona={activePersona}
        onSelectPersona={setActivePersona}
        isDark={isDark}
      />

      <PersonaDetailWorkspace
        currentPersona={currentPersona}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        isDark={isDark}
      />

      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
