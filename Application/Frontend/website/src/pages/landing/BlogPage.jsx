import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Tag, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const INITIAL_SEED_ARTICLES = [
  {
    title: 'Top 5 Security Measures Every Indian Housing Society Must Implement in 2026',
    slug: 'top-5-security-measures-every-indian-housing-society-must-implement-in-2026',
    categoryName: 'Security',
    authorName: 'Mohammed Faisal Hasan',
    date: 'July 24, 2026',
    readTime: '5 min read',
    excerpt: 'From 1-tap QR gate passes to emergency SOS siren alerts, discover how modern apartment complexes are eliminating gate queues and unauthorized entries.',
    content: '<p>Security in gated communities has evolved drastically beyond manual paper registers. Today, apartment complexes rely on digital OTP gate passes, biometric helper check-ins, and instant resident phone notifications to maintain a fortress-level gate perimeter.</p><h2>1. Digital QR & OTP Visitor Approvals</h2><p>Manual register logs are slow, error-prone, and unreadable. Digital visitor entry sends instant push notifications to resident mobile phones for one-tap approval.</p><h2>2. Emergency SOS Panic Sirens</h2><p>In emergencies, residents need an immediate panic button that alerts security guards and committee members simultaneously.</p>',
    coverImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&auto=format&fit=crop&q=80',
    tags: ['Gate Security', 'QR Passes', 'Resident Safety'],
    status: 'Published'
  },
  {
    title: 'How Automated Maintenance Invoicing & Online Gateway Boosts Collection to 98%+',
    slug: 'how-automated-maintenance-invoicing-online-gateway-boosts-collection-to-98',
    categoryName: 'Finance',
    authorName: 'Priya Sharma',
    date: 'July 18, 2026',
    readTime: '6 min read',
    excerpt: 'Say goodbye to manual WhatsApp payment chasers. Learn how automated monthly invoicing and auto-reconciliation streamline society treasury ledgers.',
    content: '<p>Managing society maintenance payments manually on Excel causes delayed payments and ledger errors. By deploying automated payment gateway links with instant GST PDF receipts, housing societies achieve over 98% timely monthly collections.</p>',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
    tags: ['Online Billing', 'Maintenance Billing', 'Tally ERP'],
    status: 'Published'
  },
  {
    title: 'The Ultimate Guide to RWA Bylaw Compliance & Digital Audit Vaults',
    slug: 'the-ultimate-guide-to-rwa-bylaw-compliance-digital-audit-vaults',
    categoryName: 'Governance',
    authorName: 'Anand Verma',
    date: 'July 12, 2026',
    readTime: '8 min read',
    excerpt: 'Ensure your management committee stays 100% compliant with local state society registrar regulations using cloud audit logs and RBAC matrix controls.',
    content: '<p>Role-Based Access Control (RBAC) ensures that treasurers, presidents, and secretaries only modify records within their authorized scope, maintaining zero audit friction during annual general body meetings.</p>',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80',
    tags: ['Bylaws', 'RBAC', 'Legal Audit'],
    status: 'Published'
  }
];

