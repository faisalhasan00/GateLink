import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { featureCategories, allFeaturesData } from '../../features/features/data/featuresData';
import FeatureCard from '../../features/features/components/FeatureCard';
import FeatureDetailModal from '../../features/features/components/FeatureDetailModal';

export default function FeaturesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFeatureDetail, setSelectedFeatureDetail] = useState(null);

  const filteredFeatures = allFeaturesData.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = f.title.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', minHeight: '100vh', color: isDark ? '#F8FAFC' : '#0F172A' }}>
      <SeoHead
        title="GateLink Features – All-in-One Society Management Platform"
        description="Explore all GateLink society management app features including visitor security pass, maintenance billing collections, guard gatekeeper app, and resident directory."
        canonicalUrl="https://gatelink.in/features"
      />

      <Navbar onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 20px 100px 20px' }}>
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
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}
          >
            Capabilities Suite
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', marginBottom: '12px' }}>
            Society Management App Features & Platform Capabilities
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Every tool and workflow needed to operate a modern gated community — from security gate automation to financial ledger audits.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginBottom: '48px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', maxWidth: '440px', width: '100%' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search features (e.g. Visitor, Billing, SOS, Guard)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 46px',
                borderRadius: '14px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                background: isDark ? '#0F172A' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontSize: '14px',
                outline: 'none',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.03)'
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {featureCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    border: isActive ? '1px solid #0EA5E9' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                    background: isActive ? '#0EA5E9' : isDark ? '#0F172A' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          <AnimatePresence>
            {filteredFeatures.map((f) => (
              <FeatureCard
                key={f.id}
                feature={f}
                isDark={isDark}
                onSelectDetail={setSelectedFeatureDetail}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Feature Deep Dive Modal */}
      <FeatureDetailModal
        feature={selectedFeatureDetail}
        isDark={isDark}
        onClose={() => setSelectedFeatureDetail(null)}
        onOpenDemo={() => setIsDemoModalOpen(true)}
      />

      <FooterSection />

      {isDemoModalOpen && (
        <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      )}
    </div>
  );
}
