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

export default function FeaturesSection() {
  const features = [
    {
      icon: <UserCheck size={28} color="#818CF8" />,
      title: 'Instant Visitor Approval',
      desc: 'Residents receive real-time push notifications when visitors arrive at gate. Approve cab entries, deliveries, and guests with 1 tap.',
      tag: 'RESIDENT APP'
    },
    {
      icon: <ShieldCheck size={28} color="#34D399" />,
      title: 'Guard Gatekeeper & QR Passes',
      desc: 'Streamlined gate check-in with OTP verification, digital passcode scanning, and instant gatekeeper logs.',
      tag: 'GUARD APP'
    },
    {
      icon: <CreditCard size={28} color="#FBBF24" />,
      title: 'Maintenance & Razorpay Billing',
      desc: 'Automated monthly maintenance generation, online UPI/Card payments, GST invoicing, and instant PDF receipts.',
      tag: 'FINANCIAL MANAGEMENT'
    },
    {
      icon: <ShieldAlert size={28} color="#F87171" />,
      title: 'Real-Time Emergency SOS',
      desc: '1-tap emergency panic button for residents. Instant loud sirens on guard devices and committee broadcast.',
      tag: 'CRITICAL SECURITY'
    },
    {
      icon: <Car size={28} color="#C084FC" />,
      title: 'Smart Parking Allocation',
      desc: 'Manage resident parking slots, registered vehicles, visitor parking authorizations, and prevent unauthorized parking.',
      tag: 'OPERATIONS'
    },
    {
      icon: <Waves size={28} color="#38BDF8" />,
      title: 'Clubhouse & Amenity Bookings',
      desc: 'Reserve party halls, tennis courts, swimming pool slots, and gym times with conflict-free scheduling and fee collection.',
      tag: 'COMMUNITY LIVING'
    },
    {
      icon: <Users size={28} color="#A7F3D0" />,
      title: 'Domestic Helper Management',
      desc: 'Register maids, cooks, drivers, and tutors. Live attendance logs and resident approval workflows.',
      tag: 'DAILY HELP'
    },
    {
      icon: <FileText size={28} color="#F472B6" />,
      title: 'Staff RBAC & Audit Trails',
      desc: 'Granular role-based permissions for society committee members, treasurers, and security supervisors.',
      tag: 'GOVERNANCE'
    },
  ];

  return (
    <section id="features" style={{ padding: '100px 0', background: '#0F172A', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
            <Sparkles size={14} /> INTELLIGENT MODULES
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', margin: '0 0 16px 0' }}>
            Everything Your Housing Society Needs in One Platform
          </h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
            Eliminate fragmented registers, manual WhatsApp groups, and paper bills. Upgrade to enterprise digital governance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {features.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '20px',
                padding: '28px 24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(79, 70, 229, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: '#CBD5E1', letterSpacing: '0.5px' }}>
                    {item.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
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
