import React from 'react';
import { BookOpen, Search, X } from 'lucide-react';

export default function BlogHeroSection({ searchQuery, setSearchQuery, onResetPage, isDark }) {
  return (
    <section style={{
      paddingTop: '140px',
      paddingBottom: '60px',
      backgroundColor: isDark ? '#1E293B' : '#0F172A',
      color: '#FFFFFF',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: 'radial-gradient(#0EA5E9 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 16px',
          borderRadius: '999px',
          backgroundColor: 'rgba(14, 165, 233, 0.15)',
          color: '#38BDF8',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          <BookOpen size={14} /> Knowledge & Strategy Hub
        </span>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: '800',
          lineHeight: 1.15,
          marginBottom: '20px',
          fontFamily: 'Manrope, sans-serif'
        }}>
          GateLink <span style={{ color: '#0EA5E9' }}>Community Insights</span>
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 18px)',
          color: '#94A3B8',
          maxWidth: '700px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Practical guides, security protocols, financial auditing strategies, and technology trends for modern Indian apartment housing societies.
        </p>

        {/* Search Box */}
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }}
          />
          <input
            type="text"
            placeholder="Search articles by topic, security, or keyword..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onResetPage();
            }}
            style={{
              width: '100%',
              padding: '16px 20px 16px 48px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.07)',
              color: '#FFFFFF',
              fontSize: '15px',
              outline: 'none',
              backdropFilter: 'blur(10px)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                onResetPage();
              }}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
