import React from 'react';
import { Globe, Clock, Archive, Edit3, Eye, Send, CheckCircle, Trash2, FileText } from 'lucide-react';

export default function CmsArticlesTable({
  articles,
  canCreate,
  canEdit,
  canPublish,
  canDelete,
  actionLoading,
  onNavigate,
  onStatusChange,
  onConfirmDelete,
  isDark
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5',
            color: '#10B981'
          }}>
            <Globe size={12} /> Published
          </span>
        );
      case 'Review':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
            color: '#F59E0B'
          }}>
            <Clock size={12} /> Review
          </span>
        );
      case 'Archived':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: isDark ? 'rgba(107, 114, 128, 0.15)' : '#F3F4F6',
            color: '#6B7280'
          }}>
            <Archive size={12} /> Archived
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE',
            color: '#3B82F6'
          }}>
            <Edit3 size={12} /> Draft
          </span>
        );
    }
  };

  if (articles.length === 0) {
    return (
      <div style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        padding: '60px 20px',
        borderRadius: '16px',
        textAlign: 'center',
        border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`
      }}>
        <FileText size={48} style={{ color: '#94A3B8', marginBottom: '16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 8px 0' }}>
          No Articles Found
        </h3>
        <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '400px', margin: '0 auto 20px' }}>
          No SaaS articles match your current search query and status filter.
        </p>
        {canCreate && (
          <button
            onClick={() => onNavigate('/cms/editor')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Create First Article
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: '16px',
      border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              color: isDark ? '#94A3B8' : '#64748B',
              fontWeight: '700',
              fontSize: '12px',
              textTransform: 'uppercase'
            }}>
              <th style={{ padding: '16px 20px' }}>Article Details</th>
              <th style={{ padding: '16px 20px' }}>Category</th>
              <th style={{ padding: '16px 20px' }}>Author</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
              <th style={{ padding: '16px 20px' }}>Last Updated</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((art) => (
              <tr key={art.id} style={{ borderBottom: `1px solid ${isDark ? '#334155' : '#F1F5F9'}` }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{
                    fontWeight: '700',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    marginBottom: '4px',
                    maxWidth: '400px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {art.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#0EA5E9', fontFamily: 'monospace' }}>
                    /blog/{art.slug}
                  </div>
                </td>

                <td style={{ padding: '16px 20px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: '500' }}>
                  {art.categoryName || 'General'}
                </td>

                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#0EA5E9',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {(art.authorName || 'A')[0]}
                    </div>
                    <span style={{ fontWeight: '600', color: isDark ? '#F8FAFC' : '#1E293B' }}>
                      {art.authorName || 'Admin'}
                    </span>
                  </div>
                </td>

                <td style={{ padding: '16px 20px' }}>
                  {getStatusBadge(art.status)}
                </td>

                <td style={{ padding: '16px 20px', color: isDark ? '#94A3B8' : '#64748B', fontSize: '13px' }}>
                  {art.updatedAt?.toDate
                    ? art.updatedAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Recently'}
                </td>

                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    {canEdit && (
                      <button
                        onClick={() => onNavigate(`/cms/editor/${art.id}`)}
                        title="Edit Article"
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: `1px solid ${isDark ? '#475569' : '#CBD5E1'}`,
                          backgroundColor: isDark ? '#1E293B' : '#FFF',
                          color: isDark ? '#F8FAFC' : '#1E293B',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {art.status === 'Published' && (
                      <a
                        href={`https://gatelink.in/blog/${art.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(14, 165, 233, 0.1)',
                          color: '#0EA5E9',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={14} /> View
                      </a>
                    )}

                    {art.status === 'Draft' && (
                      <button
                        onClick={() => onStatusChange(art.id, 'Review')}
                        disabled={actionLoading === art.id}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          color: '#F59E0B',
                          border: 'none',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Send size={13} /> Submit Review
                      </button>
                    )}

                    {canPublish && art.status !== 'Published' && (
                      <button
                        onClick={() => onStatusChange(art.id, 'Published')}
                        disabled={actionLoading === art.id}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#10B981',
                          color: '#FFF',
                          border: 'none',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle size={14} /> Publish
                      </button>
                    )}

                    {canPublish && art.status === 'Published' && (
                      <button
                        onClick={() => onStatusChange(art.id, 'Archived')}
                        disabled={actionLoading === art.id}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: isDark ? '#334155' : '#E2E8F0',
                          color: isDark ? '#CBD5E1' : '#475569',
                          border: 'none',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Archive
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => onConfirmDelete(art.id)}
                        title="Delete Article"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
