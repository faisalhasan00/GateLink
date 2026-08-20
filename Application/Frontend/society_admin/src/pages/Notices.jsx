import React, { useState, useEffect } from 'react';
import { Plus, XCircle, Trash2, Edit3 } from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

const CATEGORIES = ['General', 'Maintenance', 'Safety', 'Event', 'Emergency', 'Rules'];

export default function Notices() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '', category: 'General' });

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubscribe = societyAdminService.subscribeNotices(
      societyId,
      (data) => {
        setNotices(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching notices:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [societyId]);

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({ title: '', body: '', category: 'General' });
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({ title: notice.title, body: notice.body || '', category: notice.category || 'General' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      if (editingNotice) {
        // Edit existing notice logic can be called
        await societyAdminService.createNotice(societyId, {
          title: formData.title,
          body: formData.body,
          category: formData.category,
        });
      } else {
        await societyAdminService.createNotice(societyId, {
          title: formData.title,
          body: formData.body,
          category: formData.category,
          isNew: true,
        });
      }

      setIsModalOpen(false);
      setEditingNotice(null);
      setFormData({ title: '', body: '', category: 'General' });
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setIsSending(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await societyAdminService.deleteNotice(societyId, id);
    } catch (error) {
      alert('Error deleting notice: ' + error.message);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading notices...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={openCreateModal}><Plus size={18} /> Create Notice</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Notices</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{notices.length} total</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Content</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No notices posted yet.</td></tr>
              ) : (
                notices.map((n) => {
                  let dateStr = '';
                  if (n.createdAt) {
                    try {
                      const dt = new Date(n.createdAt);
                      dateStr = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    } catch (_) {}
                  }

                  return (
                    <tr key={n.id}>
                      <td>
                        <strong>{n.title}</strong>
                        {n.isNew && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '10px',
                            fontWeight: '700',
                            color: 'var(--primary)',
                            background: 'var(--primary-surface)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}>NEW</span>
                        )}
                      </td>
                      <td>
                        <span className="badge primary">{n.category || 'General'}</span>
                      </td>
                      <td>
                        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {n.body || '-'}
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{dateStr}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            onClick={() => openEditModal(n)}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--danger)' }}
                            onClick={() => handleDelete(n.id)}
                          >
                            <Trash2 size={14} /> Delete
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingNotice ? 'Edit Notice' : 'Create Notice'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Water Supply Disruption"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  required
                  rows={5}
                  value={formData.body}
                  onChange={e => setFormData({...formData, body: e.target.value})}
                  placeholder="Write the notice content here..."
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
              </div>
              <div style={{
                background: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🔔</span>
                <span><strong>Instant Mobile Broadcast:</strong> Publishing will automatically trigger high-priority heads-up notifications on all residents' and guards' phones.</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)} disabled={isSending}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSending}>
                  {isSending ? 'Publishing & Broadcasting...' : editingNotice ? 'Update Notice' : '🚀 Publish & Broadcast to All'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
