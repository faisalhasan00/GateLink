import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  UserCheck, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  ShieldAlert, 
  Car, 
  Waves, 
  FileText, 
  Bell, 
  Building2,
  Clock,
  Package,
  KeyRound,
  Wrench,
  CheckCircle2
} from 'lucide-react';

export default function SolutionsSection({ onOpenDemo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('residents');

  const tabs = [
    { id: 'residents', label: 'Residents' },
    { id: 'management', label: 'Management' },
    { id: 'security', label: 'Security & Staff' }
  ];

  const residentFeatures = [
    {
      img: '/assets/visitor_management.png',
      icon: <UserCheck size={24} color="#00B589" />,
      title: 'Visitor Management System',
      desc: 'Easy tracking of visitors, cabs, and even your deliveries! It\'s a one-stop solution to manage all your visitors whether you are inside the society or not.'
    },
    {
      img: '/assets/domestic_staff.png',
      icon: <Users size={24} color="#FF385C" />,
      title: 'Domestic Staff Management',
      desc: 'Get notified the moment your staff enter the society premises. Maintain their attendance digitally and also choose the best-rated domestic help for your home.'
    },
    {
      img: '/assets/resident_app_mockup.png',
      icon: <KeyRound size={24} color="#2563EB" />,
      title: 'Pre-Approved Guest & Cab Passes',
      desc: 'Create fast-track QR passcodes and OTPs for family guests, cabs, and courier agents so they enter without gate delays.'
    },
    {
      img: '/assets/admin_dashboard_mockup.png',
      icon: <CreditCard size={24} color="#D97706" />,
      title: 'Razorpay Maintenance Bill Payments',
      desc: 'Pay monthly maintenance dues online via UPI, Credit/Debit Cards, or Net Banking and receive instant GST compliant PDF receipts.'
    },
    {
      img: '/assets/hero_illustration.png',
      icon: <Waves size={24} color="#0284C7" />,
      title: 'Clubhouse & Amenity Booking',
      desc: 'Reserve party halls, tennis courts, gym slots, and swimming pool times with conflict-free calendar booking.'
    },
    {
      img: '/assets/guard_app_mockup.png',
      icon: <ShieldAlert size={24} color="#DC2626" />,
      title: '1-Tap Emergency SOS Panic Siren',
      desc: 'Trigger immediate emergency sirens on gatekeeper tablets and broadcast panic alerts to family and committee members.'
    }
  ];

  const managementFeatures = [
    {
      img: '/assets/admin_dashboard_mockup.png',
      icon: <CreditCard size={24} color="#2563EB" />,
      title: 'Society Accounting & GST Receipts',
      desc: 'Automate monthly maintenance billing, send automated WhatsApp payment reminders, collect online UPI payments, and generate GST compliant ledgers.'
    },
    {
      img: '/assets/hero_illustration.png',
      icon: <Bell size={24} color="#FF385C" />,
      title: 'Digital Notice Board & Broadcasts',
      desc: 'Broadcast urgent announcements, AGM agendas, and push notifications to all residents instantly on their smartphones.'
    },
    {
      img: '/assets/visitor_management.png',
      icon: <Wrench size={24} color="#D97706" />,
      title: 'Resident Grievances & SLA Tickets',
      desc: 'Track and assign flat complaint tickets (plumbing, electrical, elevator) to maintenance staff with transparent resolution SLAs.'
    },
    {
      img: '/assets/domestic_staff.png',
      icon: <FileText size={24} color="#059669" />,
      title: 'Vendor Contracts & Staff RBAC',
      desc: 'Granular role-based access control for committee members, treasurers, and property managers with encrypted digital audit logs.'
    },
    {
      img: '/assets/guard_app_mockup.png',
      icon: <Car size={24} color="#7C3AED" />,
      title: 'Smart Parking Allocation & Audit',
      desc: 'Manage resident parking slots, registered vehicle sticker lists, and prevent unauthorized parking in visitor zones.'
    },
    {
      img: '/assets/resident_app_mockup.png',
      icon: <Building2 size={24} color="#0284C7" />,
      title: 'Multi-Society & Township CRM',
      desc: 'Super admin dashboard for managing multiple towers, society licensing, subscription renewals, and global CRM leads.'
    }
  ];

  const securityFeatures = [
    {
      img: '/assets/guard_app_mockup.png',
      icon: <ShieldCheck size={24} color="#00B589" />,
      title: '5-Second Guard Gatekeeper Console',
      desc: 'High-speed entry verification with OTP passcode scanning, guest photo logging, and instant gatekeeper entry records.'
    },
    {
      img: '/assets/domestic_staff.png',
      icon: <Users size={24} color="#2563EB" />,
      title: 'Multilingual Guard App UI',
      desc: 'Supports English, Hindi, Kannada, Tamil, Telugu, and Marathi so gatekeepers can operate the console effortlessly.'
    },
    {
      img: '/assets/visitor_management.png',
      icon: <Clock size={24} color="#D97706" />,
      title: 'Domestic Staff Attendance Logging',
      desc: 'Track daily attendance logs for maids, cooks, drivers, and tutors. Notify residents the moment their staff enters main gate.'
    },
    {
      img: '/assets/hero_illustration.png',
      icon: <Package size={24} color="#FF385C" />,
      title: 'Delivery Package & Courier Station',
      desc: 'Scan courier barcodes at gate, log package drop-offs, and notify flat owners to collect their deliveries from security.'
    },
    {
      img: '/assets/resident_app_mockup.png',
      icon: <ShieldAlert size={24} color="#DC2626" />,
      title: 'Gate Emergency Siren Receiver',
      desc: 'Instant loud panic alarm sounds on security guard tablets whenever a resident triggers an Emergency SOS alert.'
    },
    {
      img: '/assets/admin_dashboard_mockup.png',
      icon: <Car size={24} color="#7C3AED" />,
      title: 'Overnight Stay & Vehicle Alerts',
      desc: 'Automated security alerts for vehicles or unregistered visitors staying inside society premises beyond 24 hours.'
    }
  ];

  const getCurrentFeatures = () => {
    if (activeTab === 'management') return managementFeatures;
    if (activeTab === 'security') return securityFeatures;
    return residentFeatures;
  };

  return (
    <section id="solutions" style={{ padding: '80px 0', background: isDark ? '#0F172A' : '#FFFFFF', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '36px', maxWidth: '900px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            SocietySphere for Every Need
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', lineHeight: 1.6, margin: 0 }}>
            Improve the security standards of your gated community with our technologically advanced and in-house engineered security and community management tool. We offer numerous innovative features that are sure to simplify your everyday chores.
          </p>
        </div>

        {/* Tab Navigation Row */}
        <div style={{ display: 'flex', gap: '40px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', marginBottom: '45px' }}>
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

        {/* Tab Feature Cards Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px 60px' }}
        >
          {getCurrentFeatures().map((item) => (
            <div 
              key={item.title} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: isDark ? '#1E293B' : '#FFFFFF',
                padding: '24px',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ width: '100%', maxWidth: '280px', height: '160px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: 0 }}>
                  {item.title}
                </h3>
              </div>

              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
