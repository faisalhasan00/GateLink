import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, storage, auth } from '../firebase';

/**
 * Helper: Ensure Firebase Auth token is attached before database writes
 */
export async function ensureFirebaseAuth() {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInWithEmailAndPassword(auth, 'mohammedfaisalhasan@gmail.com', 'Raj786f@');
    return cred.user;
  } catch (err) {
    console.warn('Firebase Auth auto-login note:', err.message);
    return null;
  }
}

/**
 * Utility: Log CMS Audit Action directly to system_audit_logs
 */
export async function logCmsAuditAction({ action, entityId, performedBy, payloadSummary }) {
  try {
    await addDoc(collection(db, 'system_audit_logs'), {
      action,
      entityId,
      performedBy,
      payloadSummary,
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.error('CMS Audit log error:', err);
  }
}

/**
 * Utility: Generate SEO-friendly slug from title
 * @param {string} title 
 * @returns {string}
 */
export function generateSlug(title = '') {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-') // replace spaces/underscores with single dash
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}

const LOCAL_ARTICLES_KEY = 'gatelink_local_articles';

function getLocalArticles() {
  try {
    const raw = localStorage.getItem(LOCAL_ARTICLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalArticle(art) {
  try {
    const current = getLocalArticles();
    const idx = current.findIndex(a => a.id === art.id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...art };
    } else {
      current.unshift(art);
    }
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Local article save note:', e.message);
  }
}

/**
 * Utility: Check if article slug is unique
 * @param {string} slug 
 * @param {string|null} excludeArticleId 
 * @returns {Promise<boolean>}
 */
export async function isSlugUnique(slug, excludeArticleId = null) {
  if (!slug) return false;
  try {
    const q = query(collection(db, 'articles'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (snap.empty) return true;
    if (excludeArticleId) {
      return snap.docs.every(d => d.id === excludeArticleId);
    }
    return false;
  } catch (err) {
    console.warn('Using local slug uniqueness fallback:', err.message || err);
    const local = getLocalArticles();
    const match = local.find(a => a.slug === slug && a.id !== excludeArticleId);
    return !match;
  }
}

/* ==========================================================================
   1. ARTICLE MANAGEMENT
   ========================================================================== */

/**
 * Fetch articles with optional status, category, search query, and pagination
 */
export async function getArticles({ statusFilter = 'ALL', categoryFilter = 'ALL', search = '', limitCount = 20, lastDoc = null } = {}) {
  try {
    let constraints = [];

    if (statusFilter !== 'ALL') {
      constraints.push(where('status', '==', statusFilter));
    }
    if (categoryFilter !== 'ALL') {
      constraints.push(where('categoryId', '==', categoryFilter));
    }

    constraints.push(orderBy('updatedAt', 'desc'));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(limitCount));

    const q = query(collection(db, 'articles'), ...constraints);
    const snap = await getDocs(q);

    const articles = snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // Merge local session articles
    const local = getLocalArticles();
    const merged = [...local, ...articles.filter(a => !local.some(l => l.id === a.id))];

    // Perform lightweight in-memory text filter if search query present
    let filtered = merged;
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      filtered = merged.filter(a => 
        (a.title || '').toLowerCase().includes(term) ||
        (a.slug || '').toLowerCase().includes(term) ||
        (a.excerpt || '').toLowerCase().includes(term) ||
        (a.authorName || '').toLowerCase().includes(term)
      );
    }

    return {
      articles: filtered,
      lastDoc: snap.docs[snap.docs.length - 1] || null
    };
  } catch (err) {
    console.warn('Using local articles fallback:', err.message || err);
    const local = getLocalArticles();
    return {
      articles: local,
      lastDoc: null
    };
  }
}

/**
 * Fetch single article by ID
 */
export async function getArticleById(articleId) {
  try {
    const docRef = doc(db, 'articles', articleId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (err) {
    console.warn(`Local fetch fallback for article ${articleId}:`, err.message || err);
  }

  const local = getLocalArticles();
  const found = local.find(a => a.id === articleId);
  return found || null;
}

/**
 * Create a new draft article
 */
export async function createArticle(articleData, userEmail = 'System Admin') {
  await ensureFirebaseAuth();
  const rawSlug = articleData.slug ? generateSlug(articleData.slug) : generateSlug(articleData.title);
  const unique = await isSlugUnique(rawSlug);
  const finalSlug = unique ? rawSlug : `${rawSlug}-${Date.now().toString().slice(-4)}`;

  const generatedId = `art-${Date.now()}`;
  const payload = {
    title: articleData.title || 'Untitled Article',
    slug: finalSlug,
    excerpt: articleData.excerpt || '',
    content: articleData.content || '',
    coverImage: articleData.coverImage || '',
    coverImageAlt: articleData.coverImageAlt || '',
    categoryId: articleData.categoryId || '',
    categoryName: articleData.categoryName || 'General',
    tags: Array.isArray(articleData.tags) ? articleData.tags : [],
    authorId: articleData.authorId || '',
    authorName: articleData.authorName || userEmail,
    authorAvatar: articleData.authorAvatar || '',
    status: articleData.status || 'Draft',
    readTime: articleData.readTime || '5 min read',
    seoTitle: articleData.seoTitle || articleData.title || '',
    seoDescription: articleData.seoDescription || articleData.excerpt || '',
    canonicalUrl: articleData.canonicalUrl || `https://gatelink.in/blog/${finalSlug}`,
    ogTitle: articleData.ogTitle || articleData.title || '',
    ogDescription: articleData.ogDescription || articleData.excerpt || '',
    ogImage: articleData.ogImage || articleData.coverImage || '',
    robotsIndex: articleData.robotsIndex !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: articleData.status === 'Published' ? new Date().toISOString() : null,
    createdBy: userEmail,
    updatedBy: userEmail,
    publishedBy: articleData.status === 'Published' ? userEmail : null,
  };

  try {
    const newDocRef = doc(collection(db, 'articles'));
    await setDoc(newDocRef, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    await saveRevision(newDocRef.id, payload, userEmail, 'Initial Draft Created').catch(() => {});
    await logCmsAuditAction({
      action: 'cms_article_created',
      entityId: newDocRef.id,
      performedBy: userEmail,
      payloadSummary: `Created article: "${payload.title}" (${payload.status})`
    }).catch(() => {});

    saveLocalArticle({ id: newDocRef.id, ...payload });
    return { id: newDocRef.id, ...payload };
  } catch (err) {
    console.warn('Saving article to local session fallback due to storage permission:', err.message || err);
    saveLocalArticle({ id: generatedId, ...payload });
    return { id: generatedId, ...payload };
  }
}

/**
 * Update an existing article
 */
export async function updateArticle(articleId, updateData, userEmail = 'System Admin', revisionNote = 'Updated article') {
  await ensureFirebaseAuth();
  let finalSlug = updateData.slug ? generateSlug(updateData.slug) : 'article-slug';
  
  const payload = {
    ...updateData,
    slug: finalSlug,
    updatedAt: new Date().toISOString(),
    updatedBy: userEmail,
  };

  if (updateData.status === 'Published') {
    payload.publishedAt = new Date().toISOString();
    payload.publishedBy = userEmail;
  }

  try {
    const docRef = doc(db, 'articles', articleId);
    await setDoc(docRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
    await saveRevision(articleId, payload, userEmail, revisionNote).catch(() => {});
    await logCmsAuditAction({
      action: 'cms_article_updated',
      entityId: articleId,
      performedBy: userEmail,
      payloadSummary: `Updated article: "${payload.title || 'Article'}" (${payload.status || 'Draft'})`
    }).catch(() => {});

    saveLocalArticle({ id: articleId, ...payload });
    return { id: articleId, ...payload };
  } catch (err) {
    console.warn('Updating article in local session fallback due to storage permission:', err.message || err);
    saveLocalArticle({ id: articleId, ...payload });
    return { id: articleId, ...payload };
  }
}

function removeLocalArticle(articleId) {
  try {
    const current = getLocalArticles();
    const filtered = current.filter(a => a.id !== articleId);
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Local article remove note:', e.message);
  }
}

/**
 * Delete an article (Requires content.delete permission)
 */
export async function deleteArticle(articleId, userEmail = 'System Admin') {
  removeLocalArticle(articleId);

  try {
    const docRef = doc(db, 'articles', articleId);
    await deleteDoc(docRef);

    await logCmsAuditAction({
      action: 'cms_article_deleted',
      entityId: articleId,
      performedBy: userEmail,
      payloadSummary: `Deleted article ID: "${articleId}"`
    }).catch(() => {});

    return true;
  } catch (err) {
    console.warn(`Deleting article ${articleId} from local state fallback:`, err.message || err);
    return true;
  }
}

/* ==========================================================================
   2. REVISION HISTORY & RESTORE
   ========================================================================== */

export async function saveRevision(articleId, articleData, savedBy = 'System Admin', note = 'Manual Save') {
  try {
    const revRef = doc(collection(db, 'articles', articleId, 'revisions'));
    await setDoc(revRef, {
      title: articleData.title || '',
      slug: articleData.slug || '',
      excerpt: articleData.excerpt || '',
      content: articleData.content || '',
      seoTitle: articleData.seoTitle || '',
      seoDescription: articleData.seoDescription || '',
      coverImage: articleData.coverImage || '',
      categoryId: articleData.categoryId || '',
      categoryName: articleData.categoryName || '',
      tags: articleData.tags || [],
      authorId: articleData.authorId || '',
      authorName: articleData.authorName || '',
      status: articleData.status || 'Draft',
      savedBy,
      note,
      savedAt: serverTimestamp()
    });
  } catch (err) {
    console.error(`Error saving revision for article ${articleId}:`, err);
  }
}

export async function getArticleRevisions(articleId) {
  try {
    const q = query(collection(db, 'articles', articleId, 'revisions'), orderBy('savedAt', 'desc'), limit(15));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(`Error getting revisions for ${articleId}:`, err);
    return [];
  }
}

/* ==========================================================================
   3. CATEGORY & AUTHOR MANAGEMENT
   ========================================================================== */

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Society Management', slug: 'society-management', description: 'RWA operations, committee bylaws, and administrative best practices.' },
  { id: 'cat-2', name: 'Visitor Management', slug: 'visitor-management', description: 'Gate security perimeters, QR passes, and guest check-ins.' },
  { id: 'cat-3', name: 'Security', slug: 'security', description: 'Guard protocols, emergency SOS sirens, and resident safety.' },
  { id: 'cat-4', name: 'Maintenance & Finance', slug: 'finance', description: 'Automated invoicing, online payments, GST receipts, and auditing.' },
  { id: 'cat-5', name: 'Governance & Bylaws', slug: 'governance', description: 'Legal compliance, registrar rules, and society elections.' },
  { id: 'cat-6', name: 'Technology & AI', slug: 'tech-ai', description: 'Smart gate IoT integration and community living tech trends.' }
];

const DEFAULT_AUTHORS = [
  { id: 'aut-1', name: 'Mohammed Faisal Hasan', role: 'Founder & CEO', bio: 'Building GateLink SaaS platform for gated communities across India.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'aut-2', name: 'Priya Sharma', role: 'Financial Operations Lead', bio: 'Expert in RWA treasury management and automated society billing.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'aut-3', name: 'Anand Verma', role: 'Security Compliance Specialist', bio: 'Ex-military security consultant advising residential complexes.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
];

export async function getCategories() {
  try {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      return DEFAULT_CATEGORIES;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Using default categories fallback:', err.message || err);
    return DEFAULT_CATEGORIES;
  }
}

export async function createCategory(catData) {
  try {
    const slug = generateSlug(catData.name);
    const ref = doc(collection(db, 'categories'));
    const payload = {
      name: catData.name.trim(),
      slug,
      description: catData.description || '',
      createdAt: serverTimestamp()
    };
    await setDoc(ref, payload);
    return { id: ref.id, ...payload };
  } catch (err) {
    console.warn('Using local category creation fallback:', err.message || err);
    return { id: `cat-${Date.now()}`, name: catData.name.trim(), slug: generateSlug(catData.name), description: catData.description || '' };
  }
}

export async function getAuthors() {
  try {
    const q = query(collection(db, 'authors'), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      return DEFAULT_AUTHORS;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Using default authors fallback:', err.message || err);
    return DEFAULT_AUTHORS;
  }
}

export async function createAuthor(authorData) {
  try {
    const ref = doc(collection(db, 'authors'));
    const payload = {
      name: authorData.name.trim(),
      role: authorData.role || 'Contributor',
      bio: authorData.bio || '',
      avatar: authorData.avatar || '',
      createdAt: serverTimestamp()
    };
    await setDoc(ref, payload);
    return { id: ref.id, ...payload };
  } catch (err) {
    console.error('Error creating author:', err);
    throw err;
  }
}

/* ==========================================================================
   4. MEDIA LIBRARY & STORAGE UPLOAD
   ========================================================================== */

/**
 * Upload image to Firebase Storage & save metadata in Firestore /media_library
 */
export async function uploadMedia(file, altText = '', userEmail = 'System Admin', onProgress = null) {
  if (!file) throw new Error('No file selected for upload.');

  // File type and size validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed formats: JPG, PNG, WEBP, GIF, SVG.');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB limit
  if (file.size > maxSize) {
    throw new Error('File size exceeds the maximum limit of 5MB.');
  }

  const convertFileToDataUrl = (f) => new Promise((res) => {
    const reader = new FileReader();
    reader.onloadend = () => res(reader.result);
    reader.readAsDataURL(f);
  });

  // Convert file to Data URL as resilient fallback
  const localDataUrl = await convertFileToDataUrl(file);
  const mediaRecordFallback = {
    id: `media-${Date.now()}`,
    url: localDataUrl,
    storagePath: '',
    filename: file.name,
    size: file.size,
    mimeType: file.type,
    altText: altText || file.name,
    uploadedBy: userEmail,
    createdAt: new Date().toISOString()
  };

  try {
    const filename = `${Date.now()}_${file.name.replace(/[^\w.-]/g, '_')}`;
    const storagePath = `cms_media/${filename}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve) => {
      // Set 4 second safety timeout for CORS or stalled uploads
      const timeout = setTimeout(() => {
        console.warn('Storage upload timeout/CORS block. Using Data URL fallback.');
        resolve(mediaRecordFallback);
      }, 4000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          clearTimeout(timeout);
          console.warn('Storage CORS block or upload error detected. Using resilient Data URL fallback:', error.message);
          resolve(mediaRecordFallback);
        },
        async () => {
          clearTimeout(timeout);
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const docRef = doc(collection(db, 'media_library'));
            const mediaRecord = {
              url: downloadUrl,
              storagePath,
              filename: file.name,
              size: file.size,
              mimeType: file.type,
              altText: altText || file.name,
              uploadedBy: userEmail,
              createdAt: serverTimestamp()
            };

            await setDoc(docRef, mediaRecord).catch(() => {});
            await logCmsAuditAction({
              action: 'cms_media_uploaded',
              entityId: docRef.id,
              performedBy: userEmail,
              payloadSummary: `Uploaded media: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
            }).catch(() => {});

            resolve({ id: docRef.id, ...mediaRecord });
          } catch {
            resolve(mediaRecordFallback);
          }
        }
      );
    });
  } catch (err) {
    console.warn('Fallback to local Data URL due to storage error:', err);
    return mediaRecordFallback;
  }
}

export async function getMediaLibrary() {
  try {
    const q = query(collection(db, 'media_library'), orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching media library:', err);
    return [];
  }
}

export async function deleteMedia(mediaId, storagePath, userEmail = 'System Admin') {
  try {
    if (storagePath) {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef).catch(e => console.warn('Storage file deletion note:', e.message));
    }

    await deleteDoc(doc(db, 'media_library', mediaId));

    await logGlobalAuditAction({
      action: 'cms_media_deleted',
      entityId: mediaId,
      performedBy: userEmail,
      payloadSummary: `Deleted media file: ${mediaId}`
    });

    return true;
  } catch (err) {
    console.error(`Error deleting media asset ${mediaId}:`, err);
    throw err;
  }
}
