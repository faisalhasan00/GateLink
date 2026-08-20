import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Sparkles, 
  Smartphone, 
  Users, 
  Shield, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Zap, 
  Flame,
  Radio,
  RefreshCw,
  Heart
} from 'lucide-react';
import { broadcastPlatformMessage, subscribeBroadcastHistory } from '../../services/fcmBroadcastService';
import { superAdminService } from '../../services/superAdminService';
import Button from '../../components/ui/Button';

export default function PushNotifications() {
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'festival',
    scope: 'all',
    societyId: '',
  });

  const [societies, setSocieties] = useState([]);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [presetCategory, setPresetCategory] = useState('all');

  // Quick Preset Templates including Festive Wishes
  const PRESETS = [
    // 🪔 Festival Wishes
    {
      group: 'festival',
      label: '🪔 Happy Diwali Wishes',
      category: 'festival',
      title: 'Wishing You a Joyous & Prosperous Diwali! ✨',
      body: 'May the divine festival of lights bring boundless health, happiness, prosperity, and peace to you and your loved ones.',
    },
    {
      group: 'festival',
      label: '🌙 Eid Mubarak Greetings',
      category: 'festival',
      title: 'Eid Mubarak to You & Your Family! 🌙',
      body: 'May this blessed occasion bring immense joy, harmony, and countless blessings to your home and community.',
    },
    {
      group: 'festival',
      label: '🎄 Merry Christmas & Holidays',
      category: 'festival',
      title: 'Merry Christmas & Joyful Holidays! 🎄',
      body: 'Wishing you a season filled with peace, warmth, happiness, and memorable moments with your loved ones.',
    },
    {
      group: 'festival',
      label: '🎨 Happy Holi Celebrations',
      category: 'festival',
      title: 'Happy & Colorful Holi! 🎨',
      body: 'May the vibrant colors of Holi paint your life with abundant joy, friendship, good health, and success.',
    },
    {
      group: 'festival',
      label: '🎆 Happy New Year 2027',
      category: 'festival',
      title: 'Happy New Year from GateLink! 🎆',
      body: 'Wishing you 365 days of prosperity, joy, safety, and triumph in the upcoming new year!',
    },
    {
      group: 'festival',
      label: '🇮🇳 Independence / Republic Day',
      category: 'festival',
      title: 'Happy Independence Day! 🇮🇳',
      body: 'Celebrating freedom, pride, unity, and strength together as one united community. Jai Hind!',
    },
    {
      group: 'festival',
      label: '🙏 Ganesh Chaturthi & Navratri',
      category: 'festival',
      title: 'Happy Festive Greetings! 🪔',
      body: 'May the divine blessings bring wisdom, prosperity, and joy into your household this festive season.',
    },

    // 🎁 Offers & Promos
    {
      group: 'offer',
      label: '🎁 Special 25% Off Promo',
      category: 'offer',
      title: 'Mega Flash Discount: 25% Off on Groceries',
      body: 'Get 25% cashback on all LocalMart orders placed this weekend in your resident mobile app!',
    },
    {
      group: 'offer',
      label: '🏷️ Free Home Cleaning Trial',
      category: 'offer',
      title: 'Exclusive Weekend Partner Offer: Free Home Service',
      body: 'Book trusted home deep cleaning through GateLink concierge and get ₹500 instant discount.',
    },

    // 📢 Platform Notices
    {
      group: 'notice',
      label: '📢 Scheduled System Maintenance',
      category: 'notice',
      title: 'Scheduled System Performance Optimization',
      body: 'GateLink services will undergo routine maintenance tonight from 2:00 AM to 3:00 AM IST.',
    },

    // 🚨 Emergency & Security
    {
      group: 'emergency',
      label: '🚨 High-Alert Gate Security',
      category: 'emergency',
      title: 'Enhanced Gate Verification Active',
      body: 'All gate security passes and visitor pre-approvals are strictly monitored today. Please check in-app alerts.',
    },

    // ⚡ App Updates
    {
      group: 'update',
      label: '⚡ New Version Available',
      category: 'update',
      title: 'New Features Available on GateLink!',
      body: 'Update your mobile app to experience instant biometric logins and ultra-fast visitor approvals.',
    },
  ];

  useEffect(() => {
    // Fetch Societies for Scope Selector
    superAdminService.getAllSocieties?.().then(socs => {
      if (socs) setSocieties(socs);
    }).catch(err => console.error('Error fetching societies:', err));

    // Subscribe to Broadcasts History
    const unsub = subscribeBroadcastHistory(
      (data) => {
        setHistory(data);
        setHistoryLoading(false);
      },
      (err) => {
        console.error('Error subscribing to broadcast history:', err);
        setHistoryLoading(false);
      }
    );

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'festival': return '🪔';
      case 'offer': return '🎁';
      case 'emergency': return '🚨';
      case 'update': return '⚡';
      case 'notice':
      default: return '📢';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'festival': return '#EC4899';
      case 'offer': return '#10B981';
      case 'emergency': return '#EF4444';
      case 'update': return '#3B82F6';
      case 'notice':
      default: return '#F59E0B';
    }
  };

  const applyPreset = (preset) => {
    setForm(prev => ({
      ...prev,
      category: preset.category,
      title: preset.title,
      body: preset.body,
    }));
  };

  const filteredPresets = presetCategory === 'all' 
    ? PRESETS 
    : PRESETS.filter(p => p.group === presetCategory);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      return alert('Please enter both a Notification Title and Message Body.');
    }

    setSending(true);
    setLastResult(null);

    try {
      const formattedTitle = `${getCategoryIcon(form.category)} ${form.title.trim()}`;
      const result = await broadcastPlatformMessage({
        title: formattedTitle,
        body: form.body.trim(),
        category: form.category,
        scope: form.scope,
        societyId: form.societyId,
      });

      setLastResult(result);
      if (result.success > 0) {
        setForm(prev => ({ ...prev, title: '', body: '' }));
      }
    } catch (err) {
      console.error('Error broadcasting message:', err);
      alert('Broadcast Error: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(30, 58, 138, 0.25)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Radio size={14} className="pulse-icon" /> GOOGLE FCM ENGINE ACTIVE
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Universal Push Notification Dispatcher
          </h1>
          <p style={{ margin: '6px 0 0 0', opacity: 0.85, fontSize: '14px', maxWidth: '640px' }}>
            Send Festival Wishes, Sponsored Offers, Security Alerts, and Official Announcements directly to resident & guard mobile phones with high priority.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '12px 20px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B' }}>{history.length}</div>
            <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Broadcasts</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Composer & Device Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.9fr)', gap: '24px', alignItems: 'start' }}>
        {/* Left: Compose Form */}
        <div 
          style={{ 
            backgroundColor: 'var(--card-bg, #FFFFFF)', 
            borderRadius: '18px', 
            padding: '28px', 
            border: '1px solid var(--border-color, #E2E8F0)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Compose Notification</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #64748B)' }}>Send festival greetings, offers, or platform announcements</p>
              </div>
            </div>
          </div>

          {/* Quick Presets Filter Tabs & Chips */}
          <div style={{ marginBottom: '24px', backgroundColor: 'var(--bg-secondary, #F8FAFC)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color, #E2E8F0)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary, #0F172A)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#F59E0B" /> QUICK TEMPLATES & FESTIVAL WISHES
              </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'all', label: 'All Presets' },
                { id: 'festival', label: '🪔 Festival Wishes' },
                { id: 'offer', label: '🎁 Offers & Promos' },
                { id: 'notice', label: '📢 Notices' },
                { id: 'emergency', label: '🚨 Alerts' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPresetCategory(tab.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: presetCategory === tab.id ? '#1E3A8A' : '#E2E8F0',
                    color: presetCategory === tab.id ? '#FFFFFF' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Preset chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {filteredPresets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(p)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Category Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Alert Category & Priority Icon
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'festival', label: '🪔 Festival', desc: 'Greetings' },
                  { id: 'offer', label: '🎁 Offer / Ad', desc: 'Promotional' },
                  { id: 'notice', label: '📢 Notice', desc: 'General Info' },
                  { id: 'emergency', label: '🚨 Urgent', desc: 'High Priority' },
                  { id: 'update', label: '⚡ Update', desc: 'New Version' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, category: cat.id }))}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: form.category === cat.id ? '2px solid #1E3A8A' : '1px solid var(--border-color, #E2E8F0)',
                      backgroundColor: form.category === cat.id ? 'rgba(30, 58, 138, 0.06)' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '13px', color: form.category === cat.id ? '#1E3A8A' : 'inherit' }}>{cat.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Scope */}
            <div style={{ display: 'grid', gridTemplateColumns: form.scope === 'society' ? '1fr 1fr' : '1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Target Audience
                </label>
                <select
                  value={form.scope}
                  onChange={(e) => setForm(prev => ({ ...prev, scope: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, #CBD5E1)',
                    backgroundColor: 'var(--input-bg, #FFFFFF)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  <option value="all">🌍 All Platform Users (Residents + Guards)</option>
                  <option value="residents">🏠 Residents & Owners Only</option>
                  <option value="guards">🛡️ Security Guards Only</option>
                  <option value="society">🏢 Specific Society</option>
                </select>
              </div>

              {form.scope === 'society' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    Select Society
                  </label>
                  <select
                    value={form.societyId}
                    onChange={(e) => setForm(prev => ({ ...prev, societyId: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color, #CBD5E1)',
                      backgroundColor: 'var(--input-bg, #FFFFFF)',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                    required={form.scope === 'society'}
                  >
                    <option value="">-- Choose Society --</option>
                    {societies.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name || s.id} ({s.code || s.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Notification Title */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Notification Title
              </label>
              <input
                type="text"
                placeholder="e.g. Wishing You a Joyous & Prosperous Diwali! ✨"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color, #CBD5E1)',
                  backgroundColor: 'var(--input-bg, #FFFFFF)',
                  fontSize: '14px',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Notification Message */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700 }}>
                  Notification Message Body
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                  {form.body.length} / 250 characters
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Write the heartfelt festive greetings or detailed message to appear on all lockscreens..."
                value={form.body}
                onChange={(e) => setForm(prev => ({ ...prev, body: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color, #CBD5E1)',
                  backgroundColor: 'var(--input-bg, #FFFFFF)',
                  fontSize: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Dispatch Result Status */}
            {lastResult && (
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: lastResult.success > 0 ? '#ECFDF5' : '#FEF2F2',
                  border: `1px solid ${lastResult.success > 0 ? '#A7F3D0' : '#FECACA'}`,
                  color: lastResult.success > 0 ? '#065F46' : '#991B1B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                {lastResult.success > 0 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>
                  {lastResult.total === 0
                    ? 'No registered active devices found for this target scope.'
                    : `Dispatched successfully to ${lastResult.success} / ${lastResult.total} mobile devices!`}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
              <Button
                type="submit"
                variant="primary"
                loading={sending}
                style={{ minWidth: '180px', fontWeight: 800 }}
              >
                <Send size={16} /> Broadcast Notification
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Realistic Mobile Preview Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div 
            style={{
              backgroundColor: 'var(--card-bg, #FFFFFF)',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid var(--border-color, #E2E8F0)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Smartphone size={18} color="#1E3A8A" />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Live Mobile Lockscreen Preview</h3>
            </div>

            {/* Phone Screen Mockup */}
            <div 
              style={{
                width: '100%',
                borderRadius: '24px',
                background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
                padding: '20px 16px 32px 16px',
                color: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                boxSizing: 'border-box'
              }}
            >
              {/* Phone Status Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', opacity: 0.75, marginBottom: '24px', padding: '0 4px' }}>
                <span>10:42 PM</span>
                <span>5G • 100% 🔋</span>
              </div>

              {/* Lockscreen Time */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-1px' }}>10:42</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Wednesday, 20 August</div>
              </div>

              {/* Heads-up Push Notification Card */}
              <div 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  color: '#0F172A',
                  borderRadius: '16px',
                  padding: '14px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  animation: 'slideDown 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#1E3A8A', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>
                      G
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E3A8A' }}>GateLink</span>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>• now</span>
                  </div>
                  <span style={{ fontSize: '10px', backgroundColor: `${getCategoryColor(form.category)}18`, color: getCategoryColor(form.category), padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                    {form.category.toUpperCase()}
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '3px', color: '#0F172A' }}>
                  {form.title ? `${getCategoryIcon(form.category)} ${form.title}` : `${getCategoryIcon(form.category)} Notification Title`}
                </div>

                <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
                  {form.body || 'Your notification message body will appear here on resident and guard devices.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div
        style={{
          backgroundColor: 'var(--card-bg, #FFFFFF)',
          borderRadius: '18px',
          padding: '28px',
          border: '1px solid var(--border-color, #E2E8F0)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Broadcast History & Telemetry</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary, #64748B)' }}>Real-time logs of all sent push notifications and delivery stats</p>
          </div>
        </div>

        {historyLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary, #64748B)' }}>Loading broadcast logs...</div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary, #64748B)' }}>
            <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: 700 }}>No broadcasts sent yet</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Compose a notification above to send your first message.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color, #E2E8F0)', color: 'var(--text-secondary, #64748B)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>NOTIFICATION & TITLE</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>CATEGORY</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>AUDIENCE / SCOPE</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>DELIVERY METRICS</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>DISPATCHED AT</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color, #F1F5F9)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary, #0F172A)' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)', marginTop: '2px', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.body}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 800,
                          backgroundColor: `${getCategoryColor(item.category)}18`,
                          color: getCategoryColor(item.category)
                        }}
                      >
                        {item.category?.toUpperCase() || 'NOTICE'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {item.scope === 'all' && '🌍 All Users'}
                      {item.scope === 'residents' && '🏠 Residents'}
                      {item.scope === 'guards' && '🛡️ Guards'}
                      {item.scope === 'society' && `🏢 ${item.societyId}`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: '#10B981' }}>
                          ✓ {item.successCount || item.deliveredCount || 0}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                          / {item.totalRecipients || 0} devices
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Just now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
