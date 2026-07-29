import React from 'react';
import { Cloud, Activity, Smartphone, Lock, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrustedSection() {
  const trustMarkers = [
    { icon: <Cloud size={20} color="#818CF8" />, title: 'Secure Cloud', desc: 'AWS & Firebase Infrastructure' },
    { icon: <Activity size={20} color="#34D399" />, title: '99.9% Uptime', desc: 'Guaranteed SLA Availability' },
    { icon: <Smartphone size={20} color="#C084FC" />, title: 'Mobile Apps', desc: 'Native iOS & Android Apps' },
    { icon: <Lock size={20} color="#FBBF24" />, title: 'Data Encryption', desc: '256-Bit SSL Bank Security' },
    { icon: <Flag size={20} color="#F472B6" />, title: 'Made for India', desc: 'Built for Indian Societies' },
  ];

  return (
    <section style={{ padding: '24px 0', background: 'rgba(9, 13, 22, 0.95)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  flexShrink: 0
                }}>
                  {marker.icon}
                </div>
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800 }}>{marker.title}</div>
                  <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 500 }}>{marker.desc}</div>
                </div>
              </motion.div>
              {index < trustMarkers.length - 1 && (
                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
