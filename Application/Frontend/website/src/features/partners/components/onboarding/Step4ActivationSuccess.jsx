import React from 'react';
import { CheckCircle2, MessageSquare, Copy, RefreshCw } from 'lucide-react';
import Button from '../../../../components/ui/Button';

export default function Step4ActivationSuccess({
  activationResult,
  onReset,
  isDark,
}) {
  if (!activationResult) return null;

  const { activationCode, activationUrl, rwaPhone, rwaName, societyName, referenceId } = activationResult;

  const whatsappMessage = encodeURIComponent(
    `Hello ${rwaName} ji,\n\n` +
    `Your housing society *${societyName}* has been configured on GateLink Society OS!\n\n` +
    `🔑 Secret RWA Activation Code: *${activationCode}*\n` +
    `🔗 Instant Activation Link: ${activationUrl}\n\n` +
    `Click the link to complete your society admin password setup and activate resident & guard features instantly.`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?phone=91${rwaPhone.replace(/\D/g, '')}&text=${whatsappMessage}`;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(activationUrl);
    alert('✓ RWA Activation Link copied to clipboard!');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px 10px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ECFDF5', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
        <CheckCircle2 size={36} color="#059669" />
      </div>

      <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px 0', color: isDark ? '#FFFFFF' : '#1E293B' }}>
        Society Provisioned & Ready for Activation!
      </h3>
      <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 auto 24px auto', maxWidth: '540px', lineHeight: 1.5 }}>
        Partner Lead <strong style={{ color: '#1E3A8A' }}>{referenceId}</strong> has been generated. Send the secret activation code to RWA Secretary <strong>{rwaName}</strong> to launch the society.
      </p>

      {/* Secret Code Card */}
      <div style={{
        backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
        padding: '20px',
        borderRadius: '14px',
        border: '1px solid #BFDBFE',
        maxWidth: '480px',
        margin: '0 auto 24px auto'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '1px' }}>
          SECRET RWA ACTIVATION CODE
        </div>
        <div style={{ fontSize: '32px', fontWeight: 900, color: '#059669', letterSpacing: '2px', margin: '8px 0' }}>
          {activationCode}
        </div>
        <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', wordBreak: 'break-all' }}>
          {activationUrl}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
          }}
        >
          <MessageSquare size={18} /> Send WhatsApp Activation Invite
        </a>

        <Button onClick={copyLinkToClipboard} variant="outline" size="medium" icon={Copy}>
          Copy Activation Link
        </Button>
      </div>

      <div>
        <Button onClick={onReset} variant="ghost" size="small" icon={RefreshCw}>
          Onboard Another Society
        </Button>
      </div>
    </div>
  );
}
