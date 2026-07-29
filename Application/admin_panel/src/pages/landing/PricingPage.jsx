import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Calculator, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Building, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  HardDrive,
  Headphones,
  Sliders,
  Cpu
} from 'lucide-react';

export default function PricingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('annual'); // annual or monthly

  // ROI Calculator Inputs
  const [flats, setFlats] = useState(150);
  const [maintenancePerFlat, setMaintenancePerFlat] = useState(4000);
  const [guards, setGuards] = useState(6);
  const [currentManualCost, setCurrentManualCost] = useState(15000);

  // FAQ Toggle
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Calculations
  const totalMonthlyCollection = flats * maintenancePerFlat;
  const defaulterSavedMonthly = Math.round(totalMonthlyCollection * 0.05); // 5% saved from automated reminders
  const adminSavedMonthly = Math.round(currentManualCost * 0.75); // 75% savings on manual paperwork & accounting
  const totalMonthlySavings = defaulterSavedMonthly + adminSavedMonthly;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const softwareAnnualCost = 4999 * 12; // ₹59,988
  const netAnnualSavings = Math.max(0, totalAnnualSavings - softwareAnnualCost);
  const calculatedRoi = Math.round(((totalAnnualSavings - softwareAnnualCost) / softwareAnnualCost) * 100);
  const timeSavedHours = Math.round((flats * 0.5) + (guards * 5)); // hours saved per month

  const plans = [
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

  const faqs = [
    {
      q: 'Are there any hidden onboarding or setup fees?',
      a: 'No. SocietySphere has zero hidden onboarding fees. We provide complete digital data migration, guard training, and committee setup free of charge.'
    },
    {
      q: 'How does the Razorpay payment gateway integration work?',
      a: 'Maintenance bill payments made by residents via UPI, Credit/Debit cards, or NetBanking settle directly into your society bank account. Receipts are automatically generated and emailed to residents.'
    },
    {
      q: 'Can we upgrade or switch plans later?',
      a: 'Yes, you can upgrade your plan anytime as your housing society grows. Upgrade takes effect immediately with pro-rated billing.'
    },
    {
      q: 'Is resident and visitor data encrypted and secure?',
      a: 'Yes. All data is encrypted using 256-Bit SSL TLS v1.3 encryption and hosted on secure AWS infrastructure in India, adhering strictly to privacy compliance laws.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Sticky Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
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

      {/* Pricing Cards Grid */}
      <section style={{ padding: '40px 0 80px 0', background: '#020617' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', alignItems: 'stretch' }}>
            {plans.map((p, idx) => (
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
                  onClick={() => setIsDemoModalOpen(true)}
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
                  <span>Book Demo & Get Started</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive ROI Calculator Section */}
      <section style={{ padding: '80px 0', background: '#090D16', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
              <Calculator size={14} /> INTERACTIVE FINANCIAL ROI CALCULATOR
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', margin: '0 0 12px 0' }}>
              Calculate your society's estimated annual savings
            </h2>
            <p style={{ fontSize: '16px', color: '#94A3B8', margin: 0 }}>
              Adjust the sliders below to see your automated savings, time saved, and net ROI.
            </p>
          </div>

          {/* Calculator Container */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '40px',
            alignItems: 'center'
          }}>
            
            {/* Controls Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Slider 1: Flats */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 700 }}>Total Number of Flats</label>
                  <span style={{ fontSize: '16px', color: '#818CF8', fontWeight: 900 }}>{flats} Flats</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={flats}
                  onChange={e => setFlats(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#4F46E5', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 2: Monthly Maintenance */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 700 }}>Monthly Maintenance per Flat</label>
                  <span style={{ fontSize: '16px', color: '#34D399', fontWeight: 900 }}>₹{maintenancePerFlat.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={maintenancePerFlat}
                  onChange={e => setMaintenancePerFlat(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 3: Security Guards */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 700 }}>Security Guards on Duty</label>
                  <span style={{ fontSize: '16px', color: '#C084FC', fontWeight: 900 }}>{guards} Guards</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={guards}
                  onChange={e => setGuards(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#C084FC', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 4: Current Manual Costs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 700 }}>Current Manual Admin Costs / Month</label>
                  <span style={{ fontSize: '16px', color: '#FBBF24', fontWeight: 900 }}>₹{currentManualCost.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="1000"
                  value={currentManualCost}
                  onChange={e => setCurrentManualCost(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
                />
              </div>

            </div>

            {/* Live Calculation Results Right Column */}
            <motion.div
              layout
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#34D399', letterSpacing: '1px', textTransform: 'uppercase' }}>ESTIMATED ANNUAL SAVINGS</div>
                <div style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', marginTop: '4px' }}>
                  ₹{totalAnnualSavings.toLocaleString()} <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>/ year</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>TIME SAVED / MONTH</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#818CF8', marginTop: '4px' }}>{timeSavedHours} Hours</div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>ESTIMATED ROI</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#34D399', marginTop: '4px' }}>{calculatedRoi}% ROI</div>
                </div>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#CBD5E1', lineHeight: 1.5 }}>
                💡 <strong>Breakdown:</strong> Saves ₹{defaulterSavedMonthly.toLocaleString()}/mo in avoided defaulter losses and ₹{adminSavedMonthly.toLocaleString()}/mo in reduced paperwork & manual accounting.
              </div>

              <button
                onClick={() => setIsDemoModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Claim Your Society Savings</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 0 100px 0', background: '#0F172A' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF' }}>Frequently Asked Questions</h2>
            <p style={{ color: '#94A3B8', marginTop: '8px' }}>Have questions about plans, billing, or security? We've got answers.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((f, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={f.q}
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: '#FFFFFF', fontSize: '16px' }}>
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp size={20} color="#818CF8" /> : <ChevronDown size={20} color="#94A3B8" />}
                  </div>
                  {isOpen && (
                    <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '12px', lineHeight: 1.6, margin: '12px 0 0 0' }}>
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
