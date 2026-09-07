import React, { useState, useEffect } from 'react';
import { Plus, Send } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';
import { broadcastPlatformMessage } from '../../services/fcmBroadcastService';
import CampaignsTable from '../../features/ad_campaigns/components/CampaignsTable';
import CreateAdModal from '../../features/ad_campaigns/components/CreateAdModal';
import PushBroadcastModal from '../../features/ad_campaigns/components/PushBroadcastModal';

export default function AdCampaigns() {
  const [showAdModal, setShowAdModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [societies, setSocieties] = useState([]);

  // Ad Form
  const [form, setForm] = useState({
    title: '',
    sponsor: '',
    imageUrl: '',
    targetUrl: '',
    target: 'All Societies',
  });
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
    superAdminService
      .getAllSocieties?.()
      .then((socs) => {
        if (socs) setSocieties(socs);
      })
      .catch(() => {});

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handlePublish = async () => {
    if (!form.title || !form.sponsor) {
      return alert('Please fill in Campaign Title and Sponsor Name.');
    }
    setSaving(true);
    try {
      await superAdminService.createAdCampaign(form);
      setShowAdModal(false);
      setForm({
        title: '',
        sponsor: '',
        imageUrl: '',
        targetUrl: '',
        target: 'All Societies',
      });
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
      const categoryIcon =
        broadcastForm.category === 'offer'
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>
            Ad & Broadcast Campaign Manager
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
            Push sponsored offers, emergency alerts, and announcements directly to
            resident & guard mobile apps.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--primary-surface)',
              color: 'var(--primary)',
              borderColor: 'var(--primary)',
            }}
            onClick={() => {
              setBroadcastResult(null);
              setShowBroadcastModal(true);
            }}
          >
            <Send size={18} /> Send Instant Push Broadcast
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAdModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Create Ad Banner
          </button>
        </div>
      </div>

      <CampaignsTable campaigns={campaigns} />

      {showAdModal && (
        <CreateAdModal
          form={form}
          setForm={setForm}
          onPublish={handlePublish}
          onClose={() => setShowAdModal(false)}
          saving={saving}
        />
      )}

      {showBroadcastModal && (
        <PushBroadcastModal
          broadcastForm={broadcastForm}
          setBroadcastForm={setBroadcastForm}
          broadcastResult={broadcastResult}
          sendingBroadcast={sendingBroadcast}
          societies={societies}
          onSend={handleSendBroadcast}
          onClose={() => setShowBroadcastModal(false)}
        />
      )}
    </div>
  );
}
