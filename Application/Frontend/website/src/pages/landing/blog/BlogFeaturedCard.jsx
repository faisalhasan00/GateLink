import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatDisplayDate } from './blogHelpers';

export default function BlogFeaturedCard({ featuredPost, isDark }) {
  if (!featuredPost) return null;

  return (
    <div style={{
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: '24px',
      overflow: 'hidden',
      border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
      marginBottom: '56px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 0,
      boxShadow: '0 12px 36px rgba(0,0,0,0.06)'
    }}>
      <div style={{ position: 'relative', minHeight: '280px' }}>
        <img
          src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200'}
          alt={featuredPost.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '6px 14px',
          borderRadius: '999px',
          backgroundColor: '#0EA5E9',
          color: '#FFF',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          FEATURED
        </div>
      </div>

      <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          color: isDark ? '#94A3B8' : '#64748B',
          marginBottom: '12px'
        }}>
          <span style={{ color: '#0EA5E9', fontWeight: '700' }}>
            {featuredPost.categoryName || featuredPost.category || 'General'}
          </span>
          <span>•</span>
          <span>{formatDisplayDate(featuredPost)}</span>
        </div>

        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: '800',
          lineHeight: 1.3,
          marginBottom: '14px',
          fontFamily: 'Manrope, sans-serif'
        }}>
          <Link to={`/blog/${featuredPost.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {featuredPost.title}
          </Link>
        </h2>

        <p style={{
          fontSize: '15px',
          color: isDark ? '#CBD5E1' : '#475569',
          lineHeight: 1.6,
          marginBottom: '24px'
        }}>
          {featuredPost.excerpt}
        </p>

        <Link
          to={`/blog/${featuredPost.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#0EA5E9',
            fontWeight: '800',
            fontSize: '15px',
            textDecoration: 'none'
          }}
        >
          Read Full Article <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
