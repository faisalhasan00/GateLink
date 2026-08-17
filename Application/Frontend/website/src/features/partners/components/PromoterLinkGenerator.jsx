import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function PromoterLinkGenerator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [promoterCode, setPromoterCode] = useState('PROMO99');
  const [copied, setCopied] = useState(false);

  const cleanCode = promoterCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') || 'PARTNER';
  const referralUrl = `https://gatelink.in/partners?ref=${cleanCode}`;
  const shareMessage = `🏢 Partner with GateLink Society OS and earn up to 10% Month 1 + 2% Lifetime Recurring Monthly Income by onboarding residential apartments in your city! Register free here: ${referralUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleTelegramShare = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`, '_blank');
  };

  return (
    <section style={{ padding: '60px 0', maxWidth: '900px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '16px',
        padding: '36px',
        border: '2px solid #0EA5E9',
        boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
            FREELANCER & SOCIAL MEDIA CREATOR TOOL
          </span>
          <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '6px 0 8px 0' }}>
            Generate Your Viral Referral Link
          </h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#555555', margin: 0 }}>
            Share your link on WhatsApp, Instagram, LinkedIn, or YouTube. When someone registers using your link and onboards a society, you earn sub-partner override commissions!
          </p>
        </div>

        {/* Code Input & Link Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '6px' }}>Your Custom Referral Code</label>
            <input
              type="text"
              value={promoterCode}
              onChange={(e) => setPromoterCode(e.target.value)}
              placeholder="e.g. FAISAL99"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                borderRadius: '10px',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC',
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#2C2C2C',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '6px' }}>Generated Shareable URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={referralUrl}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #E2E8F0',
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  color: isDark ? '#38BDF8' : '#0284C7',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              />
              <button
                onClick={handleCopy}
                style={{
                  padding: '0 16px',
                  borderRadius: '10px',
                  backgroundColor: copied ? '#059669' : '#1E3A8A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1-Tap Share Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '10px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9' }}>
          <button
            onClick={handleWhatsAppShare}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MessageCircle size={16} />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleTelegramShare}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: '#0088CC',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={16} />
            <span>Telegram</span>
          </button>

          <button
            onClick={handleLinkedInShare}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: '#0A66C2',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
            <span>LinkedIn Post</span>
          </button>
        </div>
      </div>
    </section>
  );
}
