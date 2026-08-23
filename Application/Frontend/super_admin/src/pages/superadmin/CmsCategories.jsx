import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  Users, 
  Plus, 
  ArrowLeft, 
  Tag, 
  UserCheck, 
  FileText, 
  CheckCircle,
  X
} from 'lucide-react';
import { getCategories, createCategory, getAuthors, createAuthor } from '../../services/cmsService';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useTheme } from '../../context/ThemeContext';

export default function CmsCategories() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category Form Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');

  // New Author Form Modal
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, auts] = await Promise.all([getCategories(), getAuthors()]);
      setCategories(cats);
      setAuthors(auts);
    } catch (err) {
      console.error('Error loading categories and authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      const newCat = await createCategory({ name: catName, description: catDescription });
      setCategories(prev => [...prev, newCat]);
      setShowCategoryModal(false);
      setCatName('');
      setCatDescription('');
    } catch (err) {
      alert(`Error creating category: ${err.message}`);
    }
  };

  const handleCreateAuthor = async (e) => {
    e.preventDefault();
    if (!authorName.trim()) return;
    try {
      const newAut = await createAuthor({ name: authorName, role: authorRole, bio: authorBio, avatar: authorAvatar });
      setAuthors(prev => [...prev, newAut]);
      setShowAuthorModal(false);
      setAuthorName('');
      setAuthorRole('');
      setAuthorBio('');
      setAuthorAvatar('');
    } catch (err) {
      alert(`Error creating author: ${err.message}`);
    }
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/cms')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, backgroundColor: isDark ? '#1E293B' : '#FFF', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >
            <ArrowLeft size={16} /> Back to CMS
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: isDark ? '#F8FAFC' : '#0F172A', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
            Categories & Author Profiles
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* CATEGORIES SECTION */}
        <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderOpen size={20} style={{ color: '#0EA5E9' }} /> Article Categories ({categories.length})
            </h2>
            <button
              onClick={() => setShowCategoryModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#1E3A8A', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              <Plus size={16} /> Add Category
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map((cat) => (
              <div key={cat.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '15px' }}>{cat.name}</span>
                  <span style={{ fontSize: '12px', color: '#0EA5E9', fontFamily: 'monospace' }}>/category/{cat.slug}</span>
                </div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: 0 }}>
                  {cat.description || 'No description provided.'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AUTHORS SECTION */}
        <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: '#10B981' }} /> Staff Authors ({authors.length})
            </h2>
            <button
              onClick={() => setShowAuthorModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              <Plus size={16} /> Add Author
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {authors.map((aut) => (
              <div key={aut.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={aut.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={aut.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '15px' }}>
                    {aut.name} <span style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: '500' }}>({aut.role})</span>
                  </div>
                  <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: '2px 0 0 0' }}>
                    {aut.bio || 'GateLink contributor.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <form onSubmit={handleCreateCategory} style={{ backgroundColor: isDark ? '#1E293B' : '#FFF', padding: '24px', borderRadius: '16px', maxWidth: '440px', width: '100%', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>New Category</h3>
              <button type="button" onClick={() => setShowCategoryModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Category Name *</label>
            <input type="text" required placeholder="e.g. Security & Gate Pass" value={catName} onChange={(e) => setCatName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '16px' }} />
            
            <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Description</label>
            <textarea rows={3} placeholder="Brief summary of articles in this category..." value={catDescription} onChange={(e) => setCatDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '20px' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowCategoryModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? '#475569' : '#CBD5E1'}`, background: 'none', color: isDark ? '#FFF' : '#000' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#1E3A8A', color: '#FFF', fontWeight: '700' }}>Save Category</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Author Modal */}
      {showAuthorModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <form onSubmit={handleCreateAuthor} style={{ backgroundColor: isDark ? '#1E293B' : '#FFF', padding: '24px', borderRadius: '16px', maxWidth: '440px', width: '100%', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>New Author Profile</h3>
              <button type="button" onClick={() => setShowAuthorModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Full Name *</label>
            <input type="text" required placeholder="e.g. Mohammed Faisal Hasan" value={authorName} onChange={(e) => setAuthorName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '14px' }} />

            <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Role / Designation</label>
            <input type="text" placeholder="e.g. Founder & CEO" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '14px' }} />

            <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Avatar Image URL</label>
            <input type="text" placeholder="https://..." value={authorAvatar} onChange={(e) => setAuthorAvatar(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '14px' }} />

            <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Short Bio</label>
            <textarea rows={2} placeholder="Brief author bio..." value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '20px' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowAuthorModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? '#475569' : '#CBD5E1'}`, background: 'none', color: isDark ? '#FFF' : '#000' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#FFF', fontWeight: '700' }}>Save Author</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
