import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatDisplayDate } from './blogHelpers';

export default function BlogArticleCard({ article, isDark }) {
  return (
    <div
      style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}
    >
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={article.coverImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'}
          alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '4px 12px',
          borderRadius: '999px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          color: '#38BDF8',
          fontSize: '11px',
          fontWeight: '800',
          backdropFilter: 'blur(4px)'
        }}>
          {article.categoryName || article.category || 'General'}
        </div>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            color: isDark ? '#94A3B8' : '#64748B',
            marginBottom: '10px'
          }}>
            <span>{article.authorName || article.author || 'GateLink Team'}</span>
            <span>•</span>
            <span>{article.readTime || '5 min read'}</span>
            <span>•</span>
            <span>{formatDisplayDate(article)}</span>
          </div>

          <h3 style={{
            fontSize: '18px',
            fontWeight: '800',
            lineHeight: 1.35,
            marginBottom: '10px',
            fontFamily: 'Manrope, sans-serif'
          }}>
            <Link to={`/blog/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {article.title}
            </Link>
          </h3>

          <p style={{
            fontSize: '14px',
            color: isDark ? '#94A3B8' : '#64748B',
            lineHeight: 1.5,
            marginBottom: '20px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {article.excerpt}
          </p>
        </div>

        <Link
          to={`/blog/${article.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#0EA5E9',
            fontWeight: '700',
            fontSize: '14px',
            textDecoration: 'none'
          }}
        >
          Read Article <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
