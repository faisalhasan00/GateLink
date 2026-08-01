import React from 'react';
import { Cloud, Activity, Smartphone, Lock, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function TrustedSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const trustMarkers = [
    { icon: <Cloud size={20} color="#2563EB" />, title: 'AWS Cloud Secured', desc: 'Enterprise Cloud Infrastructure' },
    { icon: <Activity size={20} color="#059669" />, title: '99.9% Uptime SLA', desc: 'Guaranteed Availability' },
    { icon: <Smartphone size={20} color="#7C3AED" />, title: 'Native Mobile Apps', desc: 'iOS & Android Certified' },
    { icon: <Lock size={20} color="#D97706" />, title: '256-Bit Encryption', desc: 'DPDP Privacy Compliant' },
    { icon: <Flag size={20} color="#DC2626" />, title: 'Made for India', desc: 'Built for Indian Societies' },
  ];

  return (
    <section style={{ padding: '24px 0', background: isDark ? '#0F172A' : '#F8FAFC', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          {trustMarkers.map((marker, index) => (
            <React.Fragment key={marker.title}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  flexShrink: 0
                }}>
                  {marker.icon}
                </div>
                <div>
                  <div style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13px', fontWeight: 800 }}>{marker.title}</div>
                  <div style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '11px', fontWeight: 600 }}>{marker.desc}</div>
                </div>
              </motion.div>
              {index < trustMarkers.length - 1 && (
                <div style={{ width: '1px', height: '24px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
