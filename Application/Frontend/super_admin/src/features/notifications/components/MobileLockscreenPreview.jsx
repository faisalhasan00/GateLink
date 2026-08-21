import React from 'react';
import { Smartphone } from 'lucide-react';
import { getCategoryIcon, getCategoryColor } from '../hooks/usePushNotifications';

export default function MobileLockscreenPreview({ category, title, body }) {
  return (
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
              <span style={{ fontSize: '10px', backgroundColor: `${getCategoryColor(category)}18`, color: getCategoryColor(category), padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                {(category || 'notice').toUpperCase()}
              </span>
            </div>

            <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '3px', color: '#0F172A' }}>
              {title ? `${getCategoryIcon(category)} ${title}` : `${getCategoryIcon(category)} Notification Title`}
            </div>

            <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
              {body || 'Your notification message body will appear here on resident and guard devices.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
