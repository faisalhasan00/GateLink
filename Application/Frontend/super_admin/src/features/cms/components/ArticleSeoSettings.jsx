import React from 'react';
import { Search } from 'lucide-react';

export function ArticleSeoSettings({
  isDark,
  title,
  slug,
  excerpt,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  canonicalUrl,
  setCanonicalUrl,
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 20px 0' }}>
            Search Engine Optimization (SEO)
          </h3>

          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '6px' }}>
            Meta Title Tag ({seoTitle.length} / 60 chars)
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', marginBottom: '16px' }}
          />

          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '6px' }}>
            Meta Description ({seoDescription.length} / 160 chars)
          </label>
          <textarea
            rows={3}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', marginBottom: '16px' }}
          />

          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '6px' }}>
            Canonical Tag URL
          </label>
          <input
            type="text"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '13px', fontFamily: 'monospace' }}
          />
        </div>
      </div>

      {/* Live Google Search Preview Box */}
      <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={16} /> Google Search Preview
        </h4>

        <div style={{ backgroundColor: '#FFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ fontSize: '14px', color: '#202124', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            https://gatelink.in › blog › {slug || 'article-slug'}
          </div>
          <div style={{ fontSize: '18px', color: '#1a0dab', fontWeight: '500', lineHeight: '1.3', marginBottom: '4px', cursor: 'pointer' }}>
            {seoTitle || title || 'Article Title - GateLink'}
          </div>
          <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: '1.5' }}>
            {seoDescription || excerpt || 'Search description excerpt will appear here in Google SERP results...'}
          </div>
        </div>
      </div>
    </div>
  );
}
