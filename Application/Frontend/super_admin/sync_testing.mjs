import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const prodConfig = {
  apiKey: "AIzaSyAEqP0hDR5zhpflZ7zTgwk5RxSulpyEwtA",
  authDomain: "societysphere-b2538.firebaseapp.com",
  projectId: "societysphere-b2538",
  storageBucket: "societysphere-b2538.firebasestorage.app",
  messagingSenderId: "43273653500",
  appId: "1:43273653500:web:9c2c8c55c64a7b7f8f9b79"
};

const app = initializeApp(prodConfig);
const db = getFirestore(app);

async function syncTestingArticle() {
  console.log('Publishing "testing" article directly to production Firestore database...');
  const articleId = 'art-testing-live';
  const docRef = doc(db, 'articles', articleId);

  const payload = {
    title: 'Testing',
    slug: 'testing',
    excerpt: 'This is a test article created from GateLink Super Admin CMS to verify live production publishing on gatelink.in.',
    content: '<h2>Testing Live CMS Article</h2><p>Welcome to GateLink live CMS! This article verifies that published articles load smoothly on <strong>gatelink.in/blog/testing</strong>.</p>',
    coverImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&auto=format&fit=crop&q=80',
    coverImageAlt: 'Testing Article',
    categoryId: 'cat-society-mgmt',
    categoryName: 'Society Management',
    tags: ['Testing', 'CMS', 'GateLink'],
    authorId: 'auth-faisal',
    authorName: 'Mohammed Faisal Hasan',
    authorAvatar: '',
    status: 'Published',
    readTime: '2 min read',
    seoTitle: 'Testing — GateLink CMS',
    seoDescription: 'Live test article for GateLink CMS verification.',
    canonicalUrl: 'https://gatelink.in/blog/testing',
    ogTitle: 'Testing — GateLink CMS',
    ogDescription: 'Live test article for GateLink CMS verification.',
    ogImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&auto=format&fit=crop&q=80',
    robotsIndex: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    createdBy: 'mohammedfaisalhasan@gmail.com',
    updatedBy: 'mohammedfaisalhasan@gmail.com',
    publishedBy: 'mohammedfaisalhasan@gmail.com'
  };

  try {
    await setDoc(docRef, payload);
    console.log('SUCCESS: Article "testing" published to production Firestore!');
    process.exit(0);
  } catch (err) {
    console.error('ERROR publishing article:', err.message);
    process.exit(1);
  }
}

syncTestingArticle();
