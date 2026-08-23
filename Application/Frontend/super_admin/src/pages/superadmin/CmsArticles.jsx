import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Eye, 
  CheckCircle, 
  Archive, 
  Trash2, 
  Globe, 
  Clock, 
  AlertCircle,
  FolderOpen,
  User,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';
import { getArticles, getCategories, deleteArticle, updateArticle } from '../../services/cmsService';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useTheme } from '../../context/ThemeContext';

export default function CmsArticles() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { hasPermission, user } = useSuperAdminAuth();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const canCreate = hasPermission('content.create');
  const canEdit = hasPermission('content.edit');
  const canPublish = hasPermission('content.publish');
  const canDelete = hasPermission('content.delete');

  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catsRes, articlesRes] = await Promise.all([
        getCategories(),
        getArticles({ statusFilter, categoryFilter, search: searchQuery })
      ]);
      setCategories(catsRes);
      setArticles(articlesRes.articles);
    } catch (err) {
      console.error('Error loading CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (articleId, newStatus) => {
    setActionLoading(articleId);
    try {
      await updateArticle(articleId, { status: newStatus }, user?.email || 'Super Admin', `Changed status to ${newStatus}`);
      await loadData();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (articleId) => {
    setActionLoading(articleId);
    try {
      await deleteArticle(articleId, user?.email || 'Super Admin');
      setArticles(prev => prev.filter(a => a.id !== articleId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert(`Failed to delete article: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5', color: '#10B981' }}>
            <Globe size={12} /> Published
          </span>
        );
      case 'Review':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7', color: '#F59E0B' }}>
            <Clock size={12} /> Review
          </span>
        );
      case 'Archived':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', backgroundColor: isDark ? 'rgba(107, 114, 128, 0.15)' : '#F3F4F6', color: '#6B7280' }}>
            <Archive size={12} /> Archived
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE', color: '#3B82F6' }}>
            <Edit3 size={12} /> Draft
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: isDark ? '#F8FAFC' : '#0F172A', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
            CMS Article Management
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', margin: '4px 0 0 0' }}>
            Publish, edit, and optimize SaaS blog posts and SEO articles for GateLink
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {hasPermission('content.categories') && (
            <button
              onClick={() => navigate('/cms/categories')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: isDark ? '#1E293B' : '#E2E8F0', color: isDark ? '#F8FAFC' : '#1E293B', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            >
              <FolderOpen size={16} /> Categories & Authors
            </button>
          )}

          {hasPermission('content.media') && (
            <button
              onClick={() => navigate('/cms/media')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: isDark ? '#1E293B' : '#E2E8F0', color: isDark ? '#F8FAFC' : '#1E293B', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            >
              <FileText size={16} /> Media Library
            </button>
          )}

          {canCreate && (
            <button
              onClick={() => navigate('/cms/editor')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#1E3A8A', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)' }}
            >
              <Plus size={18} /> New Article
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '16px 20px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, marginBottom: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search title, slug, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', fontWeight: '500' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Draft">Drafts</option>
            <option value="Review">In Review</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', fontWeight: '500' }}
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      {loading ? (
        <SkeletonLoader />
      ) : articles.length === 0 ? (
        <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '60px 20px', borderRadius: '16px', textAlign: 'center', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
          <FileText size={48} style={{ color: '#94A3B8', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 8px 0' }}>No Articles Found</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '400px', margin: '0 auto 20px' }}>
            No SaaS articles match your current search query and status filter.
          </p>
          {canCreate && (
            <button
              onClick={() => navigate('/cms/editor')}
              style={{ padding: '10px 20px', backgroundColor: '#1E3A8A', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
            >
              Create First Article
            </button>
          )}
        </div>
      ) : (
        <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, color: isDark ? '#94A3B8' : '#64748B', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>
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
                      <div style={{ fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '4px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0EA5E9', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>
                          {(art.authorName || 'A')[0]}
                        </div>
                        <span style={{ fontWeight: '600', color: isDark ? '#F8FAFC' : '#1E293B' }}>{art.authorName || 'Admin'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      {getStatusBadge(art.status)}
                    </td>

                    <td style={{ padding: '16px 20px', color: isDark ? '#94A3B8' : '#64748B', fontSize: '13px' }}>
                      {art.updatedAt?.toDate ? art.updatedAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {/* Edit Button */}
                        {canEdit && (
                          <button
                            onClick={() => navigate(`/cms/editor/${art.id}`)}
                            title="Edit Article"
                            style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${isDark ? '#475569' : '#CBD5E1'}`, backgroundColor: isDark ? '#1E293B' : '#FFF', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                        )}

                        {/* Public Preview Button */}
                        {art.status === 'Published' && (
                          <a
                            href={`https://gatelink.in/blog/${art.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9', textDecoration: 'none', fontWeight: '600', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={14} /> View
                          </a>
                        )}

                        {/* Submit for Review */}
                        {art.status === 'Draft' && (
                          <button
                            onClick={() => handleStatusChange(art.id, 'Review')}
                            disabled={actionLoading === art.id}
                            style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: 'none', fontWeight: '600', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Send size={13} /> Submit Review
                          </button>
                        )}

                        {/* Publish / Unpublish Toggle */}
                        {canPublish && art.status !== 'Published' && (
                          <button
                            onClick={() => handleStatusChange(art.id, 'Published')}
                            disabled={actionLoading === art.id}
                            style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#10B981', color: '#FFF', border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle size={14} /> Publish
                          </button>
                        )}

                        {/* Archive */}
                        {canPublish && art.status === 'Published' && (
                          <button
                            onClick={() => handleStatusChange(art.id, 'Archived')}
                            disabled={actionLoading === art.id}
                            style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: isDark ? '#334155' : '#E2E8F0', color: isDark ? '#CBD5E1' : '#475569', border: 'none', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Archive
                          </button>
                        )}

                        {/* Delete (Requires content.delete) */}
                        {canDelete && (
                          <button
                            onClick={() => setDeleteConfirmId(art.id)}
                            title="Delete Article"
                            style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', cursor: 'pointer' }}
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFF', padding: '24px', borderRadius: '16px', maxWidth: '420px', width: '100%', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '12px' }}>
              <AlertCircle size={24} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Confirm Article Deletion</h3>
            </div>
            <p style={{ fontSize: '14px', color: isDark ? '#CBD5E1' : '#475569', margin: '0 0 20px 0' }}>
              Are you sure you want to permanently delete this article? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${isDark ? '#475569' : '#CBD5E1'}`, backgroundColor: 'transparent', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: '#EF4444', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
