import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  ShieldAlert, 
  Car, 
  Waves, 
  Users, 
  FileText,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FeaturesSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: <UserCheck size={26} color="#2563EB" />,
      title: 'Instant Visitor Approval',
      desc: 'Residents receive real-time push notifications when visitors arrive at gate. Approve cab entries, deliveries, and guests with 1 tap.',
      tag: 'RESIDENT APP'
    },
    {
      icon: <ShieldCheck size={26} color="#059669" />,
      title: 'Guard Gatekeeper & QR Passes',
      desc: 'Streamlined gate check-in with OTP verification, digital passcode scanning, and instant gatekeeper logs.',
      tag: 'GUARD APP'
    },
    {
      icon: <CreditCard size={26} color="#D97706" />,
      title: 'Maintenance & Razorpay Billing',
      desc: 'Automated monthly maintenance generation, online UPI/Card payments, GST invoicing, and instant PDF receipts.',
      tag: 'FINANCIAL MANAGEMENT'
    },
    {
      icon: <ShieldAlert size={26} color="#DC2626" />,
      title: 'Real-Time Emergency SOS',
      desc: '1-tap emergency panic button for residents. Instant loud sirens on guard devices and committee broadcast.',
      tag: 'CRITICAL SECURITY'
    },
    {
      icon: <Car size={26} color="#7C3AED" />,
      title: 'Smart Parking Allocation',
      desc: 'Manage resident parking slots, registered vehicles, visitor parking authorizations, and prevent unauthorized parking.',
      tag: 'OPERATIONS'
    },
    {
      icon: <Waves size={26} color="#0284C7" />,
      title: 'Clubhouse & Amenity Bookings',
      desc: 'Reserve party halls, tennis courts, swimming pool slots, and gym times with conflict-free scheduling and fee collection.',
      tag: 'COMMUNITY LIVING'
    },
    {
      icon: <Users size={26} color="#059669" />,
      title: 'Domestic Helper Management',
      desc: 'Register maids, cooks, drivers, and tutors. Live attendance logs and resident approval workflows.',
      tag: 'DAILY HELP'
    },
    {
      icon: <FileText size={26} color="#DB2777" />,
      title: 'Staff RBAC & Audit Trails',
      desc: 'Granular role-based permissions for society committee members, treasurers, and security supervisors.',
      tag: 'GOVERNANCE'
    },
  ];

  return (
    <section id="features" style={{ padding: '90px 0', background: isDark ? '#0F172A' : '#F8FAFC', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
            <Sparkles size={14} /> INTELLIGENT MODULES
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-1px', margin: '0 0 16px 0' }}>
            Everything Your Housing Society Needs
          </h2>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#475569', margin: 0, lineHeight: 1.6 }}>
            Eliminate fragmented registers, manual WhatsApp groups, and paper bills. Upgrade to enterprise digital governance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {features.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="hover-card-elevate"
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                borderRadius: '20px',
                padding: '28px 24px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0'
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9', color: isDark ? '#CBD5E1' : '#475569', letterSpacing: '0.5px' }}>
                    {item.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 10px 0' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
