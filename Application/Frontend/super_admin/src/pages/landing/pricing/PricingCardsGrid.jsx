import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Building, 
  HardDrive, 
  Headphones, 
  Cpu, 
  ArrowRight 
} from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    desc: 'Ideal for standalone housing societies and small apartment complexes.',
    priceMonthly: '₹2,499',
    priceAnnual: '₹1,999',
    flatLimit: 'Up to 50 Flats',
    storageLimit: '10 GB Cloud Vault',
    support: 'Standard Email & Chat Support',
    integrations: 'Razorpay Payment Gateway, WhatsApp Gate Alerts',
    popular: false,
    features: [
      'Resident Companion Mobile App',
      'Guard Gatekeeper Mobile App',
      'Visitor Gate Pass & OTP Verification',
      'Basic Maintenance Bill Generation',
      'Emergency SOS Alert Broadcast',
      'Standard Audit Logs'
    ]
  },
  {
    name: 'Professional',
    desc: 'Designed for medium to large gated communities requiring complete automation.',
    priceMonthly: '₹5,999',
    priceAnnual: '₹4,999',
    flatLimit: 'Up to 250 Flats',
    storageLimit: '100 GB Cloud Vault',
    support: '24/7 Priority Phone & Whatsapp Support',
    integrations: 'Razorpay UPI/Cards, Tally ERP Export, WhatsApp SMS',
    popular: true,
    features: [
      'Everything in Starter Plan',
      'Razorpay Auto-Settlement & Invoicing',
      'Clubhouse & Amenity Slot Booking',
      'Helper & Maid Attendance Tracking',
      'Smart Parking Slot Allocation',
      'Staff RBAC Committee Permission Matrix',
      'Defaulter WhatsApp Auto-Reminders'
    ]
  },
  {
    name: 'Enterprise',
    desc: 'For multi-tower townships, builder handovers & commercial complexes.',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    flatLimit: '250+ Flats / Multi-Tower',
    storageLimit: 'Unlimited Cloud Storage',
    support: 'Dedicated Account Manager & On-Site Training',
    integrations: 'Custom ERP, Tally XML, Whitelabeled Domain APIs',
    popular: false,
    features: [
      'Everything in Professional Plan',
      'Custom Domain & Brand Whitelabeling',
      'Super Admin Multi-Tenant Control',
      'Custom Tally & SAP Integration',
      'Dedicated Onboarding Account Manager',
      'Custom SLA Guarantee & On-Site Guard Training'
    ]
  }
];

export default function PricingCardsGrid({ billingCycle, onOpenDemo }) {
  return (
    <section style={{ padding: '40px 0 80px 0', background: '#020617' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
          {PLANS.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
              style={{
                background: p.popular ? 'linear-gradient(180deg, rgba(49, 46, 129, 0.6) 0%, rgba(15, 23, 42, 0.95) 100%)' : 'rgba(30, 41, 59, 0.5)',
                borderRadius: '24px',
                padding: '36px 28px',
                border: p.popular ? '2px solid #6366F1' : '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(16px)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: p.popular ? '0 20px 50px -15px rgba(79, 70, 229, 0.4)' : 'none'
              }}
            >
              {p.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '4px 16px',
                  borderRadius: '20px',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.5)'
                }}>
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>{p.name}</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px', marginBottom: '20px', height: '40px', lineHeight: 1.5 }}>{p.desc}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px' }}>
                    {billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly}
                  </span>
                  {p.priceAnnual !== 'Custom' && <span style={{ color: '#94A3B8', fontSize: '14px' }}>/month</span>}
                </div>

                {/* Explicit Specs Table */}
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                    <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}><Building size={14} /> Flat Limit:</span>
                    <strong style={{ color: '#818CF8' }}>{p.flatLimit}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                    <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}><HardDrive size={14} /> Cloud Storage:</span>
                    <strong style={{ color: '#34D399' }}>{p.storageLimit}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                    <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}><Headphones size={14} /> Support:</span>
                    <strong>{p.support}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                    <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={14} /> Integrations:</span>
                    <strong style={{ textAlign: 'right', maxWidth: '140px' }}>{p.integrations}</strong>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  {p.features.map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>
                      <Check size={16} color="#34D399" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenDemo}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: p.popular ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: p.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Book Demo &amp; Get Started</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
