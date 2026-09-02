import React from 'react';
import { EditorContent } from '@tiptap/react';
import { 
  Save, 
  ArrowLeft, 
  Globe, 
  Send, 
  CheckCircle, 
  FileText, 
  History, 
  AlertCircle 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useCmsEditor } from '../../features/cms/hooks/useCmsEditor';
import { EditorMenuBar } from '../../features/cms/components/EditorMenuBar';
import { ArticleSeoSettings } from '../../features/cms/components/ArticleSeoSettings';
import { ArticleSidebarSettings } from '../../features/cms/components/ArticleSidebarSettings';
import { ArticleRevisionsModal } from '../../features/cms/components/ArticleRevisionsModal';
import { MediaLibraryModal } from '../../features/cms/components/MediaLibraryModal';

export default function CmsArticleEditor() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    navigate,
    isEditing,
    loading,
    saving,
    activeTab,
    setActiveTab,
    title,
    slug,
    handleTitleChange,
    handleSlugChange,
    excerpt,
    setExcerpt,
    coverImage,
    setCoverImage,
    categoryId,
    handleCategorySelect,
    tagsInput,
    setTagsInput,
    authorId,
    handleAuthorSelect,
    status,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    canonicalUrl,
    setCanonicalUrl,
    setOgImage,
    categories,
    authors,
    revisions,
    mediaLibrary,
    showMediaPicker,
    setShowMediaPicker,
    uploadingImage,
    validationErrors,
    canPublish,
    editor,
    handleOpenMediaPicker,
    handleImageUpload,
    handleInsertMediaToEditor,
    handleSave,
    handleRestoreRevision,
  } = useCmsEditor();

  if (loading) return <SkeletonLoader />;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Top Header & Save Actions Bar */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/cms')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, backgroundColor: isDark ? '#1E293B' : '#FFF', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >
            <ArrowLeft size={16} /> Back to Articles
          </button>

          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: isDark ? '#F8FAFC' : '#0F172A', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
              {isEditing ? 'Edit SaaS Article' : 'Compose New SaaS Article'}
            </h1>
            <span style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: '600' }}>
              Status: {status}
            </span>
          </div>
        </div>

        {/* Save & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSave('Draft')}
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: isDark ? '#1E293B' : '#E2E8F0', color: isDark ? '#F8FAFC' : '#1E293B', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
          >
            <Save size={16} /> Save Draft
          </button>

          {status === 'Draft' && (
            <button
              onClick={() => handleSave('Review')}
              disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#F59E0B', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
            >
              <Send size={16} /> Submit for Review
            </button>
          )}

          {canPublish && (
            <button
              onClick={() => handleSave('Published')}
              disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
            >
              <CheckCircle size={18} /> Publish Live
            </button>
          )}
        </div>
      </div>

      {/* Validation Errors Box */}
      {validationErrors.length > 0 && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', color: '#EF4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', marginBottom: '8px' }}>
            <AlertCircle size={18} /> Please resolve the following publishing errors:
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('editor')}
          style={{ padding: '12px 20px', border: 'none', backgroundColor: 'transparent', borderBottom: activeTab === 'editor' ? '3px solid #1E3A8A' : '3px solid transparent', color: activeTab === 'editor' ? (isDark ? '#60A5FA' : '#1E3A8A') : (isDark ? '#94A3B8' : '#64748B'), fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FileText size={16} /> Article Content
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          style={{ padding: '12px 20px', border: 'none', backgroundColor: 'transparent', borderBottom: activeTab === 'seo' ? '3px solid #1E3A8A' : '3px solid transparent', color: activeTab === 'seo' ? (isDark ? '#60A5FA' : '#1E3A8A') : (isDark ? '#94A3B8' : '#64748B'), fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Globe size={16} /> SEO &amp; Social Cards
        </button>

        {isEditing && (
          <button
            onClick={() => setActiveTab('history')}
            style={{ padding: '12px 20px', border: 'none', backgroundColor: 'transparent', borderBottom: activeTab === 'history' ? '3px solid #1E3A8A' : '3px solid transparent', color: activeTab === 'history' ? (isDark ? '#60A5FA' : '#1E3A8A') : (isDark ? '#94A3B8' : '#64748B'), fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <History size={16} /> Revision History ({revisions.length})
          </button>
        )}
      </div>

      {/* TAB 1: ARTICLE CONTENT & BASIC METADATA */}
      {activeTab === 'editor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          
          {/* Main Content Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Title & Slug */}
            <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '8px' }}>
                Article Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Top 5 Security Measures Every Indian Housing Society Must Implement"
                value={title}
                onChange={handleTitleChange}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '16px', fontWeight: '700', outline: 'none', marginBottom: '16px' }}
              />

              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '6px' }}>
                URL Permalink Slug *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: '600', fontFamily: 'monospace' }}>gatelink.in/blog/</span>
                <input
                  type="text"
                  placeholder="top-5-security-measures"
                  value={slug}
                  onChange={handleSlugChange}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '8px' }}>
                Article Excerpt (Summary for Cards &amp; Search) *
              </label>
              <textarea
                rows={3}
                placeholder="A compelling 2-sentence summary describing what readers will learn..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', outline: 'none', resize: 'vertical' }}
              />
            </div>

            {/* TipTap Rich Text Editor Container */}
            <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, overflow: 'hidden' }}>
              <EditorMenuBar 
                editor={editor} 
                isDark={isDark} 
                onOpenMediaPicker={handleOpenMediaPicker} 
              />
              <div style={{ padding: '24px', minHeight: '380px', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '16px', lineHeight: '1.7' }}>
                <EditorContent editor={editor} />
              </div>
            </div>

          </div>

          {/* Sidebar Metadata Column */}
          <ArticleSidebarSettings
            isDark={isDark}
            categoryId={categoryId}
            handleCategorySelect={handleCategorySelect}
            categories={categories}
            authorId={authorId}
            handleAuthorSelect={handleAuthorSelect}
            authors={authors}
            tagsInput={tagsInput}
            setTagsInput={setTagsInput}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            setOgImage={setOgImage}
            uploadingImage={uploadingImage}
            handleImageUpload={handleImageUpload}
          />
        </div>
      )}

      {/* TAB 2: SEO & SOCIAL CARDS */}
      {activeTab === 'seo' && (
        <ArticleSeoSettings
          isDark={isDark}
          title={title}
          slug={slug}
          excerpt={excerpt}
          seoTitle={seoTitle}
          setSeoTitle={setSeoTitle}
          seoDescription={seoDescription}
          setSeoDescription={setSeoDescription}
          canonicalUrl={canonicalUrl}
          setCanonicalUrl={setCanonicalUrl}
        />
      )}

      {/* TAB 3: REVISION HISTORY */}
      {activeTab === 'history' && (
        <ArticleRevisionsModal
          isDark={isDark}
          revisions={revisions}
          onRestoreRevision={handleRestoreRevision}
        />
      )}

      {/* Media Picker Modal */}
      <MediaLibraryModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        isDark={isDark}
        mediaLibrary={mediaLibrary}
        onSelectMedia={handleInsertMediaToEditor}
      />

    </div>
  );
}
