import React from 'react';
import { Cloud, Activity, Smartphone, Lock, Flag, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrustedSection() {
  const trustMarkers = [
    { icon: <Cloud size={24} color="#818CF8" />, title: 'Secure Cloud', desc: 'AWS & Firebase Infrastructure' },
    { icon: <Activity size={24} color="#34D399" />, title: '99.9% Uptime', desc: 'Guaranteed SLA Availability' },
    { icon: <Smartphone size={24} color="#C084FC" />, title: 'Mobile Apps', desc: 'Native iOS & Android Apps' },
    { icon: <Lock size={24} color="#FBBF24" />, title: 'Data Encryption', desc: '256-Bit SSL & Bank-Grade Security' },
    { icon: <Flag size={24} color="#F472B6" />, title: 'Made for India', desc: 'Built for Indian Societies' },
  ];

  return (
    <section style={{ padding: '40px 0', background: '#090D16', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', alignItems: 'center' }}>
          {trustMarkers.map((marker, index) => (
            <motion.div
              key={marker.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {marker.icon}
              </div>
              <div>
                <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, margin: 0 }}>{marker.title}</h4>
                <p style={{ color: '#94A3B8', fontSize: '11px', margin: 0, marginTop: '2px' }}>{marker.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
