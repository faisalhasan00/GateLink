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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function BlogPage() {
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
      title: 'How Automated Maintenance Invoicing via Razorpay Boosts Collection to 98%+',
      category: 'Finance',
      author: 'Priya Sharma',
      date: 'July 18, 2026',
      readTime: '6 min read',
      excerpt: 'Say goodbye to manual WhatsApp payment chasers. Learn how automated monthly invoicing and auto-reconciliation streamline society treasury ledgers.',
      content: 'Managing society maintenance payments manually on Excel causes delayed payments and ledger errors. By deploying automated Razorpay gateway links with instant GST PDF receipts, housing societies achieve over 98% timely monthly collections.',
      tags: ['Razorpay', 'Maintenance Billing', 'Tally ERP']
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
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Dynamic SEO Head */}
      <SeoHead
        title="SocietySphere Blog - Gated Community & RWA Management Insights"
        description="Read the latest articles on housing society security, automated Razorpay maintenance billing, RWA bylaws compliance, and smart apartment living."
        canonicalUrl="https://societysphere.com/blog"
        schemaData={blogSchema}
      />

      {/* Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '50px',
        background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
              <BookOpen size={14} /> SOCIETASPHERE INSIGHTS & KNOWLEDGE
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
              Society Management & Housing Tech Blog
            </h1>
            <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '700px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
              Expert guides, RWA compliance tips, security protocols, and financial automation strategies for modern gated communities.
            </p>

            {/* Search & Category Filter Bar */}
            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '20px', padding: '16px 20px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
                <input
                  type="text"
                  placeholder="Search articles by keyword, topic, or tag..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%', padding: '14px 14px 14px 50px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.8)', color: '#FFFFFF', fontSize: '15px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    style={{
                      padding: '8px 16px', borderRadius: '12px', border: '1px solid',
                      borderColor: selectedCategory === cat ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                      backgroundColor: selectedCategory === cat ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                      color: selectedCategory === cat ? '#FFFFFF' : '#94A3B8', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Blog Grid & Sidebar Layout */}
      <section style={{ padding: '60px 0 100px 0', background: '#020617' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '40px' }}>
          
          {/* Left Main Article Grid */}
          <div>
            {currentPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                <h3>No articles found matching "{searchQuery}"</h3>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '10px', background: '#4F46E5', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' }}>
                {currentPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    whileHover={{ y: -6 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(16px)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
                          {post.category}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        {post.title}
                      </h3>

                      <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                        {post.excerpt}
                      </p>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {post.tags.map(t => (
                          <span key={t} style={{ fontSize: '10px', color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px' }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>{post.author}</span>
                      <button
                        onClick={() => setSelectedPost(post)}
                        style={{ background: 'transparent', border: 'none', color: '#818CF8', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>Read Article</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#94A3B8' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar Widget */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Recent Articles Widget */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
                <TrendingUp size={16} color="#818CF8" />
                <span>Recent Articles</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {articles.slice(0, 4).map(a => (
                  <div key={a.id} onClick={() => setSelectedPost(a)} style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{a.title}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{a.date} • {a.readTime}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription Widget */}
            <div style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>Subscribe to SocietySphere Insights</h4>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Get bi-weekly RWA compliance guides and security best practices delivered to your inbox.
              </p>
              <input type="email" placeholder="admin@society.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0F172A', color: 'white', fontSize: '13px', marginBottom: '10px', outline: 'none' }} />
              <button style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#4F46E5', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                Subscribe Now
              </button>
            </div>
          </aside>

        </div>
      </section>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
