import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, ArrowRight } from 'lucide-react';

export default function PricingSection({ onOpenDemo }) {
  const [billingCycle, setBillingCycle] = useState('annual'); // annual or monthly

  const plans = [
    {
      name: 'Starter Plan',
      desc: 'Ideal for standalone housing societies and small apartment complexes.',
      flats: 'Up to 50 Flats',
      priceMonthly: '₹2,499',
      priceAnnual: '₹1,999',
      popular: false,
      features: [
        'Resident App & Guard App',
        'Visitor Gate Pass & OTP Verification',
        'Basic Maintenance Billing',
        'Emergency SOS Broadcast',
        'Email & Chat Support',
        'Standard Audit Logs'
      ]
    },
    {
      name: 'Professional Plan',
      desc: 'Designed for medium to large gated communities requiring complete automation.',
      flats: 'Up to 250 Flats',
      priceMonthly: '₹5,999',
      priceAnnual: '₹4,999',
      popular: true,
      features: [
        'Everything in Starter Plan',
        'Razorpay Payment Gateway & Auto Invoicing',
        'Amenity & Clubhouse Slot Booking',
        'Helper & Maid Attendance Tracking',
        'Smart Parking Slot Allocation',
        'Role-Based Committee Permissions (RBAC)',
        '24/7 Dedicated Support Hotline'
      ]
    },
    {
      name: 'Enterprise Plan',
      desc: 'For multi-tower townships, builder handovers & commercial complexes.',
      flats: '250+ Flats / Multi-Tower',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      popular: false,
      features: [
        'Everything in Professional Plan',
        'Custom Domain & Brand Whitelabeling',
        'Super Admin Multi-Tenant Control',
        'Custom ERP & Tally Integration',
        'Dedicated Onboarding Account Manager',
        'Custom SLA Guarantee & On-Site Training'
      ]
    }
  ];

  return (
    <section id="pricing" style={{ padding: '100px 0', background: '#0F172A', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#34D399', letterSpacing: '1px', textTransform: 'uppercase' }}>SIMPLE & TRANSPARENT PRICING</span>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', marginTop: '8px' }}>
            Choose the perfect plan for your society
          </h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', marginTop: '8px' }}>
            No hidden setup fees. Cancel anytime. 14-day risk-free trial on all plans.
          </p>

          {/* Billing Cycle Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '24px' }}>
            <button
              onClick={() => setBillingCycle('annual')}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: 'none',
                background: billingCycle === 'annual' ? '#4F46E5' : 'transparent',
                color: billingCycle === 'annual' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Annual Billing <span style={{ background: '#10B981', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', marginLeft: '6px' }}>SAVE 20%</span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: 'none',
                background: billingCycle === 'monthly' ? '#4F46E5' : 'transparent',
                color: billingCycle === 'monthly' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Monthly Billing
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', alignItems: 'stretch' }}>
          {plans.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
              style={{
                background: p.popular ? 'linear-gradient(180deg, rgba(49, 46, 129, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'rgba(30, 41, 59, 0.5)',
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
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>{p.name}</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px', marginBottom: '20px', height: '40px' }}>{p.desc}</p>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#818CF8', marginBottom: '16px' }}>{p.flats}</div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px' }}>
                    {billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly}
                  </span>
                  {p.priceAnnual !== 'Custom' && <span style={{ color: '#94A3B8', fontSize: '14px' }}>/month</span>}
                </div>

                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', marginBottom: '24px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
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
                  background: p.popular ? '#1E3A8A' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: p.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (p.popular) e.currentTarget.style.backgroundColor = '#172554';
                  else e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  if (p.popular) e.currentTarget.style.backgroundColor = '#1E3A8A';
                  else e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
