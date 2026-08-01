import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
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

export default function BlogPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const postsPerPage = 6;
  const categories = ['All', 'Security', 'Finance', 'Governance', 'Resident Living', 'Tech & AI'];

  const articles = [
    {
      id: 1,
      title: 'Top 5 Security Measures Every Indian Housing Society Must Implement in 2026',
      category: 'Security',
      author: 'Mohammed Faisal Hasan',
      date: 'July 24, 2026',
      readTime: '5 min read',
      excerpt: 'From 1-tap QR gate passes to emergency SOS siren alerts, discover how modern apartment complexes are eliminating gate queues and unauthorized entries.',
      content: 'Security in gated communities has evolved drastically beyond manual paper registers. Today, apartment complexes rely on digital OTP gate passes, biometric helper check-ins, and instant resident phone notifications to maintain a fortress-level gate perimeter.',
      tags: ['Gate Security', 'QR Passes', 'Resident Safety']
    },
    {
      id: 2,
      title: 'How Automated Maintenance Invoicing & Online Gateway Boosts Collection to 98%+',
      category: 'Finance',
      author: 'Priya Sharma',
      date: 'July 18, 2026',
      readTime: '6 min read',
      excerpt: 'Say goodbye to manual WhatsApp payment chasers. Learn how automated monthly invoicing and auto-reconciliation streamline society treasury ledgers.',
      content: 'Managing society maintenance payments manually on Excel causes delayed payments and ledger errors. By deploying automated payment gateway links with instant GST PDF receipts, housing societies achieve over 98% timely monthly collections.',
      tags: ['Online Billing', 'Maintenance Billing', 'Tally ERP']
    },
    {
      id: 3,
      title: 'The Ultimate Guide to RWA Bylaw Compliance & Digital Audit Vaults',
      category: 'Governance',
      author: 'Anand Verma',
      date: 'July 12, 2026',
      readTime: '8 min read',
      excerpt: 'Ensure your management committee stays 100% compliant with local state society registrar regulations using cloud audit logs and RBAC matrix controls.',
      content: 'Role-Based Access Control (RBAC) ensures that treasurers, presidents, and secretaries only modify records within their authorized scope, maintaining zero audit friction during annual general body meetings.',
      tags: ['Bylaws', 'RBAC', 'Legal Audit']
    },
    {
      id: 4,
      title: 'Enhancing Apartment Living: Conflict-Free Amenity Slot Booking Systems',
      category: 'Resident Living',
      author: 'Neha Kapoor',
      date: 'July 05, 2026',
      readTime: '4 min read',
      excerpt: 'How digital slot reservations for swimming pools, tennis courts, and party halls prevent resident disputes and generate extra society revenue.',
      content: 'Clubhouse and amenity disputes disappear when residents can view real-time availability calendars and reserve slots with instant digital pass tokens on their smartphones.',
      tags: ['Clubhouse', 'Amenities', 'Community Living']
    },
    {
      id: 5,
      title: 'The Role of AI & Data Analytics in Multi-Tower Property Management',
      category: 'Tech & AI',
      author: 'Mohammed Faisal Hasan',
      date: 'June 28, 2026',
      readTime: '7 min read',
      excerpt: 'Predictive maintenance for elevators, DG sets, and water pumps: How smart IoT sensors and analytics reduce society operational expenses by 30%.',
      content: 'Facility managers can prevent unexpected elevator or generator breakdowns by setting automated preventive maintenance schedules linked directly to vendor service SLAs.',
      tags: ['Property Tech', 'IoT Sensors', 'Preventive Servicing']
    },
    {
      id: 6,
      title: 'Helper & Maid Verification: Best Practices for Resident Peace of Mind',
      category: 'Security',
      author: 'Siddharth Rao',
      date: 'June 20, 2026',
      readTime: '5 min read',
      excerpt: 'Registering domestic staff with photo verification, live attendance logs, and instant gatekeeper arrival notifications.',
      content: 'Residents enjoy peace of mind knowing exactly when their cook or maid arrives at the main gate, with digital attendance logs accessible directly on the Resident App.',
      tags: ['Domestic Helpers', 'Maid Verification', 'Gatekeeper']
    },
    {
      id: 7,
      title: 'Transitioning from Paper Registers to Digital Gatekeeper Apps',
      category: 'Security',
      author: 'Priya Sharma',
      date: 'June 14, 2026',
      readTime: '5 min read',
      excerpt: 'A step-by-step guide for training security guards on smartphone apps, OTP entry verification, and emergency siren response.',
      content: 'Multilingual Guard Apps designed with simple 1-tap interfaces enable security guards to log guest entries in under 5 seconds, even without technical backgrounds.',
      tags: ['Guard App', 'Paperless Gate', 'OTP Verification']
    }
  ];

  // Filtering
  const filtered = articles.filter(a => {
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filtered.slice(indexOfFirstPost, indexOfLastPost);

  // Schema Markup
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'SocietySphere Insights & Tech Blog',
    'description': 'Latest insights on gated community security, maintenance billing, and RWA governance.',
    'publisher': {
      '@type': 'Organization',
      'name': 'SocietySphere Inc.'
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dynamic SEO Head */}
      <SeoHead
        title="SocietySphere Blog - Gated Community & RWA Management Insights"
        description="Read the latest articles on housing society security, automated maintenance billing, RWA bylaws compliance, and smart apartment living."
        canonicalUrl="https://societysphere.com/blog"
        schemaData={blogSchema}
      />

      {/* Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '50px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 900, color: '#00B589', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            <BookOpen size={14} /> SocietySphere Knowledge Hub
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '0 0 16px 0' }}>
            Society Management & Housing Tech Blog
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
            Expert guides, RWA compliance tips, security protocols, and financial automation strategies for modern gated communities.
          </p>

          {/* Search & Category Filter Bar */}
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color={isDark ? '#94A3B8' : '#666666'} style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                placeholder="Search articles by keyword, topic, or tag..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ width: '100%', padding: '12px 14px 12px 48px', borderRadius: '4px', border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #CCCCCC', background: isDark ? '#1E293B' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    style={{
                      padding: '8px 18px', borderRadius: '2px', border: '1px solid',
                      borderColor: isSelected ? '#00B589' : (isDark ? 'rgba(255,255,255,0.1)' : '#CCCCCC'),
                      backgroundColor: isSelected ? '#00B589' : 'transparent',
                      color: isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#444444'), fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Grid & Sidebar Layout */}
      <section style={{ padding: '60px 0 100px 0' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '40px' }}>
          
          {/* Left Main Article Grid */}
          <div>
            {currentPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: isDark ? '#94A3B8' : '#666666' }}>
                <h3>No articles found matching "{searchQuery}"</h3>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '2px', background: '#00B589', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' }}>
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    style={{
                      background: isDark ? '#1E293B' : '#FFFFFF',
                      borderRadius: '4px',
                      padding: '24px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '2px', background: '#ECFDF5', color: '#00B589' }}>
                          {post.category}
                        </span>
                        <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                        {post.title}
                      </h3>

                      <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                        {post.excerpt}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94A3B8' : '#666666' }}>{post.date}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#00B589', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Read Article <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  style={{ padding: '8px 14px', borderRadius: '2px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: 'transparent', color: isDark ? '#FFFFFF' : '#333333', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  style={{ padding: '8px 14px', borderRadius: '2px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: 'transparent', color: isDark ? '#FFFFFF' : '#333333', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Recent & Trending */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '4px', padding: '24px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#00B589" /> Trending Topics
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {articles.slice(0, 4).map(art => (
                  <div key={art.id} onClick={() => setSelectedPost(art)} style={{ cursor: 'pointer', paddingBottom: '10px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#333333', lineHeight: 1.35, marginBottom: '4px' }}>{art.title}</div>
                    <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#666666' }}>{art.date} • {art.readTime}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: isDark ? '#1E293B' : '#F8FAFC', borderRadius: '4px', padding: '24px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', textAlign: 'center' }}>
              <h4 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '8px' }}>Enroll Your Society</h4>
              <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.5, marginBottom: '16px' }}>
                Deploy SocietySphere OS in 24 hours with dedicated guard training and 14-day free trial.
              </p>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                style={{ width: '100%', padding: '10px', borderRadius: '2px', backgroundColor: '#00B589', color: '#FFFFFF', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
              >
                Enroll your society
              </button>
            </div>
          </aside>

        </div>
      </section>

      {/* Article Detail Modal */}
      {selectedPost && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '4px', maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '32px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', position: 'relative' }}>
            <button onClick={() => setSelectedPost(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: isDark ? '#FFFFFF' : '#333333' }}>
              <X size={20} />
            </button>
            <span style={{ fontSize: '11px', fontWeight: 900, background: '#ECFDF5', color: '#00B589', padding: '4px 10px', borderRadius: '2px' }}>{selectedPost.category}</span>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '14px 0 8px 0' }}>{selectedPost.title}</h2>
            <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666', marginBottom: '20px' }}>By {selectedPost.author} • {selectedPost.date} • {selectedPost.readTime}</div>
            <p style={{ fontSize: '15px', color: isDark ? '#E2E8F0' : '#444444', lineHeight: 1.7 }}>{selectedPost.content}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
