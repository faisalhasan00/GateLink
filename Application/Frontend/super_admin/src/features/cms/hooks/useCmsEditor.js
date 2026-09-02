import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import { 
  getArticleById, 
  createArticle, 
  updateArticle, 
  generateSlug, 
  getCategories, 
  getAuthors, 
  getArticleRevisions, 
  getMediaLibrary,
  uploadMedia 
} from '../../../services/cmsService';
import { useSuperAdminAuth } from '../../../context/SuperAdminAuthContext';

export function useCmsEditor() {
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

  const handleRestoreRevision = (rev) => {
    setTitle(rev.title || '');
    setExcerpt(rev.excerpt || '');
    if (editor && rev.content) editor.commands.setContent(rev.content);
    alert('Restored revision content into workspace!');
  };

  return {
    navigate,
    isEditing,
    loading,
    saving,
    activeTab,
    setActiveTab,
    title,
    setTitle,
    slug,
    setSlug,
    handleTitleChange,
    handleSlugChange,
    excerpt,
    setExcerpt,
    coverImage,
    setCoverImage,
    coverImageAlt,
    setCoverImageAlt,
    categoryId,
    categoryName,
    handleCategorySelect,
    tagsInput,
    setTagsInput,
    authorId,
    authorName,
    authorAvatar,
    handleAuthorSelect,
    status,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    canonicalUrl,
    setCanonicalUrl,
    ogTitle,
    setOgTitle,
    ogDescription,
    setOgDescription,
    ogImage,
    setOgImage,
    robotsIndex,
    setRobotsIndex,
    categories,
    authors,
    revisions,
    mediaLibrary,
    showMediaPicker,
    setShowMediaPicker,
    uploadingImage,
    validationErrors,
    canPublish,
    canEdit,
    editor,
    handleOpenMediaPicker,
    handleImageUpload,
    handleInsertMediaToEditor,
    handleSave,
    handleRestoreRevision,
  };
}
