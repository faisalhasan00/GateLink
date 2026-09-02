import React from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

export function ArticleSidebarSettings({
  isDark,
  categoryId,
  handleCategorySelect,
  categories,
  authorId,
  handleAuthorSelect,
  authors,
  tagsInput,
  setTagsInput,
  coverImage,
  setCoverImage,
  setOgImage,
  uploadingImage,
  handleImageUpload,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Category & Author Settings */}
      <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '20px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 16px 0' }}>
          Organization &amp; Metadata
        </h3>

        {/* Category Dropdown */}
        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
          Primary Category *
        </label>
        <select
          value={categoryId}
          onChange={(e) => handleCategorySelect(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', marginBottom: '16px' }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Author Dropdown */}
        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
          Author Profile *
        </label>
        <select
          value={authorId}
          onChange={(e) => handleAuthorSelect(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', marginBottom: '16px' }}
        >
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
          ))}
        </select>

        {/* Tags Input */}
        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
          Tags (Comma Separated)
        </label>
        <input
          type="text"
          placeholder="QR Visitor, RWA Billing, Gate Security"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '13px' }}
        />
      </div>

      {/* Featured Cover Image */}
      <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '20px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', margin: '0 0 16px 0' }}>
          Featured Cover Image
        </h3>

        {coverImage ? (
          <div style={{ position: 'relative', marginBottom: '12px', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={coverImage} alt="Cover Preview" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            <button
              onClick={() => setCoverImage('')}
              style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div style={{ border: `2px dashed ${isDark ? '#334155' : '#CBD5E1'}`, borderRadius: '10px', padding: '24px 16px', textAlign: 'center', marginBottom: '12px' }}>
            <ImageIcon size={32} style={{ color: '#94A3B8', marginBottom: '8px' }} />
            <p style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 12px 0' }}>
              Upload cover image for blog cards &amp; social preview
            </p>
            <label style={{ padding: '8px 16px', backgroundColor: '#1E3A8A', color: '#FFF', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              {uploadingImage ? 'Uploading...' : 'Browse Image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        )}

        <input
          type="text"
          placeholder="Or paste Image URL..."
          value={coverImage}
          onChange={(e) => {
            setCoverImage(e.target.value);
            setOgImage(e.target.value);
          }}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '12px' }}
        />
      </div>
    </div>
  );
}
