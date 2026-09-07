import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { useTheme } from '../../context/ThemeContext';
import { ALL_FEATURES } from './features/featuresData';
import FeaturesHeroSection from './features/FeaturesHeroSection';
import FeatureCard from './features/FeatureCard';
import FeatureDetailModal from './features/FeatureDetailModal';

export default function FeaturesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFeatureDetail, setSelectedFeatureDetail] = useState(null);

  const filteredFeatures = ALL_FEATURES.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.benefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead
        title="All Features & Capabilities - GateLink"
        description="Explore GateLink core modules designed to digitize visitor security, maintenance billing, complaints, amenities, and RWA governance."
        canonicalUrl="https://gatelink.in/features"
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <FeaturesHeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isDark={isDark}
      />

      {/* Main Features Grid */}
      <section style={{ padding: '60px 0 100px 0' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          {filteredFeatures.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: isDark ? '#94A3B8' : '#666666' }}>
              <h3>No features found matching "{searchQuery}"</h3>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '2px', background: '#00B589', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {filteredFeatures.map((f) => (
                <FeatureCard
                  key={f.id}
                  feature={f}
                  onClick={() => setSelectedFeatureDetail(f)}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <FeatureDetailModal
        selectedFeature={selectedFeatureDetail}
        onClose={() => setSelectedFeatureDetail(null)}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        isDark={isDark}
      />

      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
