import React from 'react';
import { FolderOpen, FileText, Plus } from 'lucide-react';

export default function CmsHeaderBar({
  onNavigate,
  hasPermission,
  canCreate,
  isDark
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: isDark ? '#F8FAFC' : '#0F172A',
          margin: 0,
          fontFamily: 'Manrope, sans-serif'
        }}>
          CMS Article Management
        </h1>
        <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', margin: '4px 0 0 0' }}>
          Publish, edit, and optimize SaaS blog posts and SEO articles for GateLink
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {hasPermission('content.categories') && (
          <button
            onClick={() => onNavigate('/cms/categories')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
              color: isDark ? '#F8FAFC' : '#1E293B',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <FolderOpen size={16} /> Categories & Authors
          </button>
        )}

        {hasPermission('content.media') && (
          <button
            onClick={() => onNavigate('/cms/media')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
              color: isDark ? '#F8FAFC' : '#1E293B',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} /> Media Library
          </button>
        )}

        {canCreate && (
          <button
            onClick={() => onNavigate('/cms/editor')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)'
            }}
          >
            <Plus size={18} /> New Article
          </button>
        )}
      </div>
    </div>
  );
}
