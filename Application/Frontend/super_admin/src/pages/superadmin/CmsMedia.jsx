import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  ArrowLeft, 
  Copy, 
  Check, 
  Trash2, 
  Image as ImageIcon, 
  Search, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { getMediaLibrary, uploadMedia, deleteMedia } from '../../services/cmsService';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useTheme } from '../../context/ThemeContext';

export default function CmsMedia() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { hasPermission, user } = useSuperAdminAuth();

  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const canDelete = hasPermission('content.delete');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const items = await getMediaLibrary();
      setMediaItems(items);
    } catch (err) {
      console.error('Error loading media library:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const newMedia = await uploadMedia(
        file,
        file.name,
        user?.email || 'Super Admin',
        (progress) => setUploadProgress(progress)
      );
      setMediaItems(prev => [newMedia, ...prev]);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCopyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, storagePath) => {
    if (!confirm('Are you sure you want to delete this media asset from storage?')) return;
    try {
      await deleteMedia(id, storagePath, user?.email || 'Super Admin');
      setMediaItems(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert(`Failed to delete media: ${err.message}`);
    }
  };

  const filteredMedia = mediaItems.filter(m => 
    (m.filename || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.altText || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <SkeletonLoader />;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/cms')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, backgroundColor: isDark ? '#1E293B' : '#FFF', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >
            <ArrowLeft size={16} /> Back to CMS
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: isDark ? '#F8FAFC' : '#0F172A', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
            Media Library Assets ({mediaItems.length})
          </h1>
        </div>

        {/* Upload Button */}
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#1E3A8A', color: '#FFF', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)' }}>
          <Upload size={18} /> {uploading ? `Uploading ${uploadProgress}%...` : 'Upload Image'}
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Search Bar */}
      <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '16px', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search filename or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', padding: '60px 20px', borderRadius: '16px', textAlign: 'center', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
          <ImageIcon size={48} style={{ color: '#94A3B8', marginBottom: '12px' }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: isDark ? '#FFF' : '#000' }}>No Images Found</h3>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Upload blog images (PNG, JPG, WEBP, GIF, SVG under 5MB) to use in SaaS articles.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {filteredMedia.map((item) => (
            <div key={item.id} style={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '16px', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={item.url} alt={item.altText || item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: isDark ? '#F8FAFC' : '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                    {item.filename}
                  </div>
                  <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '12px' }}>
                    {(item.size ? (item.size / 1024).toFixed(1) : '0')} KB • {item.mimeType?.split('/')[1]?.toUpperCase() || 'IMG'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleCopyUrl(item.id, item.url)}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${isDark ? '#475569' : '#CBD5E1'}`, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    {copiedId === item.id ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                    {copiedId === item.id ? 'Copied' : 'Copy URL'}
                  </button>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(item.id, item.storagePath)}
                      style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