export default function BlogPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState(INITIAL_SEED_ARTICLES);
  const [loading, setLoading] = useState(false);

  const postsPerPage = 6;
  const categories = ['All', 'Security', 'Finance', 'Governance', 'Resident Living', 'Tech & AI'];

  useEffect(() => {
    fetchPublishedArticles();
  }, []);

  const fetchPublishedArticles = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'articles'), where('status', '==', 'Published'));
      const snap = await getDocs(q);

      if (snap.empty) {
        // Seed initial published articles
        for (const seed of INITIAL_SEED_ARTICLES) {
          const docRef = doc(collection(db, 'articles'));
          await setDoc(docRef, {
            ...seed,
            seoTitle: seed.title,
            seoDescription: seed.excerpt,
            canonicalUrl: `https://gatelink.in/blog/${seed.slug}`,
            createdAt: serverTimestamp(),
            publishedAt: serverTimestamp()
          });
        }
        const newSnap = await getDocs(q);
        const fetched = newSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setArticles(fetched);
      } else {
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setArticles(fetched);
      }
    } catch (err) {
      console.error('Error fetching published articles:', err);
      setArticles(INITIAL_SEED_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.categoryName === selectedCategory || article.category === selectedCategory;
    const matchesSearch = 
      (article.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredArticles.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredArticles.slice(indexOfFirstPost, indexOfLastPost);

  const featuredPost = filteredArticles[0] || INITIAL_SEED_ARTICLES[0];

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', color: isDark ? '#F8FAFC' : '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead 
        title="GateLink Blog - Gated Community & Society Management Insights" 
        description="Expert insights, security best practices, financial audit guides, and technology trends for apartment housing societies and RWAs in India." 
        canonicalUrl="https://gatelink.in/blog" 
      />

      <Navbar onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      {/* Hero Header */}
      <section style={{ paddingTop: '140px', paddingBottom: '60px', backgroundColor: isDark ? '#1E293B' : '#0F172A', color: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#0EA5E9 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '999px', backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8', fontSize: '13px', fontWeight: '700', marginBottom: '20px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <BookOpen size={14} /> Knowledge & Strategy Hub
          </span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '800', lineHeight: 1.15, marginBottom: '20px', fontFamily: 'Manrope, sans-serif' }}>
            GateLink <span style={{ color: '#0EA5E9' }}>Community Insights</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: '#94A3B8', maxWidth: '700px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Practical guides, security protocols, financial auditing strategies, and technology trends for modern Indian apartment housing societies.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text" 
              placeholder="Search articles by topic, security, or keyword..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: '100%', padding: '16px 20px 16px 48px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.07)', color: '#FFFFFF', fontSize: '15px', outline: 'none', backdropFilter: 'blur(10px)' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
        
        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '40px', scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: selectedCategory === cat ? '#0EA5E9' : (isDark ? '#1E293B' : '#E2E8F0'),
                color: selectedCategory === cat ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569')
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* Featured Article Banner */}
            {!searchQuery && selectedCategory === 'All' && featuredPost && (
              <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, marginBottom: '56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 0, boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'relative', minHeight: '280px' }}>
                  <img 
                    src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200'} 
                    alt={featuredPost.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', padding: '6px 14px', borderRadius: '999px', backgroundColor: '#0EA5E9', color: '#FFF', fontSize: '12px', fontWeight: '800' }}>
                    FEATURED
                  </div>
                </div>

                <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '12px' }}>
                    <span style={{ color: '#0EA5E9', fontWeight: '700' }}>{featuredPost.categoryName || featuredPost.category || 'Security'}</span>
                    <span>•</span>
                    <span>{featuredPost.date || 'Recent'}</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '800', lineHeight: 1.3, marginBottom: '14px', fontFamily: 'Manrope, sans-serif' }}>
                    <Link to={`/blog/${featuredPost.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p style={{ fontSize: '15px', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                    {featuredPost.excerpt}
                  </p>

                  <Link 
                    to={`/blog/${featuredPost.slug}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', fontWeight: '800', fontSize: '15px', textDecoration: 'none' }}
                  >
                    Read Full Article <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px', marginBottom: '56px' }}>
              {currentPosts.map((article) => (
                <div 
                  key={article.id || article.slug}
                  style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}
                >
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img 
                      src={article.coverImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'} 
                      alt={article.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#38BDF8', fontSize: '11px', fontWeight: '800', backdropFilter: 'blur(4px)' }}>
                      {article.categoryName || article.category || 'General'}
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '10px' }}>
                        <span>{article.authorName || article.author || 'GateLink Team'}</span>
                        <span>•</span>
                        <span>{article.readTime || '5 min read'}</span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1.35, marginBottom: '10px', fontFamily: 'Manrope, sans-serif' }}>
                        <Link to={`/blog/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {article.title}
                        </Link>
                      </h3>

                      <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.excerpt}
                      </p>
                    </div>

                    <Link 
                      to={`/blog/${article.slug}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0EA5E9', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}
                    >
                      Read Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ padding: '10px 16px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#1E293B' : '#FFF', color: isDark ? '#F8FAFC' : '#1E293B', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <span style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ padding: '10px 16px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#1E293B' : '#FFF', color: isDark ? '#F8FAFC' : '#1E293B', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

      </div>

      <FooterSection onOpenDemoModal={() => setIsDemoModalOpen(true)} />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
