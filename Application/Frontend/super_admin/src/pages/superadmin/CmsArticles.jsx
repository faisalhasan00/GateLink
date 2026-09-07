import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles, getCategories, deleteArticle, updateArticle } from '../../services/cmsService';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useTheme } from '../../context/ThemeContext';
import CmsHeaderBar from '../../features/cms/components/CmsHeaderBar';
import CmsFilterBar from '../../features/cms/components/CmsFilterBar';
import CmsArticlesTable from '../../features/cms/components/CmsArticlesTable';
import CmsDeleteConfirmModal from '../../features/cms/components/CmsDeleteConfirmModal';

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
      setArticles((prev) => prev.filter((a) => a.id !== articleId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert(`Failed to delete article: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      <CmsHeaderBar
        onNavigate={navigate}
        hasPermission={hasPermission}
        canCreate={canCreate}
        isDark={isDark}
      />

      <CmsFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        onSearch={handleSearch}
        isDark={isDark}
      />

      {loading ? (
        <SkeletonLoader />
      ) : (
        <CmsArticlesTable
          articles={articles}
          canCreate={canCreate}
          canEdit={canEdit}
          canPublish={canPublish}
          canDelete={canDelete}
          actionLoading={actionLoading}
          onNavigate={navigate}
          onStatusChange={handleStatusChange}
          onConfirmDelete={setDeleteConfirmId}
          isDark={isDark}
        />
      )}

      <CmsDeleteConfirmModal
        deleteConfirmId={deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onDelete={handleDelete}
        isDark={isDark}
      />
    </div>
  );
}
