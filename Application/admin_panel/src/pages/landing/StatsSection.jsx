import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building, ShieldCheck, UserCheck } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { icon: <Building size={28} color="#818CF8" />, count: '500+', label: 'Societies Onboarded', sub: 'Across Tier 1 & Tier 2 Cities' },
    { icon: <Users size={28} color="#34D399" />, count: '250,000+', label: 'Active Residents', sub: 'Using Resident Mobile App Daily' },
    { icon: <UserCheck size={28} color="#C084FC" />, count: '10M+', label: 'Gate Check-ins', sub: 'Processed with Zero Security Lapses' },
    { icon: <ShieldCheck size={28} color="#FBBF24" />, count: '5,000+', label: 'Security Staff', sub: 'Active Gatekeepers on Duty' },
  ];

  return (
    <section style={{ padding: '80px 0', background: '#0B1120', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#818CF8', letterSpacing: '1px', textTransform: 'uppercase' }}>PROVEN SCALE & TRUST</span>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', marginTop: '8px' }}>
            Empowering Modern Housing Societies Everywhere
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              style={{
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                borderRadius: '20px',
                padding: '32px 24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                {stat.icon}
              </div>

              <h3 style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-1px', background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.count}
              </h3>

              <div style={{ fontSize: '16px', fontWeight: 800, color: '#F1F5F9', marginTop: '6px' }}>
                {stat.label}
              </div>

              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
