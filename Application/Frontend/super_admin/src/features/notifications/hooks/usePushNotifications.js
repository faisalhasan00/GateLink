import { useState, useEffect } from 'react';
import { broadcastPlatformMessage, subscribeBroadcastHistory } from '../../../services/fcmBroadcastService';
import { superAdminService } from '../../../services/superAdminService';

// Quick Preset Templates including Festive Wishes
export const PRESETS = [
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

export function getCategoryIcon(cat) {
  switch (cat) {
    case 'festival': return '🪔';
    case 'offer': return '🎁';
    case 'emergency': return '🚨';
    case 'update': return '⚡';
    case 'notice':
    default: return '📢';
  }
}

export function getCategoryColor(cat) {
  switch (cat) {
    case 'festival': return '#EC4899';
    case 'offer': return '#10B981';
    case 'emergency': return '#EF4444';
    case 'update': return '#3B82F6';
    case 'notice':
    default: return '#F59E0B';
  }
}

export function usePushNotifications() {
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

  return {
    form,
    setForm,
    societies,
    sending,
    lastResult,
    history,
    historyLoading,
    presetCategory,
    setPresetCategory,
    filteredPresets,
    applyPreset,
    handleSend,
  };
}
