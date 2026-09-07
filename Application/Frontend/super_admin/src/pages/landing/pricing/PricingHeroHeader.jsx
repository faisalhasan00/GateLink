import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function PricingHeroHeader({ billingCycle, setBillingCycle }) {
  return (
    <section style={{
      paddingTop: '160px',
      paddingBottom: '50px',
      background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
            <Sparkles size={14} /> TRANSPARENT SAAS PRICING
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            Simple, Predictable Plans for Every Society
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '720px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
            No hidden setup fees. 14-day free trial. Choose annual billing to save 20%.
          </p>

          {/* Billing Cycle Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => setBillingCycle('annual')}
              style={{
                padding: '10px 24px',
                borderRadius: '20px',
                border: 'none',
                background: billingCycle === 'annual' ? '#4F46E5' : 'transparent',
                color: billingCycle === 'annual' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Annual Billing <span style={{ background: '#10B981', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', marginLeft: '6px' }}>SAVE 20%</span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '10px 24px',
                borderRadius: '20px',
                border: 'none',
                background: billingCycle === 'monthly' ? '#4F46E5' : 'transparent',
                color: billingCycle === 'monthly' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Monthly Billing
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
