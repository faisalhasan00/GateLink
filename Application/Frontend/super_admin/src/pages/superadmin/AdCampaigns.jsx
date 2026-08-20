import React, { useState, useEffect } from 'react';
import { Plus, Eye, MousePointer, Send, Megaphone, Bell, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';
import { broadcastPlatformMessage } from '../../services/fcmBroadcastService';

export default function AdCampaigns() {
  const [showAdModal, setShowAdModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [societies, setSocieties] = useState([]);
  
  // Ad Form
  const [form, setForm] = useState({ title: '', sponsor: '', imageUrl: '', targetUrl: '', target: 'All Societies' });
  const [saving, setSaving] = useState(false);

  // Push Broadcast Form
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    body: '',
    category: 'offer',
    scope: 'all',
    societyId: '',
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  useEffect(() => {
    const unsub = superAdminService.subscribeAdCampaigns(
      (data) => setCampaigns(data),
      (err) => console.error(err)
    );

    // Fetch societies for targeting dropdown
    superAdminService.getAllSocieties?.().then(socs => {
      if (socs) setSocieties(socs);
    }).catch(() => {});

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handlePublish = async () => {
    if (!form.title || !form.sponsor) return alert('Please fill in Campaign Title and Sponsor Name.');
    setSaving(true);
    try {
      await superAdminService.createAdCampaign(form);
      setShowAdModal(false);
      setForm({ title: '', sponsor: '', imageUrl: '', targetUrl: '', target: 'All Societies' });
    } catch (e) {
      alert('Error publishing campaign: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.body) {
      return alert('Please enter both Title and Message for the broadcast.');
    }

    setSendingBroadcast(true);
    setBroadcastResult(null);

    try {
      const categoryIcon = broadcastForm.category === 'offer' 
        ? '🎁' 
        : broadcastForm.category === 'emergency' 
        ? '🚨' 
        : broadcastForm.category === 'update'
        ? '⚡'
        : '📢';

      const res = await broadcastPlatformMessage({
        title: `${categoryIcon} ${broadcastForm.title}`,
        body: broadcastForm.body,
        category: broadcastForm.category,
        scope: broadcastForm.scope,
        societyId: broadcastForm.societyId,
      });

      setBroadcastResult(res);
      if (res.total === 0) {
        alert('No registered devices found for the selected scope.');
      }
    } catch (err) {
      console.error('Error sending broadcast:', err);
      alert('Error sending broadcast: ' + err.message);
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Ad & Broadcast Campaign Manager</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Push sponsored offers, emergency alerts, and announcements directly to resident & guard mobile apps.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-surface)', color: 'var(--primary)', borderColor: 'var(--primary)' }}
            onClick={() => {
              setBroadcastResult(null);
              setShowBroadcastModal(true);
            }}
          >
            <Send size={18} /> Send Instant Push Broadcast
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Create Ad Banner
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">Promotional Ad Banners & Cross-Society Campaigns</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{campaigns.length} Active Campaigns</span>
        </div>
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

      {/* ── CREATE AD BANNER MODAL ── */}
      {showAdModal && (
        <div className="sidebar-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '500px', padding: '24px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Create New Ad Campaign</h3>
              <button className="btn-icon" onClick={() => setShowAdModal(false)}><X size={20} /></button>
            </div>
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
                  {saving ? 'Publishing...' : 'Publish Ad Live'}
                </button>
                <button className="btn btn-outline" onClick={() => setShowAdModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUPER ADMIN INSTANT PUSH BROADCAST MODAL ── */}
      {showBroadcastModal && (
        <div className="sidebar-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Megaphone size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Platform Push Broadcast</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Instantly wake up closed mobile apps with heads-up banners</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setShowBroadcastModal(false)}><X size={20} /></button>
            </div>

            {broadcastResult && (
              <div style={{
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: broadcastResult.success > 0 ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${broadcastResult.success > 0 ? '#10B981' : '#EF4444'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: broadcastResult.success > 0 ? '#065F46' : '#991B1B',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {broadcastResult.success > 0 ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span>
                  {broadcastResult.success > 0
                    ? `Broadcast Delivered! Successfully reached ${broadcastResult.success} active device(s).`
                    : 'Broadcast failed or no active devices registered.'}
                </span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Broadcast Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'offer', label: '🎁 Offer', desc: 'Promotions & Deals' },
                    { id: 'announcement', label: '📢 Notice', desc: 'Platform Notice' },
                    { id: 'emergency', label: '🚨 Urgent', desc: 'Critical Alert' },
                    { id: 'update', label: '⚡ Update', desc: 'App Features' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setBroadcastForm(p => ({ ...p, category: cat.id }))}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        border: broadcastForm.category === cat.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: broadcastForm.category === cat.id ? 'var(--primary-surface)' : 'white',
                        color: broadcastForm.category === cat.id ? 'var(--primary)' : 'inherit',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '13px'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Target Audience</label>
                <select
                  value={broadcastForm.scope}
                  onChange={e => setBroadcastForm(p => ({ ...p, scope: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                >
                  <option value="all">🌍 All Users Across All Societies (Residents & Guards)</option>
                  <option value="residents">🏡 All Residents Only</option>
                  <option value="guards">🛡️ All Security Guards Only</option>
                  <option value="society">🏢 Specific Society</option>
                </select>
              </div>

              {broadcastForm.scope === 'society' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Select Society</label>
                  <select
                    value={broadcastForm.societyId}
                    onChange={e => setBroadcastForm(p => ({ ...p, societyId: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                    required
                  >
                    <option value="">-- Choose Society --</option>
                    {societies.map(s => (
                      <option key={s.id} value={s.id}>{s.name || s.societyName || s.id}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Notification Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Exclusive Diwali Perk for Residents"
                  value={broadcastForm.title}
                  onChange={e => setBroadcastForm(p => ({ ...p, title: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Notification Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Claim 25% cashback on home maintenance and deep cleaning this weekend."
                  value={broadcastForm.body}
                  onChange={e => setBroadcastForm(p => ({ ...p, body: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              {/* Live Preview Card */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  📱 Live Mobile Heads-Up Preview
                </div>
                <div style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#1E3A8A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>
                    GL
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {broadcastForm.title ? `${broadcastForm.category === 'offer' ? '🎁' : broadcastForm.category === 'emergency' ? '🚨' : '📢'} ${broadcastForm.title}` : 'Notification Title Preview'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', lineHeight: 1.4 }}>
                      {broadcastForm.body || 'Your notification message body will appear right here on the phone screen with high priority heads-up visibility.'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowBroadcastModal(false)}
                  disabled={sendingBroadcast}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  disabled={sendingBroadcast}
                >
                  <Send size={16} />
                  {sendingBroadcast ? 'Broadcasting via Google FCM...' : '🚀 Send Push Broadcast to All Devices'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
