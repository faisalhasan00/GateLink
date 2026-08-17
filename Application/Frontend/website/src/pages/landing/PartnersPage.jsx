import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import DemoModal from './DemoModal';
import { useTheme } from '../../context/ThemeContext';
import { 
  Gift, 
  TrendingUp, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Send, 
  HelpCircle,
  Award,
  Zap,
  Clock
} from 'lucide-react';

export default function PartnersPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Active Partner Tier Tab
  const [activeTierTab, setActiveTierTab] = useState('growth'); // 'referral' | 'onboarding' | 'growth'

  // Calculator State
  const [flatCount, setFlatCount] = useState(200);

  // Lead Form State
  const [formData, setFormData] = useState({
    partnerName: '',
    partnerPhone: '',
    partnerEmail: '',
    partnerCity: '',
    partnerUpi: '',
    partnerType: 'broker',
    targetSocietyName: '',
    targetCity: '',
    contactPerson: '',
    contactRole: 'RWA Secretary',
    contactPhone: '',
    approxFlats: '100-250',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Math Calculations (@ ₹25/flat/month net SaaS fee)
  const monthlySaaSRevenue = flatCount * 25;
  const m1Rate = activeTierTab === 'referral' ? 0.05 : 0.10;
  const m1Bonus = Math.round(monthlySaaSRevenue * m1Rate);
  const recurringMonthly = Math.round(monthlySaaSRevenue * 0.02);
  const annualTotal = m1Bonus + (recurringMonthly * 11);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partnerName.trim()) {
      setValidationError('Please enter your Full Name.');
      return;
    }
    if (!formData.partnerPhone.trim() || formData.partnerPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.targetSocietyName.trim()) {
      setValidationError('Target Society / Building Name is required.');
      return;
    }

    setSubmitting(true);
    setValidationError('');

    try {
      const generatedRef = `LEAD-${Date.now().toString().slice(-6)}`;
      await addDoc(collection(db, 'partner_leads'), {
        referenceId: generatedRef,
        partnerName: formData.partnerName.trim(),
        partnerPhone: formData.partnerPhone.trim(),
        partnerEmail: formData.partnerEmail.trim(),
        partnerCity: formData.partnerCity.trim(),
        partnerUpi: formData.partnerUpi.trim(),
        partnerType: formData.partnerType,
        targetSocietyName: formData.targetSocietyName.trim(),
        targetCity: formData.targetCity.trim(),
        contactPerson: formData.contactPerson.trim(),
        contactRole: formData.contactRole,
        contactPhone: formData.contactPhone.trim(),
        approxFlats: formData.approxFlats,
        notes: formData.notes.trim(),
        status: 'new',
        assignedTier: activeTierTab,
        source: 'website_partners_portal',
        createdAt: serverTimestamp(),
      });

      setSubmittedRef(generatedRef);
      setFormData({
        partnerName: '',
        partnerPhone: '',
        partnerEmail: '',
        partnerCity: '',
        partnerUpi: '',
        partnerType: 'broker',
        targetSocietyName: '',
        targetCity: '',
        contactPerson: '',
        contactRole: 'RWA Secretary',
        contactPhone: '',
        approxFlats: '100-250',
        notes: ''
      });
    } catch (err) {
      console.error('Error saving partner lead:', err);
      setValidationError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tiers = [
    {
      id: 'referral',
      tag: 'Tier 1',
      title: 'Referral Partner',
      subtitle: 'For residents & individuals who introduce a society committee',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      m1Rate: '5%',
      m1Desc: 'One-time bonus on Month 1',
      recurring: '2%',
      duration: '12 Months (1 Year)',
      features: [
        'Just submit Society Name & Secretary phone',
        'GateLink enterprise team conducts demo & contract',
        'Direct UPI cash transfer on first bill clearance'
      ]
    },
    {
      id: 'onboarding',
      tag: 'Tier 2',
      title: 'Onboarding Partner',
      subtitle: 'For champions who introduce and help collect flat/resident rosters',
      badgeColor: '#0284C7',
      badgeBg: '#E0F2FE',
      m1Rate: '10%',
      m1Desc: 'Doubled bonus on Month 1',
      recurring: '2%',
      duration: '24 Months (2 Full Years)',
      features: [
        'Introduce committee & assist with tower/flat lists',
        'Doubled 10% cash bonus on first invoice',
        '2 Full Years of recurring passive monthly payouts'
      ]
    },
    {
      id: 'growth',
      tag: 'Tier 3',
      title: 'Growth Partner',
      subtitle: 'For property brokers, facility vendors & promoters managing 3+ societies',
      badgeColor: '#1E3A8A',
      badgeBg: '#EFF6FF',
      isPro: true,
      m1Rate: '10%',
      m1Desc: 'Full 10% bonus on Month 1',
      recurring: '2%',
      duration: 'LIFETIME (Active Soc.)',
      features: [
        'Permanent 2% recurring monthly revenue share',
        'Dedicated Partner Relationship Manager',
        'Automated monthly UPI payouts with invoice statements'
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead
        title="Partner & Referral Program - GateLink Society OS"
        description="Join GateLink's Partner Program and earn up to 10% Month 1 Bonus + 2% Lifetime Recurring Commissions by introducing housing societies."
        canonicalUrl="https://gatelink.in/partners"
      />

      {/* Sticky Header */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '50px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
            GATELINK PARTNER & REVENUE SHARE ENGINE
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '12px 0 16px 0', lineHeight: 1.15 }}>
            Earn Recurring Monthly Passive Income <br />
            <span style={{ color: '#0EA5E9' }}>By Onboarding Residential Societies</span>
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '780px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
            Whether you are a real estate broker, flat resident, facility manager, or independent promoter — partner with GateLink and earn up to <strong>10% Month 1 Bonus + 2% Lifetime Recurring Commission</strong> on every paying society.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="#lead-form"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 28px',
                borderRadius: '12px',
                backgroundColor: '#1E3A8A',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease'
              }}
            >
              <span>Submit a Society Lead</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="#calculator"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 24px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#2C2C2C',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CCCCCC',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Calculate Your Earnings
            </a>
          </div>

          {/* 4 Feature Value Props */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '50px',
            textAlign: 'left'
          }}>
            <div style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <TrendingUp size={20} color="#1E3A8A" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>10% + 2%</div>
              <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', marginTop: '4px' }}>Month 1 + Lifetime Share</div>
            </div>

            <div style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <ShieldCheck size={20} color="#059669" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#059669' }}>Zero Investment</div>
              <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', marginTop: '4px' }}>100% Free to Partner</div>
            </div>

            <div style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <DollarSign size={20} color="#D97706" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#D97706' }}>Direct UPI</div>
              <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', marginTop: '4px' }}>Monthly Automated Payouts</div>
            </div>

            <div style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Zap size={20} color="#0EA5E9" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#0EA5E9' }}>Instant CRM</div>
              <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', marginTop: '4px' }}>Live Status Updates via WhatsApp</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-TIER PARTNER TIERS ────────────────────────────────────────── */}
      <section style={{ padding: '70px 0', maxWidth: '1320px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
            PARTNERSHIP TIERS
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '10px 0 14px 0' }}>
            Choose Your Level of Engagement
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', margin: 0, lineHeight: 1.6 }}>
            From casual resident referrals to professional real estate brokerage — earn recurring revenue with zero capital risk.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
          {tiers.map((t) => (
            <div
              key={t.id}
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                borderRadius: '16px',
                padding: '36px',
                border: t.isPro ? '2px solid #1E3A8A' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB'),
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {t.isPro && (
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  backgroundColor: '#1E3A8A',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  PRO BROKER
                </span>
              )}

              <div>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: t.badgeBg,
                  color: t.badgeColor,
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: '14px'
                }}>
                  {t.tag}
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 6px 0' }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                  {t.subtitle}
                </p>

                {/* Earnings Block */}
                <div style={{
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  borderRadius: '12px',
                  padding: '18px',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB',
                  marginBottom: '24px'
                }}>
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>MONTH 1 COMMISSION</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '2px 0' }}>
                      {t.m1Rate} <span style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#94A3B8' : '#666666' }}>({t.m1Desc})</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>RECURRING SHARE</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: t.badgeColor, margin: '2px 0' }}>
                      {t.recurring} <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444' }}>for {t.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Bullets */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {t.features.map((f, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: isDark ? '#CBD5E1' : '#555555', lineHeight: 1.5 }}>
                      <CheckCircle2 size={16} color={t.badgeColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#lead-form"
                onClick={() => setActiveTierTab(t.id)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  backgroundColor: t.isPro ? '#1E3A8A' : (isDark ? '#334155' : '#F1F5F9'),
                  color: t.isPro ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#2C2C2C'),
                  border: t.isPro ? 'none' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CCCCCC'),
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                Apply as {t.title}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── EARNINGS CALCULATOR ───────────────────────────────────────── */}
      <section id="calculator" style={{
        padding: '70px 0',
        backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ROI SIMULATOR
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '8px 0 10px 0' }}>
              Interactive Earnings Calculator
            </h2>
            <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', margin: 0 }}>
              Slide to simulate your monthly & annual passive income based on society flat count.
            </p>
          </div>

          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '16px',
            padding: '36px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            {/* Slider */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444' }}>Flats in Referred Society:</span>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#1E3A8A' }}>{flatCount} Flats</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={flatCount}
                onChange={(e) => setFlatCount(Number(e.target.value))}
                style={{ width: '100%', height: '8px', borderRadius: '4px', cursor: 'pointer', accentColor: '#1E3A8A' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: isDark ? '#64748B' : '#999999', marginTop: '6px' }}>
                <span>50 Flats</span>
                <span>500 Flats</span>
                <span>1,000 Flats</span>
                <span>1,500+ Flats</span>
              </div>
            </div>

            {/* Calculated Values */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '18px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>ESTIMATED MONTHLY BILL</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '4px 0' }}>₹{monthlySaaSRevenue.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#999999' }}>@ ₹25/flat/mo net SaaS</div>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '18px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>MONTH 1 CASH BONUS</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#059669', margin: '4px 0' }}>₹{m1Bonus.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#999999' }}>{activeTierTab === 'referral' ? '5%' : '10%'} on first invoice</div>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '18px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>MONTHLY RECURRING SHARE</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#1E3A8A', margin: '4px 0' }}>₹{recurringMonthly.toLocaleString('en-IN')} <span style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#94A3B8' : '#666666' }}>/mo</span></div>
                <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#999999' }}>2% every month to UPI</div>
              </div>
            </div>

            {/* Total Highlight */}
            <div style={{
              background: '#EFF6FF',
              borderRadius: '12px',
              padding: '18px 24px',
              border: '1px solid #BFDBFE',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ESTIMATED YEAR 1 EARNINGS (PER SOCIETY)
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#1E3A8A', margin: '2px 0 0 0' }}>
                  ₹{annualTotal.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#1E3A8A', fontWeight: 600 }}>
                💡 10 societies = ₹{(annualTotal * 10).toLocaleString('en-IN')} / year passive income
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REGISTRATION & LEAD FORM ────────────────────────────────────── */}
      <section id="lead-form" style={{ padding: '80px 0 100px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
              DIRECT REGISTRATION
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '8px 0 10px 0' }}>
              Submit a Society Lead & Partner
            </h2>
            <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', margin: 0 }}>
              Submit the society contact. Our enterprise team handles the presentation and close, and your commission is transferred automatically.
            </p>
          </div>

          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '16px',
            padding: '36px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            {submittedRef ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', border: '2px solid #1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <CheckCircle2 size={36} color="#1E3A8A" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0' }}>
                  Society Lead Registered Successfully!
                </h3>
                <p style={{ color: isDark ? '#94A3B8' : '#666666', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  Your Lead Reference ID is <strong style={{ color: isDark ? '#FFFFFF' : '#2C2C2C' }}>{submittedRef}</strong>. Our enterprise team will schedule a demo with the society committee and keep you updated via WhatsApp.
                </p>
                <button
                  onClick={() => setSubmittedRef(null)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    backgroundColor: '#1E3A8A',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Submit Another Society Lead
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {validationError && (
                  <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                    {validationError}
                  </div>
                )}

                {/* Section 1: Partner Info */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
                    1. Partner & Payout Details (Your Information)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Full Name *</label>
                      <input
                        type="text"
                        name="partnerName"
                        value={formData.partnerName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        required
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        name="partnerPhone"
                        value={formData.partnerPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        required
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your Email Address</label>
                      <input
                        type="email"
                        name="partnerEmail"
                        value={formData.partnerEmail}
                        onChange={handleInputChange}
                        placeholder="rahul@example.com"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your UPI ID (For Direct Payouts) *</label>
                      <input
                        type="text"
                        name="partnerUpi"
                        value={formData.partnerUpi}
                        onChange={handleInputChange}
                        placeholder="e.g. rahul@okaxis or 9876543210@paytm"
                        required
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Who Are You?</label>
                      <select
                        name="partnerType"
                        value={formData.partnerType}
                        onChange={handleInputChange}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      >
                        <option value="broker">Property Broker / Real Estate Dealer</option>
                        <option value="resident">Apartment Resident / Flat Owner</option>
                        <option value="freelancer">Freelancer / Independent Promoter</option>
                        <option value="agency">Security / Facility Agency</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Your City</label>
                      <input
                        type="text"
                        name="partnerCity"
                        value={formData.partnerCity}
                        onChange={handleInputChange}
                        placeholder="e.g. Hyderabad / Farooqnagar"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Target Society */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '16px' }}>
                    2. Target Society / Apartment Information
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Society / Apartment Name *</label>
                      <input
                        type="text"
                        name="targetSocietyName"
                        value={formData.targetSocietyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Green Valley Residency"
                        required
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Society City / Location</label>
                      <input
                        type="text"
                        name="targetCity"
                        value={formData.targetCity}
                        onChange={handleInputChange}
                        placeholder="e.g. Farooqnagar / Gachibowli"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Contact Person Name</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="e.g. Mr. K. Rao"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Contact Person Role</label>
                      <select
                        name="contactRole"
                        value={formData.contactRole}
                        onChange={handleInputChange}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      >
                        <option value="RWA Secretary">RWA Secretary</option>
                        <option value="RWA President">RWA President</option>
                        <option value="Treasurer">RWA Treasurer / Committee</option>
                        <option value="Builder / Developer">Builder / Developer</option>
                        <option value="Resident Friend">Resident Friend living there</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Contact Phone Number</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9845011223"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444', marginBottom: '8px' }}>Approximate Flats</label>
                      <select
                        name="approxFlats"
                        value={formData.approxFlats}
                        onChange={handleInputChange}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', fontSize: '14px' }}
                      >
                        <option value="50-100">50 - 100 Flats</option>
                        <option value="100-250">100 - 250 Flats</option>
                        <option value="250-500">250 - 500 Flats</option>
                        <option value="500+">500+ Large Township</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666' }}>
                    🔒 Direct payout guarantee. We never share partner contact info.
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '12px 32px',
                      borderRadius: '12px',
                      backgroundColor: '#1E3A8A',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.6 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Send size={15} />
                    <span>{submitting ? 'Submitting Lead...' : 'Submit Society Lead'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ──────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 100px 0', maxWidth: '850px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
            PARTNER QUESTIONS
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '8px 0 10px 0' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 8px 0' }}>
              Who is eligible to become a GateLink Partner?
            </h4>
            <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: 0 }}>
              Anyone! Real estate brokers, apartment owners, tenants, independent house owners, security agencies, and freelancers can join and earn recurring commission.
            </p>
          </div>

          <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 8px 0' }}>
              When and how is the commission paid?
            </h4>
            <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: 0 }}>
              Commissions are calculated monthly and sent directly to your registered UPI ID (Google Pay, PhonePe, Paytm, BHIM) once the society clears their monthly SaaS maintenance invoice.
            </p>
          </div>

          <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 8px 0' }}>
              What does "Lifetime Commission" mean for Growth Partners?
            </h4>
            <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: 0 }}>
              As long as the society you onboarded remains active and pays their GateLink subscription, you receive 2% recurring revenue share every single month with no expiry date.
            </p>
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
