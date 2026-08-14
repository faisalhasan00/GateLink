import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Trash2, 
  Eye, 
  Download, 
  X, 
  Lock, 
  Globe, 
  Plus 
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

const CATEGORIES = ['Society Rules', 'Meeting Minutes', 'Financial Reports', 'Circulars & Notices', 'Legal Documents', 'General'];

export default function Documents() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Society Rules',
    visibility: 'All Residents',
  });

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubscribe = societyAdminService.subscribeDocuments(
      societyId,
      (data) => {
        setDocuments(data);
        setLoading(false);
      },
      (err) => console.error('Error fetching documents:', err)
    );

    return () => unsubscribe();
  }, [societyId]);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      await societyAdminService.createDocumentRecord(societyId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        visibility: formData.visibility,
        fileType: 'PDF',
        size: '500 KB',
        uploadedBy: 'Admin'
      });

      alert(`Successfully uploaded "${formData.title}"!`);
      setIsUploadModalOpen(false);
      setFormData({ title: '', description: '', category: 'Society Rules', visibility: 'All Residents' });
      setUploading(false);
    } catch (e) {
      setUploading(false);
      alert('Error uploading document: ' + e.message);
    }
  };

  const filteredDocuments = documents.filter(d => {
    const q = searchQuery.toLowerCase();
    const titleMatches = (d.title || '').toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
    return titleMatches && matchesCategory;
  });

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading Document Repository...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <FileText size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Total Repository Documents</p>
            <h3>{documents.length}</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', width: '240px' }}
          />
          <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Upload Document
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Document Repository</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Category</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.title}</strong></td>
                  <td><span className="badge primary">{d.category || 'General'}</span></td>
                  <td>{d.visibility || 'All Residents'}</td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setPreviewDoc(d)}>
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleUploadDocument} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Document Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Save & Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
