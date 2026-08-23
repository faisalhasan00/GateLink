import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { 
  Save, 
  ArrowLeft, 
  Globe, 
  Eye, 
  Send, 
  CheckCircle, 
  Archive, 
  Clock, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  FileText, 
  Search, 
  Sparkles,
  History,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  getArticleById, 
  createArticle, 
  updateArticle, 
  generateSlug, 
  isSlugUnique, 
  getCategories, 
  getAuthors, 
  getArticleRevisions, 
  getMediaLibrary,
  uploadMedia 
} from '../../services/cmsService';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useTheme } from '../../context/ThemeContext';

export default function CmsArticleEditor() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { hasPermission, user } = useSuperAdminAuth();

  const isEditing = Boolean(articleId);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'seo' | 'history'

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [status, setStatus] = useState('Draft');

  // SEO State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);

  // Aux Data
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const canPublish = hasPermission('content.publish');
  const canEdit = hasPermission('content.edit');

  // Initialize TipTap Rich Text Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension.configure({ inline: true }),
    ],
    content: '<p>Write your SaaS article content here...</p>',
  });

  useEffect(() => {
    loadAuxData();
  }, []);

  const loadAuxData = async () => {
    try {
      const [catsRes, authorsRes] = await Promise.all([getCategories(), getAuthors()]);
      setCategories(catsRes);
      setAuthors(authorsRes);

      if (catsRes.length > 0) {
        setCategoryId(catsRes[0].id);
        setCategoryName(catsRes[0].name);
      }
      if (authorsRes.length > 0) {
        setAuthorId(authorsRes[0].id);
        setAuthorName(authorsRes[0].name);
        setAuthorAvatar(authorsRes[0].avatar || '');
      }

      if (isEditing) {
        await loadExistingArticle(catsRes, authorsRes);
      }
    } catch (err) {
      console.error('Error loading editor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingArticle = async (loadedCats, loadedAuthors) => {
    const article = await getArticleById(articleId);
    if (!article) {
      alert('Article not found.');
      navigate('/cms');
      return;
    }

    setTitle(article.title || '');
    setSlug(article.slug || '');
    setIsCustomSlug(true);
    setExcerpt(article.excerpt || '');
    setCoverImage(article.coverImage || '');
    setCoverImageAlt(article.coverImageAlt || '');
    setCategoryId(article.categoryId || (loadedCats[0]?.id || ''));
    setCategoryName(article.categoryName || (loadedCats[0]?.name || 'General'));
    setTagsInput((article.tags || []).join(', '));
    setAuthorId(article.authorId || (loadedAuthors[0]?.id || ''));
    setAuthorName(article.authorName || (loadedAuthors[0]?.name || 'Admin'));
    setAuthorAvatar(article.authorAvatar || '');
    setStatus(article.status || 'Draft');

    setSeoTitle(article.seoTitle || article.title || '');
    setSeoDescription(article.seoDescription || article.excerpt || '');
    setCanonicalUrl(article.canonicalUrl || `https://gatelink.in/blog/${article.slug}`);
    setOgTitle(article.ogTitle || article.title || '');
    setOgDescription(article.ogDescription || article.excerpt || '');
    setOgImage(article.ogImage || article.coverImage || '');
    setRobotsIndex(article.robotsIndex !== false);

    if (editor && article.content) {
      editor.commands.setContent(article.content);
    }

    // Load revisions
    const revs = await getArticleRevisions(articleId);
    setRevisions(revs);
  };

  // Sync title to slug dynamically if not custom-edited
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isCustomSlug) {
      const generated = generateSlug(newTitle);
      setSlug(generated);
      setCanonicalUrl(`https://gatelink.in/blog/${generated}`);
    }
  };

  const handleSlugChange = (e) => {
    setIsCustomSlug(true);
    const val = generateSlug(e.target.value);
    setSlug(val);
    setCanonicalUrl(`https://gatelink.in/blog/${val}`);
  };

  const handleCategorySelect = (catId) => {
    setCategoryId(catId);
    const catObj = categories.find(c => c.id === catId);
    if (catObj) setCategoryName(catObj.name);
  };

  const handleAuthorSelect = (autId) => {
    setAuthorId(autId);
    const autObj = authors.find(a => a.id === autId);
    if (autObj) {
      setAuthorName(autObj.name);
      setAuthorAvatar(autObj.avatar || '');
    }
  };

  const handleOpenMediaPicker = async () => {
    setShowMediaPicker(true);
    const mediaRes = await getMediaLibrary();
    setMediaLibrary(mediaRes);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploaded = await uploadMedia(file, file.name, user?.email || 'Admin');
      setMediaLibrary(prev => [uploaded, ...prev]);
      setCoverImage(uploaded.url);
      setOgImage(uploaded.url);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInsertMediaToEditor = (url) => {
    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
      setShowMediaPicker(false);
    }
  };

  const validateForPublishing = () => {
    const errors = [];
    if (!title.trim()) errors.push('Article Title is required.');
    if (!slug.trim()) errors.push('SEO Slug is required.');
    if (!excerpt.trim()) errors.push('Article Excerpt is required for SEO.');
    const contentHtml = editor ? editor.getHTML() : '';
    if (!contentHtml || contentHtml === '<p></p>') errors.push('Article body content is required.');
    if (!coverImage) errors.push('Cover Image is strongly recommended for social cards.');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async (targetStatus = status) => {
    setSaving(true);
    setValidationErrors([]);

    if (targetStatus === 'Published') {
      if (!canPublish) {
        alert('Access Denied: You do not have permission to publish live articles.');
        setSaving(false);
        return;
      }
      const isValid = validateForPublishing();
      if (!isValid) {
        setSaving(false);
        return;
      }
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const htmlContent = editor ? editor.getHTML() : '';

    const payload = {
      title,
      slug,
      excerpt,
      content: htmlContent,
      coverImage,
      coverImageAlt,
      categoryId,
      categoryName,
      tags: tagsArray,
      authorId,
      authorName,
      authorAvatar,
      status: targetStatus,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      canonicalUrl: canonicalUrl || `https://gatelink.in/blog/${slug}`,
      ogTitle: ogTitle || seoTitle || title,
      ogDescription: ogDescription || seoDescription || excerpt,
      ogImage: ogImage || coverImage,
      robotsIndex
    };

    try {
      if (isEditing) {
        await updateArticle(articleId, payload, user?.email || 'Super Admin', `Updated article (${targetStatus})`);
        setStatus(targetStatus);
        alert(`Article successfully saved as ${targetStatus}!`);
      } else {
        const created = await createArticle(payload, user?.email || 'Super Admin');
        alert(`Article created successfully as ${targetStatus}!`);
        navigate(`/cms/editor/${created.id}`);
      }
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

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
          <Globe size={16} /> SEO & Social Cards
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
                Article Excerpt (Summary for Cards & Search) *
              </label>
              <textarea
                rows={3}
                placeholder="A compelling 2-sentence summary describing what readers will learn..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', outline: 'none', resize: 'vertical' }}
              />
            </div>

            {/* TipTap Rich Text Editor */}
            <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, overflow: 'hidden' }}>
              
              {/* Editor Toolbar */}
              <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor?.isActive('bold') ? '#1E3A8A' : 'transparent', color: editor?.isActive('bold') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
                >
                  <Bold size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor?.isActive('italic') ? '#1E3A8A' : 'transparent', color: editor?.isActive('italic') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
                >
                  <Italic size={16} />
                </button>

                <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#334155' : '#CBD5E1' }} />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor?.isActive('heading', { level: 2 }) ? '#1E3A8A' : 'transparent', color: editor?.isActive('heading', { level: 2 }) ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
                >
                  <Heading2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor?.isActive('heading', { level: 3 }) ? '#1E3A8A' : 'transparent', color: editor?.isActive('heading', { level: 3 }) ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
                >
                  <Heading3 size={16} />
                </button>

                <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#334155' : '#CBD5E1' }} />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor?.isActive('bulletList') ? '#1E3A8A' : 'transparent', color: editor?.isActive('bulletList') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
                >
                  <List size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor?.isActive('orderedList') ? '#1E3A8A' : 'transparent', color: editor?.isActive('orderedList') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
                >
                  <ListOrdered size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor?.isActive('blockquote') ? '#1E3A8A' : 'transparent', color: editor?.isActive('blockquote') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
                >
                  <Quote size={16} />
                </button>

                <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#334155' : '#CBD5E1' }} />

                <button
                  type="button"
                  onClick={handleOpenMediaPicker}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: isDark ? '#334155' : '#E2E8F0', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}
                >
                  <ImageIcon size={16} /> Insert Media
                </button>

                <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#334155' : '#CBD5E1' }} />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer' }}
                >
                  <Undo size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer' }}
                >
                  <Redo size={16} />
                </button>
              </div>

              {/* TipTap Editable Workspace Area */}
              <div style={{ padding: '24px', minHeight: '380px', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '16px', lineHeight: '1.7' }}>
                <EditorContent editor={editor} />
              </div>
            </div>

          </div>

          {/* Sidebar Metadata Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Category & Author Settings */}
            <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '20px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 16px 0' }}>
                Organization & Metadata
              </h3>

              {/* Category Dropdown */}
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
                Primary Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleCategorySelect(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', marginBottom: '16px' }}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Author Dropdown */}
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
                Author Profile *
              </label>
              <select
                value={authorId}
                onChange={(e) => handleAuthorSelect(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', marginBottom: '16px' }}
              >
                {authors.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                ))}
              </select>

              {/* Tags Input */}
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="QR Visitor, RWA Billing, Gate Security"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '13px' }}
              />
            </div>

            {/* Featured Cover Image */}
            <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '20px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 16px 0' }}>
                Featured Cover Image
              </h3>

              {coverImage ? (
                <div style={{ position: 'relative', marginBottom: '12px', borderRadius: '10px', overflow: 'hidden' }}>
                  <img src={coverImage} alt="Cover Preview" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <button
                    onClick={() => setCoverImage('')}
                    style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div style={{ border: `2px dashed ${isDark ? '#334155' : '#CBD5E1'}`, borderRadius: '10px', padding: '24px 16px', textAlign: 'center', marginBottom: '12px' }}>
                  <ImageIcon size={32} style={{ color: '#94A3B8', marginBottom: '8px' }} />
                  <p style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 12px 0' }}>
                    Upload cover image for blog cards & social preview
                  </p>
                  <label style={{ padding: '8px 16px', backgroundColor: '#1E3A8A', color: '#FFF', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                    {uploadingImage ? 'Uploading...' : 'Browse Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              )}

              <input
                type="text"
                placeholder="Or paste Image URL..."
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setOgImage(e.target.value);
                }}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '12px' }}
              />
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: SEO & SOCIAL CARDS */}
      {activeTab === 'seo' && (
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
      )}

      {/* TAB 3: REVISION HISTORY */}
      {activeTab === 'history' && (
        <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 16px 0' }}>
            Article Revision History & Point-in-Time Restore
          </h3>

          {revisions.length === 0 ? (
            <p style={{ color: '#94A3B8' }}>No saved revisions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {revisions.map((rev) => (
                <div key={rev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '12px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
                  <div>
                    <div style={{ fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px' }}>
                      {rev.note || 'Saved Version'}
                    </div>
                    <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                      Saved by {rev.savedBy} on {rev.savedAt?.toDate ? rev.savedAt.toDate().toLocaleString('en-IN') : 'Recent'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTitle(rev.title || '');
                      setExcerpt(rev.excerpt || '');
                      if (editor && rev.content) editor.commands.setContent(rev.content);
                      alert('Restored revision content into workspace!');
                    }}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#1E3A8A', color: '#FFF', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFF', padding: '24px', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '80vh', overflowY: 'auto', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Media Library Selector</h3>
              <button onClick={() => setShowMediaPicker(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              {mediaLibrary.map((med) => (
                <div
                  key={med.id}
                  onClick={() => handleInsertMediaToEditor(med.url)}
                  style={{ border: `2px solid ${isDark ? '#334155' : '#E2E8F0'}`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <img src={med.url} alt={med.filename} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                  <div style={{ padding: '6px', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {med.filename}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
