import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getArticleTimestamp } from './blog/blogHelpers';
import BlogHeroSection from './blog/BlogHeroSection';
import BlogFeaturedCard from './blog/BlogFeaturedCard';
import BlogArticleCard from './blog/BlogArticleCard';
import BlogPagination from './blog/BlogPagination';

export default function BlogPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [availableCategories, setAvailableCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  const postsPerPage = 6;

  useEffect(() => {
    fetchPublishedArticles();
  }, []);

  const fetchPublishedArticles = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'articles'));
      if (!snap.empty) {
        const rawDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const publishedDocs = rawDocs.filter((docItem) => {
          const st = (docItem.status || '').toLowerCase().trim();
          return st === 'published' || st === 'active';
        });

        if (publishedDocs.length > 0) {
          publishedDocs.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
          setArticles(publishedDocs);

          const dynamicCats = new Set(['All']);
          publishedDocs.forEach((art) => {
            const catName = art.categoryName || art.category;
            if (catName && typeof catName === 'string') {
              dynamicCats.add(catName.trim());
            }
          });
          setAvailableCategories(Array.from(dynamicCats));
        } else {
          setArticles([]);
        }
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error('Error fetching published articles from Firestore:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const articleCat = (article.categoryName || article.category || '').toLowerCase().trim();
    const articleCatId = (article.categoryId || '').toLowerCase().trim();
    const selCat = selectedCategory.toLowerCase().trim();

    const matchesCategory =
      selectedCategory === 'All' ||
      articleCat === selCat ||
      articleCatId === selCat ||
      articleCat.includes(selCat);

    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (article.title || '').toLowerCase().includes(term) ||
      (article.excerpt || '').toLowerCase().includes(term) ||
      (article.authorName || '').toLowerCase().includes(term) ||
      (article.tags || []).some((tag) => (tag || '').toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  const isDefaultView = selectedCategory === 'All' && !searchQuery.trim();
  const featuredPost = isDefaultView && filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = isDefaultView && featuredPost ? filteredArticles.slice(1) : filteredArticles;

  const totalPages = Math.ceil(gridArticles.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = gridArticles.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', color: isDark ? '#F8FAFC' : '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead
        title="GateLink Blog - Gated Community & Society Management Insights"
        description="Expert insights, security best practices, financial audit guides, and technology trends for apartment housing societies and RWAs in India."
        canonicalUrl="https://gatelink.in/blog"
      />

      <Navbar onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      <BlogHeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetPage={() => setCurrentPage(1)}
        isDark={isDark}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
        {availableCategories.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '40px', scrollbarWidth: 'none' }}>
            {availableCategories.map((cat) => (
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
        )}

        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            <BlogFeaturedCard featuredPost={featuredPost} isDark={isDark} />

            {currentPosts.length === 0 && !featuredPost ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '20px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
                <FileText size={48} style={{ color: '#94A3B8', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No articles published yet</h3>
                <p style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '15px', maxWidth: '440px', margin: '0 auto 24px' }}>
                  {searchQuery ? `No articles matching "${searchQuery}".` : `Check back soon for new community insights and society guides.`}
                </p>
                {(searchQuery || selectedCategory !== 'All') && (
                  <button
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#0EA5E9', color: '#FFF', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                  >
                    View All Articles
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px', marginBottom: '56px' }}>
                {currentPosts.map((article) => (
                  <BlogArticleCard key={article.id || article.slug} article={article} isDark={isDark} />
                ))}
              </div>
            )}

            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isDark={isDark}
            />
          </>
        )}
      </div>

      <FooterSection onOpenDemoModal={() => setIsDemoModalOpen(true)} />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
