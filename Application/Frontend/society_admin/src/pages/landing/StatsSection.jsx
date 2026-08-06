import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building, ShieldCheck, UserCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function StatsSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    { icon: <Building size={26} color="#2563EB" />, count: '500+', label: 'Societies Onboarded', sub: 'Across Tier 1 & Tier 2 Cities' },
    { icon: <Users size={26} color="#059669" />, count: '250,000+', label: 'Active Residents', sub: 'Using Resident Mobile App Daily' },
    { icon: <UserCheck size={26} color="#7C3AED" />, count: '10M+', label: 'Gate Check-ins', sub: 'Processed with Zero Security Lapses' },
    { icon: <ShieldCheck size={26} color="#D97706" />, count: '5,000+', label: 'Security Staff', sub: 'Active Gatekeepers on Duty' },
  ];

  return (
    <section style={{ padding: '80px 0', background: isDark ? '#0F172A' : '#FFFFFF', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', letterSpacing: '1px', textTransform: 'uppercase' }}>PROVEN SCALE & TRUST</span>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-1px', marginTop: '8px' }}>
            Empowering Modern Housing Societies Everywhere
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="hover-card-elevate"
              style={{
                background: isDark ? '#1E293B' : '#F8FAFC',
                borderRadius: '20px',
                padding: '32px 24px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                {stat.icon}
              </div>

              <h3 style={{ fontSize: '38px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: 0, letterSpacing: '-1px' }}>
                {stat.count}
              </h3>

              <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B', marginTop: '6px' }}>
                {stat.label}
              </div>

              <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '4px' }}>
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
