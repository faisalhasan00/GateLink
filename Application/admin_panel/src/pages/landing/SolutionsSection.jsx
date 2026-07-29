import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function SolutionsSection({ onOpenDemo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('residents');

  const tabs = [
    { id: 'residents', label: 'Residents' },
    { id: 'management', label: 'Management' },
    { id: 'security', label: 'Security & Staff' }
  ];

  return (
    <section id="solutions" style={{ padding: '80px 0', background: isDark ? '#0F172A' : '#FFFFFF', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '40px', maxWidth: '900px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            SocietySphere for Every Need
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', lineHeight: 1.6, margin: 0 }}>
            Improve the security standards of your gated community with our technologically advanced and in-house engineered security and community management tool. We offer numerous innovative features that are sure to simplify your everyday chores.
          </p>
        </div>

        {/* Tab Navigation Row */}
        <div style={{ display: 'flex', gap: '40px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', marginBottom: '50px' }}>
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '12px 0 16px 0',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? (isDark ? '#FFFFFF' : '#2C2C2C') : (isDark ? '#94A3B8' : '#666666'),
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s ease'
                }}
              >
                <span>{t.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBorder"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#FF385C'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'residents' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}
          >
            {/* Visitor Management Card */}
            <div>
              <div style={{ width: '100%', maxWidth: '280px', height: '180px', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <img src="/assets/visitor_management.png" alt="Visitor Management System" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>
                Visitor Management System
              </h3>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0, maxWidth: '520px' }}>
                Easy tracking of visitors, cabs, and even your deliveries! It's a one-stop solution to manage all your visitors whether you are inside the society or not.
              </p>
            </div>

            {/* Domestic Staff Management Card */}
            <div>
              <div style={{ width: '100%', maxWidth: '280px', height: '180px', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <img src="/assets/domestic_staff.png" alt="Domestic Staff Management" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>
                Domestic Staff Management
              </h3>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0, maxWidth: '520px' }}>
                Get notified the moment your staff enter the society premises. Maintain their attendance digitally and also choose the best-rated domestic help for your home.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'management' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}
          >
            <div>
              <div style={{ width: '100%', maxWidth: '280px', height: '180px', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <img src="/assets/admin_dashboard_mockup.png" alt="Society Accounting" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>
                Society Accounting & Razorpay Billing
              </h3>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0, maxWidth: '520px' }}>
                Automate monthly maintenance billing, send instant WhatsApp reminders, collect online UPI payments, and generate GST compliant accounting ledgers.
              </p>
            </div>

            <div>
              <div style={{ width: '100%', maxWidth: '280px', height: '180px', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <img src="/assets/hero_illustration.png" alt="Digital Notice Board" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>
                Digital Notice Board & Grievances
              </h3>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0, maxWidth: '520px' }}>
                Broadcast urgent notices to all residents in 1 click and resolve flat complaint tickets with transparent SLA tracking.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}
          >
            <div>
              <div style={{ width: '100%', maxWidth: '280px', height: '180px', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <img src="/assets/guard_app_mockup.png" alt="Guard Console" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>
                Guard Gatekeeper Console
              </h3>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0, maxWidth: '520px' }}>
                5-Second entry verification with OTP passcode scanning, multilingual UI, and daily attendance logging for gate security staff.
              </p>
            </div>

            <div>
              <div style={{ width: '100%', maxWidth: '280px', height: '180px', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <img src="/assets/resident_app_mockup.png" alt="Emergency SOS" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>
                Emergency SOS Panic Siren
              </h3>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0, maxWidth: '520px' }}>
                1-Tap emergency panic siren alert triggered from resident smartphones directly to gatekeeper tablets and committee members.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
