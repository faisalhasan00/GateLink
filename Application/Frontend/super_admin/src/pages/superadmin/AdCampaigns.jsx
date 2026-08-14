import React, { useState, useEffect } from 'react';
import { Plus, Eye, MousePointer, Send } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';

export default function AdCampaigns() {
  const [showModal, setShowModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ title: '', sponsor: '', imageUrl: '', targetUrl: '', target: 'All Societies' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = superAdminService.subscribeAdCampaigns(
      (data) => setCampaigns(data),
      (err) => console.error(err)
    );

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handlePublish = async () => {
    if (!form.title || !form.sponsor) return alert('Please fill in Campaign Title and Sponsor Name.');
    setSaving(true);
    try {
      await superAdminService.createAdCampaign(form);
      setShowModal(false);
      setForm({ title: '', sponsor: '', imageUrl: '', targetUrl: '', target: 'All Societies' });
    } catch (e) {
      alert('Error publishing campaign: ' + e.message);
    } finally {
      setSaving(false);
    }
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
                    </td>
                    <td>{ad.sponsor}</td>
                    <td>{ad.target}</td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {ad.impressions?.toLocaleString() || 0}</span></td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700 }}><MousePointer size={14} /> {ad.clicks?.toLocaleString() || 0}</span></td>
                    <td>
                      <span className="badge success">{ad.status || 'Active'}</span>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Campaign Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 20% Off Urban Company"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Sponsor / Client Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Urban Company"
                  value={form.sponsor}
                  onChange={e => setForm(prev => ({ ...prev, sponsor: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                />
              </div>
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
