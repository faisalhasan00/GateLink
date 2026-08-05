import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Download, 
  X, 
  Lock, 
  Globe, 
  Users, 
  Calendar, 
  Tag, 
  HardDrive, 
  FileCheck, 
  Clock, 
  Plus, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  deleteDoc, 
  addDoc, 
  getDocs, 
  where 
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const CATEGORIES = [
  'Society Rules',
  'Meeting Minutes',
  'Financial Reports',
  'Circulars & Notices',
  'Legal Documents',
  'Forms & Applications',
  'Certificates',
  'Emergency Contacts',
  'General'
];

export default function Documents() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Society Rules',
    visibility: 'All Residents', // 'All Residents', 'Committee Only', 'Admin Only'
    version: 'v1.0',
    expiryDate: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const q = query(collection(db, `societies/${societyId}/documents`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [societyId]);

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('File size exceeds 20MB limit.');
        e.target.value = null;
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const timestampStr = new Date().toISOString();
      const formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      // Determine file format
      const fileExt = selectedFile.name.split('.').pop().toLowerCase();
      const isPdf = fileExt === 'pdf';
      const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt);

      let downloadUrl = '';

      // Upload file to Firebase Storage (or Base64 data URL fallback if storage unconfigured)
      try {
        const storageRef = ref(storage, `documents/${societyId}/${Date.now()}_${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      } catch (storageErr) {
        console.warn('Storage upload fallback, generating Data URL:', storageErr);
        // Fallback Base64 reader for offline/demo reliability
        downloadUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(selectedFile);
        });
      }

      // Save Document Record to Firestore
      const newDoc = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        visibility: formData.visibility,
        version: formData.version,
        expiryDate: formData.expiryDate || null,
        fileType: fileExt.toUpperCase(),
        fileName: selectedFile.name,
        size: formatBytes(selectedFile.size),
        downloadUrl: downloadUrl,
        uploadedBy: 'Admin User',
        date: formattedDate,
        createdAt: timestampStr
      };

      await addDoc(collection(db, `societies/${societyId}/documents`), newDoc);

      // Dispatch Notification to Residents if document visibility includes residents
      if (formData.visibility === 'All Residents') {
        const qUsers = query(collection(db, `societies/${societyId}/users`), where('role', '==', 'resident'));
        const userSnaps = await getDocs(qUsers);
        userSnaps.forEach((userDoc) => {
          addDoc(collection(db, `societies/${societyId}/users/${userDoc.id}/notifications`), {
            title: `New Document Published: ${formData.title}`,
            body: `A new document "${formData.title}" (${formData.category}) has been uploaded to the society repository.`,
            createdAt: timestampStr,
            isRead: false,
            type: 'document'
          });
        });
      }

      alert(`Successfully uploaded "${formData.title}"!`);
      setIsUploadModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'Society Rules',
        visibility: 'All Residents',
        version: 'v1.0',
        expiryDate: ''
      });
      setSelectedFile(null);
      setUploading(false);
    } catch (e) {
      setUploading(false);
      alert('Error uploading document: ' + e.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from society repository?`)) {
      try {
        await deleteDoc(doc(db, `societies/${societyId}/documents`, id));
      } catch (e) {
        alert('Error deleting document: ' + e.message);
      }
    }
  };

  // Filter & Sort Logic
  const filteredDocuments = documents.filter(d => {
    const q = searchQuery.toLowerCase();
    const titleMatches = (d.title || '').toLowerCase().includes(q);
    const catMatches = (d.category || '').toLowerCase().includes(q);
    const fileMatches = (d.fileName || '').toLowerCase().includes(q);
    const authorMatches = (d.uploadedBy || '').toLowerCase().includes(q);

    const matchesSearch = titleMatches || catMatches || fileMatches || authorMatches;
    const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
    const matchesVisibility = visibilityFilter === 'All' || d.visibility === visibilityFilter;

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  // Apply Sorting
  filteredDocuments.sort((a, b) => {
    if (sortBy === 'Oldest First') {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    } else if (sortBy === 'Title A-Z') {
      return (a.title || '').localeCompare(b.title || '');
    } else {
      // Newest First
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // Calculate Dashboard Summary Counters
  const totalCount = documents.length;
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const todayCount = documents.filter(d => d.date === todayStr).length;
  const sharedCount = documents.filter(d => d.visibility === 'All Residents').length;
  const privateCount = documents.filter(d => d.visibility !== 'All Residents').length;

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="skeleton-loader" style={{ height: '100px', borderRadius: '12px', marginBottom: '24px' }}></div>
        <div className="skeleton-loader" style={{ height: '300px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. Document Dashboard Statistics Header */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <FileText size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Total Repository Documents</p>
            <h3>{totalCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <FileCheck size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Uploaded Today</p>
            <h3>{todayCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)' }}>
            <Globe size={22} color="var(--secondary)" />
          </div>
          <div className="stat-info">
            <p>Public to Residents</p>
            <h3>{sharedCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
            <Lock size={22} color="var(--warning)" />
          </div>
          <div className="stat-info">
            <p>Internal / Committee Only</p>
            <h3>{privateCount}</h3>
          </div>
        </div>
      </div>

      {/* 2. Search & Multi-Filter Control Panel */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by Title, Category, File Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="var(--text-secondary)" />
              <select 
                className="form-select" 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="All">Category: All</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Visibility Filter */}
            <select 
              className="form-select" 
              value={visibilityFilter} 
              onChange={(e) => setVisibilityFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
            >
              <option value="All">Visibility: All</option>
              <option value="All Residents">All Residents (Public)</option>
              <option value="Committee Only">Committee Members Only</option>
              <option value="Admin Only">Admin Confidential</option>
            </select>

            {/* Sorting */}
            <select 
              className="form-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Title A-Z">Title A-Z</option>
            </select>
          </div>

          {/* Upload Document Action */}
          <button 
            className="btn btn-primary" 
            onClick={() => setIsUploadModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Upload Document
          </button>

        </div>
      </div>

      {/* 3. Document Repository Register Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Document Repository</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing {filteredDocuments.length} of {documents.length} files
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Category</th>
                <th>Format & Size</th>
                <th>Upload Date</th>
                <th>Access Permission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <FileText size={36} color="var(--border-color)" style={{ marginBottom: '8px' }} />
                    <div style={{ fontWeight: 600 }}>No documents match your search or filter parameters.</div>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((d) => {
                  const isPublic = d.visibility === 'All Residents';

                  return (
                    <tr key={d.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ 
                            width: '34px', 
                            height: '34px', 
                            borderRadius: '8px', 
                            backgroundColor: 'var(--primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            fontWeight: 800,
                            fontSize: '12px'
                          }}>
                            {d.fileType || 'DOC'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px' }}>{d.title}</div>
                            {d.description && (
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{d.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge primary">{d.category || 'General'}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{d.size || '120 KB'}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{d.version || 'v1.0'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{d.date || 'Recent'}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>By {d.uploadedBy || 'Admin'}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isPublic ? (
                            <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Globe size={12} /> All Residents
                            </span>
                          ) : (
                            <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Lock size={12} /> {d.visibility || 'Committee Only'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => setPreviewDoc(d)}
                          >
                            <Eye size={13} /> Preview
                          </button>

                          {d.downloadUrl && (
                            <button
                              type="button"
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--primary)', borderColor: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (d.downloadUrl && (d.downloadUrl.startsWith('http://') || d.downloadUrl.startsWith('https://') || d.downloadUrl.startsWith('data:'))) {
                                  window.open(d.downloadUrl, '_blank', 'noopener,noreferrer');
                                } else {
                                  alert(`Document Info:\n\nTitle: ${d.title}\nFormat: ${d.fileType || 'File'}`);
                                }
                              }}
                            >
                              <Download size={13} /> Download
                            </button>
                          )}

                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => handleDelete(d.id, d.title)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Upload Document Modal */}
      {isUploadModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '540px', borderRadius: '16px' }}>
            <div className="card-header">
              <h3 className="card-title">Upload Society Document</h3>
              {!uploading && <button className="btn-icon" onClick={() => setIsUploadModalOpen(false)}><X size={20} /></button>}
            </div>

            <form onSubmit={handleUploadDocument} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Document Title *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Society General Body Bye-Laws 2026"
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  disabled={uploading}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Description / Remarks</label>
                <textarea 
                  rows={2}
                  placeholder="Brief description of document content..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  disabled={uploading}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px', outline: 'none' }}
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category *</label>
                  <select 
                    className="form-select"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    disabled={uploading}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Access Visibility *</label>
                  <select 
                    className="form-select"
                    value={formData.visibility}
                    onChange={e => setFormData({ ...formData, visibility: e.target.value })}
                    disabled={uploading}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="All Residents">All Residents (Public)</option>
                    <option value="Committee Only">Committee Members Only</option>
                    <option value="Admin Only">Admin Confidential</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Select File (PDF, DOCX, XLSX, Images - Max 20MB) *</label>
                <input 
                  required 
                  type="file" 
                  onChange={handleFileChange} 
                  disabled={uploading}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px dashed var(--border-color)', fontSize: '12px' }}
                />
              </div>

              {uploading && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>Uploading file...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsUploadModalOpen(false)} disabled={uploading}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading}>
                  {uploading ? 'Publishing...' : 'Upload & Publish Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. In-App Document Previewer Modal */}
      {previewDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', height: '85vh', borderRadius: '16px', padding: '0', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '16px 20px', background: '#0F172A', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>{previewDoc.title}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{previewDoc.category} • {previewDoc.size} • Uploaded {previewDoc.date}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {previewDoc.downloadUrl && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (previewDoc.downloadUrl && (previewDoc.downloadUrl.startsWith('http://') || previewDoc.downloadUrl.startsWith('https://') || previewDoc.downloadUrl.startsWith('data:'))) {
                        window.open(previewDoc.downloadUrl, '_blank', 'noopener,noreferrer');
                      } else {
                        alert(`Document Info:\n\nTitle: ${previewDoc.title}\nPath: ${previewDoc.downloadUrl}`);
                      }
                    }}
                  >
                    <Download size={14} /> Download File
                  </button>
                )}
                <button style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }} onClick={() => setPreviewDoc(null)}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', overflow: 'hidden' }}>
              {previewDoc.downloadUrl ? (
                previewDoc.fileType === 'PDF' ? (
                  <iframe src={previewDoc.downloadUrl} title="Document Preview" style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}></iframe>
                ) : ['JPG', 'JPEG', 'PNG', 'WEBP'].includes(previewDoc.fileType) ? (
                  <img src={previewDoc.downloadUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <FileText size={48} color="var(--primary)" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: 0, fontSize: '16px' }}>Preview Not Available</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      This file format ({previewDoc.fileType}) cannot be rendered inside browser. Click below to download.
                    </p>
                    <a href={previewDoc.downloadUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', textDecoration: 'none' }}>
                      <Download size={16} /> Download {previewDoc.fileName || 'File'}
                    </a>
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>File URL unavailable.</div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
