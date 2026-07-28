import React, { useState, useEffect } from 'react';
import { Plus, Trash2, XCircle } from 'lucide-react';
import { collection, onSnapshot, query, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({ title: '', category: 'Rules' });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'societies/SOC-001/documents'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by createdAt descending locally since we don't have an index for it in this mock
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDocuments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this document?")) {
      await deleteDoc(doc(db, `societies/SOC-001/documents`, id));
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024) {
        alert("File size exceeds 100KB limit.");
        e.target.value = null; // Clear the input
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 1. Upload to Storage
      const storageRef = ref(storage, `documents/SOC-001/${Date.now()}_${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error(error);
          alert("Error uploading file: " + error.message);
          setUploading(false);
        }, 
        async () => {
          // 2. Get download URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          // 3. Save to Firestore
          const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          await addDoc(collection(db, 'societies/SOC-001/documents'), {
            title: formData.title,
            category: formData.category,
            size: formatBytes(selectedFile.size),
            date: today,
            downloadUrl: downloadUrl,
            createdAt: new Date().toISOString()
          });

          setIsModalOpen(false);
          setFormData({ title: '', category: 'Rules' });
          setSelectedFile(null);
          setUploading(false);
        }
      );
    } catch (error) {
      alert("Error adding document: " + error.message);
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading documents...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={18} /> Upload Document</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Documents</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{documents.length} total</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No documents found.</td></tr>
              ) : (
                documents.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong>{d.title}</strong>
                      {d.downloadUrl && (
                        <div><a href={d.downloadUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none' }}>View File</a></div>
                      )}
                    </td>
                    <td>
                      <span className="badge primary">{d.category}</span>
                    </td>
                    <td>{d.size}</td>
                    <td>{d.date}</td>
                    <td>
                      <button
                        className="btn-icon"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => handleDelete(d.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { if (!uploading) setIsModalOpen(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Document</h3>
              {!uploading && <button className="btn-icon" onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>}
            </div>
            <form onSubmit={handleAddDocument}>
              <div className="form-group">
                <label>Document Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Society Bye-laws 2026" disabled={uploading} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} disabled={uploading}>
                  <option value="Rules">Rules</option>
                  <option value="Financial">Financial</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Directory">Directory</option>
                </select>
              </div>
              <div className="form-group">
                <label>File (Max 100KB)</label>
                <input required type="file" onChange={handleFileChange} disabled={uploading} />
              </div>
              
              {uploading && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s' }}></div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)} disabled={uploading}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading}>Upload Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
