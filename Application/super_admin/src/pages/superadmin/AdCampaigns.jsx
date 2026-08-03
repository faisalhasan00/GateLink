import React, { useState, useEffect } from 'react';
import { Plus, Megaphone, Eye, MousePointer, Send } from 'lucide-react';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdCampaigns() {
  const [showModal, setShowModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ title: '', sponsor: '', imageUrl: '', targetUrl: '', target: 'All Societies' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'ad_campaigns'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handlePublish = async () => {
    if (!form.title || !form.sponsor) return alert('Please fill in Campaign Title and Sponsor Name.');
    setSaving(true);
    await addDoc(collection(db, 'ad_campaigns'), {
      ...form,
      status: 'Active',
      impressions: 0,
      clicks: 0,
      budget: 0,
      createdAt: serverTimestamp(),
    });
    setSaving(false);
    setShowModal(false);
    setForm({ title: '', sponsor: '', imageUrl: '', targetUrl: '', target: 'All Societies' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Ad & Broadcast Campaign Manager</h2>
          <p>Push sponsored ad banners and announcements to resident apps.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline"><Send size={18} /> Send Push Notification</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Create Ad Banner
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Campaign Title</th>
                <th>Sponsor / Client</th>
                <th>Target Audience</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No campaigns yet. Create your first one!</td></tr>
              ) : (
                campaigns.map((ad) => (
                  <tr key={ad.id}>
                    <td>
                      <strong>{ad.title}</strong>
                      {ad.imageUrl && (
                        <div style={{ marginTop: '4px' }}>
                          <img src={ad.imageUrl} alt="" style={{ height: '40px', borderRadius: '4px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                        </div>
                      )}
                    </td>
                    <td>{ad.sponsor}</td>
                    <td>{ad.target}</td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {ad.impressions?.toLocaleString()}</span></td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700 }}><MousePointer size={14} /> {ad.clicks?.toLocaleString()}</span></td>
                    <td>
                      <span className={`badge ${ad.status === 'Active' ? 'success' : 'primary'}`}>
                        {ad.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="sidebar-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '500px', padding: '24px', background: 'white' }}>
            <h3 style={{ marginBottom: '8px' }}>Create New Ad Campaign</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              This banner will be instantly pushed to the resident mobile apps.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Campaign Title *', key: 'title', placeholder: 'e.g. 20% Off Urban Company' },
                { label: 'Sponsor / Client Name *', key: 'sponsor', placeholder: 'e.g. Urban Company' },
                { label: 'Banner Image URL', key: 'imageUrl', placeholder: 'https://example.com/banner.jpg' },
                { label: 'Target Link (Click URL)', key: 'targetUrl', placeholder: 'https://urbancompany.com/offer' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Audience</label>
                <select
                  value={form.target}
                  onChange={e => setForm(prev => ({ ...prev, target: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                >
                  <option>All Societies</option>
                  <option>Specific Society Only</option>
                </select>
              </div>

              {form.imageUrl && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Banner Preview</label>
                  <img src={form.imageUrl} alt="banner preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePublish} disabled={saving}>
                  {saving ? 'Publishing...' : 'Publish Ad Live 🚀'}
                </button>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
