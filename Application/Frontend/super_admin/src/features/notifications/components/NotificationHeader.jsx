import React from 'react';
import { Radio } from 'lucide-react';

export default function NotificationHeader({ totalBroadcasts }) {
  return (
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
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B' }}>{totalBroadcasts}</div>
          <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Broadcasts</div>
        </div>
      </div>
    </div>
  );
}
