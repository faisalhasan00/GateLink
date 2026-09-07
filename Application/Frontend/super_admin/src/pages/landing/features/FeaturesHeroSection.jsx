import React from 'react';
import { Search } from 'lucide-react';
import { FEATURE_CATEGORIES } from './featuresData';

export default function FeaturesHeroSection({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  onSelectCategory,
  isDark
}) {
  return (
    <section style={{
      paddingTop: '120px',
      paddingBottom: '50px',
      background: isDark ? '#0F172A' : '#FFFFFF',
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', textTransform: 'uppercase', letterSpacing: '1px' }}>
          COMPLETE FEATURE MATRIX
        </span>
        <h1 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '10px 0 16px 0' }}>
          Intelligent Features for Modern Communities
        </h1>
        <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
          Explore the 12 core modules designed to digitize visitor security, maintenance billing, complaints, amenities, and multi-tenant governance.
        </p>

        {/* Search & Category Filter Bar */}
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color={isDark ? '#94A3B8' : '#666666'} style={{ position: 'absolute', left: '16px' }} />
            <input
              type="text"
              placeholder="Search features (e.g. Visitor, Billing, QR Pass, SOS, Parking)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 48px',
                borderRadius: '4px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #CCCCCC',
                background: isDark ? '#1E293B' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#333333',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {FEATURE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: isSelected ? '#00B589' : (isDark ? 'rgba(255,255,255,0.1)' : '#CCCCCC'),
                    backgroundColor: isSelected ? '#00B589' : 'transparent',
                    color: isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#444444'),
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
