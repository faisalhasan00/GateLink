import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import DOMPurify from 'dompurify';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import NotFoundPage from './NotFoundPage';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  Share2, 
  Check, 
  BookOpen, 
  Building2, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ArticleDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchArticleDetails();
  }, [slug]);

  const fetchArticleDetails = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const q = query(
        collection(db, 'articles'),
        where('slug', '==', slug),
        limit(1)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const docData = { id: snap.docs[0].id, ...snap.docs[0].data() };
      
      // Enforce public read status check
      if (docData.status !== 'Published') {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setArticle(docData);

      // Fetch related articles in same category
      if (docData.categoryId || docData.categoryName) {
        const relQ = query(
          collection(db, 'articles'),
          where('status', '==', 'Published'),
          limit(4)
        );
        const relSnap = await getDocs(relQ);
        const relDocs = relSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(d => d.slug !== slug);
        setRelatedArticles(relDocs.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching article detail:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) return <SkeletonLoader />;
  if (notFound || !article) return <NotFoundPage />;

  // Sanitize HTML body content safely
  const sanitizedContent = DOMPurify.sanitize(article.content || '');

  // JSON-LD BlogPosting Schema Data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.seoTitle || article.title,
    "description": article.seoDescription || article.excerpt,
    "image": article.ogImage || article.coverImage || "https://gatelink.in/logo.png",
    "author": {
      "@type": "Person",
      "name": article.authorName || "GateLink Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GateLink",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gatelink.in/logo.png"
      }
    },
    "datePublished": article.publishedAt?.toDate ? article.publishedAt.toDate().toISOString() : new Date().toISOString(),
    "dateModified": article.updatedAt?.toDate ? article.updatedAt.toDate().toISOString() : new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://gatelink.in/blog/${article.slug}`
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', color: isDark ? '#F8FAFC' : '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead
        title={`${article.seoTitle || article.title} | GateLink Blog`}
        description={article.seoDescription || article.excerpt}
        canonicalUrl={article.canonicalUrl || `https://gatelink.in/blog/${article.slug}`}
        ogImage={article.ogImage || article.coverImage}
        schemaData={schemaData}
      />

      <Navbar onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      {/* Article Header & Cover Banner */}
      <header style={{ paddingTop: '140px', paddingBottom: '40px', backgroundColor: isDark ? '#1E293B' : '#0F172A', color: '#FFFFFF', position: 'relative' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
          
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38BDF8', textDecoration: 'none', fontWeight: '700', fontSize: '14px', marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Back to GateLink Blog
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ padding: '6px 14px', borderRadius: '999px', backgroundColor: '#0EA5E9', color: '#FFF', fontSize: '12px', fontWeight: '800' }}>
              {article.categoryName || article.category || 'General'}
            </span>
            <span style={{ fontSize: '13px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {article.readTime || '5 min read'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', lineHeight: 1.2, marginBottom: '20px', fontFamily: 'Manrope, sans-serif' }}>
            {article.title}
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '32px' }}>
            {article.excerpt}
          </p>

          {/* Author Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={article.authorName || 'Author'}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0EA5E9' }}
              />
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#FFFFFF' }}>
                  {article.authorName || 'GateLink Editorial Team'}
                </div>
                <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                  Published on {article.publishedAt?.toDate ? article.publishedAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyShareLink}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              {copiedLink ? <Check size={16} style={{ color: '#10B981' }} /> : <Share2 size={16} />}
              {copiedLink ? 'Link Copied' : 'Share Article'}
            </button>
          </div>

        </div>
      </header>

      {/* Featured Cover Image */}
      {article.coverImage && (
        <div style={{ maxWidth: '960px', margin: '-30px auto 40px', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <img
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
          />
        </div>
      )}

      {/* Main Article Content Body */}
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 60px' }}>
        <article 
          className="prose-gatelink"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          style={{
            fontSize: '18px',
            lineHeight: '1.8',
            color: isDark ? '#E2E8F0' : '#334155'
          }}
        />

        {/* Article Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Tag size={16} style={{ color: '#0EA5E9' }} />
            <span style={{ fontWeight: '700', fontSize: '14px', color: isDark ? '#F8FAFC' : '#0F172A' }}>Tags:</span>
            {article.tags.map((tag, idx) => (
              <span key={idx} style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: isDark ? '#1E293B' : '#E2E8F0', color: isDark ? '#CBD5E1' : '#475569', fontSize: '13px', fontWeight: '600' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Product CTA Banner */}
        <div style={{ marginTop: '56px', backgroundColor: isDark ? '#1E293B' : '#0F172A', padding: '36px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8', marginBottom: '16px' }}>
            <Zap size={28} />
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', fontFamily: 'Manrope, sans-serif' }}>
            Transform Your Gated Community Management Today
          </h3>
          <p style={{ fontSize: '15px', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Eliminate gate queues, automate monthly maintenance billing, and safeguard your residential complex with GateLink.
          </p>
          <button
            onClick={() => setIsDemoModalOpen(true)}
            style={{ padding: '14px 32px', backgroundColor: '#0EA5E9', color: '#FFFFFF', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.35)' }}
          >
            Book Free Live Society Demo
          </button>
        </div>

        {/* Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '24px', fontFamily: 'Manrope, sans-serif' }}>
              Related Articles & Strategy Guides
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {relatedArticles.map((rel) => (
                <div key={rel.id} style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: '800', textTransform: 'uppercase' }}>
                      {rel.categoryName || 'Guide'}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', lineHeight: 1.3, margin: '8px 0 12px 0' }}>
                      <Link to={`/blog/${rel.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {rel.title}
                      </Link>
                    </h4>
                  </div>

                  <Link to={`/blog/${rel.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0EA5E9', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                    Read Guide <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <FooterSection onOpenDemoModal={() => setIsDemoModalOpen(true)} />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
