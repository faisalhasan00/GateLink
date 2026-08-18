import React from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import Button from '../../../../components/ui/Button';

export default function PartnerFormSuccess({ submittedRef, selectedTier, onReset }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', border: '2px solid #1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
        <CheckCircle2 size={36} color="#1E3A8A" />
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0' }}>
        {selectedTier === 'growth' ? 'Broker Partnership Application Received!' : 'Society Lead Registered Successfully!'}
      </h3>
      <p style={{ color: isDark ? '#94A3B8' : '#666666', fontSize: '15px', lineHeight: 1.6, margin: '0 auto 24px auto', maxWidth: '520px' }}>
        Your Reference ID is <strong style={{ color: isDark ? '#FFFFFF' : '#2C2C2C' }}>{submittedRef}</strong>. Our enterprise team will schedule a demo with the society committee and keep you updated via WhatsApp.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={onReset}
          variant="primary"
          size="medium"
          icon={Plus}
          iconPosition="left"
        >
          Submit Another Lead
        </Button>
      </div>
    </div>
  );
}
