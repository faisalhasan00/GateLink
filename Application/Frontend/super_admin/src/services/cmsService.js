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
import { db, storage } from '../firebase';

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
    console.error('Error checking slug uniqueness:', err);
    return false;
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

    // Perform lightweight in-memory text filter if search query present
    let filtered = articles;
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      filtered = articles.filter(a => 
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
    console.error('Error fetching CMS articles:', err);
    throw err;
  }
}

/**
 * Fetch single article by ID
 */
export async function getArticleById(articleId) {
  try {
    const docRef = doc(db, 'articles', articleId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (err) {
    console.error(`Error fetching article ${articleId}:`, err);
    throw err;
  }
}

/**
 * Create a new draft article
 */
export async function createArticle(articleData, userEmail = 'System Admin') {
  try {
    const rawSlug = articleData.slug ? generateSlug(articleData.slug) : generateSlug(articleData.title);
    const unique = await isSlugUnique(rawSlug);
    const finalSlug = unique ? rawSlug : `${rawSlug}-${Date.now().toString().slice(-4)}`;

    const newDocRef = doc(collection(db, 'articles'));
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: articleData.status === 'Published' ? serverTimestamp() : null,
      createdBy: userEmail,
      updatedBy: userEmail,
      publishedBy: articleData.status === 'Published' ? userEmail : null,
    };

    await setDoc(newDocRef, payload);

    // Save initial revision
    await saveRevision(newDocRef.id, payload, userEmail, 'Initial Draft Created');

    // Audit Log
    await logCmsAuditAction({
      action: 'cms_article_created',
      entityId: newDocRef.id,
      performedBy: userEmail,
      payloadSummary: `Created article: "${payload.title}" (${payload.status})`
    });

    return { id: newDocRef.id, ...payload };
  } catch (err) {
    console.error('Error creating article:', err);
    throw err;
  }
}

/**
 * Update an existing article
 */
export async function updateArticle(articleId, updateData, userEmail = 'System Admin', revisionNote = 'Updated article') {
  try {
    const docRef = doc(db, 'articles', articleId);
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      throw new Error('Article does not exist.');
    }
    const existing = existingSnap.data();

    let finalSlug = existing.slug;
    if (updateData.slug && updateData.slug !== existing.slug) {
      const formattedSlug = generateSlug(updateData.slug);
      const unique = await isSlugUnique(formattedSlug, articleId);
      if (!unique) {
        throw new Error(`Slug "${formattedSlug}" is already in use by another article.`);
      }
      finalSlug = formattedSlug;
    }

    const payload = {
      ...updateData,
      slug: finalSlug,
      updatedAt: serverTimestamp(),
      updatedBy: userEmail,
    };

    if (updateData.status === 'Published' && existing.status !== 'Published') {
      payload.publishedAt = serverTimestamp();
      payload.publishedBy = userEmail;
    }

    await updateDoc(docRef, payload);

    // Save automatic revision
    const fullSnap = await getDoc(docRef);
    await saveRevision(articleId, fullSnap.data(), userEmail, revisionNote);

    // Audit Log
    await logCmsAuditAction({
      action: 'cms_article_updated',
      entityId: articleId,
      performedBy: userEmail,
      payloadSummary: `Updated article: "${payload.title || existing.title}" (${payload.status || existing.status})`
    });

    return { id: articleId, ...payload };
  } catch (err) {
    console.error(`Error updating article ${articleId}:`, err);
    throw err;
  }
}

/**
 * Delete an article (Requires content.delete permission)
 */
export async function deleteArticle(articleId, userEmail = 'System Admin') {
  try {
    const docRef = doc(db, 'articles', articleId);
    const snap = await getDoc(docRef);
    const title = snap.exists() ? snap.data().title : articleId;

    await deleteDoc(docRef);

    await logGlobalAuditAction({
      action: 'cms_article_deleted',
      entityId: articleId,
      performedBy: userEmail,
      payloadSummary: `Deleted article: "${title}"`
    });

    return true;
  } catch (err) {
    console.error(`Error deleting article ${articleId}:`, err);
    throw err;
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

export async function getCategories() {
  try {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      // Seed default categories if empty
      const defaultCategories = [
        { name: 'Society Management', slug: 'society-management', description: 'RWA operations, committee bylaws, and administrative best practices.' },
        { name: 'Visitor Management', slug: 'visitor-management', description: 'Gate security perimeters, QR passes, and guest check-ins.' },
        { name: 'Security', slug: 'security', description: 'Guard protocols, emergency SOS sirens, and resident safety.' },
        { name: 'Maintenance & Finance', slug: 'finance', description: 'Automated invoicing, online payments, GST receipts, and auditing.' },
        { name: 'Governance & Bylaws', slug: 'governance', description: 'Legal compliance, registrar rules, and society elections.' },
        { name: 'Technology & AI', slug: 'tech-ai', description: 'Smart gate IoT integration and community living tech trends.' }
      ];
      for (const cat of defaultCategories) {
        const ref = doc(collection(db, 'categories'));
        await setDoc(ref, { ...cat, createdAt: serverTimestamp() });
      }
      const newSnap = await getDocs(q);
      return newSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
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
    console.error('Error creating category:', err);
    throw err;
  }
}

export async function getAuthors() {
  try {
    const q = query(collection(db, 'authors'), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      const defaultAuthors = [
        { name: 'Mohammed Faisal Hasan', role: 'Founder & CEO', bio: 'Building GateLink SaaS platform for gated communities across India.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        { name: 'Priya Sharma', role: 'Financial Operations Lead', bio: 'Expert in RWA treasury management and automated society billing.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
        { name: 'Anand Verma', role: 'Security Compliance Specialist', bio: 'Ex-military security consultant advising residential complexes.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
      ];
      for (const aut of defaultAuthors) {
        const ref = doc(collection(db, 'authors'));
        await setDoc(ref, { ...aut, createdAt: serverTimestamp() });
      }
      const newSnap = await getDocs(q);
      return newSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching authors:', err);
    return [];
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

  try {
    const filename = `${Date.now()}_${file.name.replace(/[^\w.-]/g, '_')}`;
    const storagePath = `cms_media/${filename}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Save metadata record in Firestore
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

          await setDoc(docRef, mediaRecord);

          await logGlobalAuditAction({
            action: 'cms_media_uploaded',
            entityId: docRef.id,
            performedBy: userEmail,
            payloadSummary: `Uploaded media: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
          });

          resolve({ id: docRef.id, ...mediaRecord });
        }
      );
    });
  } catch (err) {
    console.error('Error uploading media asset:', err);
    throw err;
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
