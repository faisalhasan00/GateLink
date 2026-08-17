import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, CheckCircle2, DollarSign, Sparkles, Building, Users, Shield, TrendingUp } from 'lucide-react';

export default function PartnersPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calculator State
  const [flatCount, setFlatCount] = useState(250);
  const [selectedTier, setSelectedTier] = useState('growth'); // 'referral' | 'onboarding' | 'growth'

  // Form State
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
    approxFlats: '150-300',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState(null);
  const [formError, setFormError] = useState('');

  // Financial Calculations
  const ratePerFlat = 25; // ₹25/flat/month
  const monthlySaaSRevenue = flatCount * ratePerFlat;
  const m1Percentage = selectedTier === 'referral' ? 0.05 : 0.10;
  const m1Bonus = Math.round(monthlySaaSRevenue * m1Percentage);
  const recurringMonthly = Math.round(monthlySaaSRevenue * 0.02);
  const annualEarnings = m1Bonus + (recurringMonthly * 11);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partnerName.trim() || !formData.partnerPhone.trim() || !formData.targetSocietyName.trim()) {
      setFormError('Please fill all required fields: Your Name, Phone, and the Target Society Name.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

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
        assignedTier: selectedTier,
        source: 'website_partners_portal',
        createdAt: serverTimestamp(),
      });

      setSubmittedRefId(generatedRef);
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
        approxFlats: '150-300',
        notes: '',
      });
    } catch (err) {
      console.error('Error submitting partner lead:', err);
      setFormError('Failed to submit lead. Please check your network connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: isDark ? '#F8FAFC' : '#0F172A' }}>
      <SeoHead
        title="Partner Program - GateLink Society OS"
        description="Earn up to 10% Month 1 Bonus + 2% Lifetime Recurring Commissions by onboarding residential societies to GateLink."
        canonicalUrl="https://gatelink.in/partners"
      />

      <Navbar />

      <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* ── HERO BANNER ────────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 60px auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: isDark ? 'rgba(14, 165, 233, 0.15)' : '#EFF6FF',
              border: isDark ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid #BFDBFE',
              color: isDark ? '#38BDF8' : '#1E3A8A',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <Sparkles size={14} color="#0EA5E9" />
              GateLink Partner & Revenue Share Program
            </div>

            <h1 style={{
              fontSize: '44px',
              fontWeight: 900,
              color: isDark ? '#FFFFFF' : '#0F172A',
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
              margin: '0 0 20px 0'
            }}>
              Earn Recurring Monthly Passive Income <br />
              <span style={{ color: '#0EA5E9' }}>
                By Onboarding Residential Societies
              </span>
            </h1>

            <p style={{
              fontSize: '17px',
              color: isDark ? '#94A3B8' : '#475569',
              lineHeight: 1.6,
              margin: '0 auto 36px auto',
              maxWidth: '750px'
            }}>
              Whether you are a real estate broker, active resident, facility manager, or independent promoter — partner with GateLink and earn up to <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>10% Month 1 Bonus + 2% Lifetime Recurring Commission</strong> on every paying society.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="#lead-form"
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  backgroundColor: '#1E3A8A',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Submit a Society Lead</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#calculator"
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1E293B',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                Calculate Your Earnings
              </a>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginTop: '50px',
              textAlign: 'left'
            }}>
              <div style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                padding: '20px',
                borderRadius: '16px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#1E3A8A' }}>10% + 2%</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>Month 1 + Lifetime Share</div>
              </div>

              <div style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                padding: '20px',
                borderRadius: '16px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#0D9488' }}>Zero Cost</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>Free to Join & Partner</div>
              </div>

              <div style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                padding: '20px',
                borderRadius: '16px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#D97706' }}>Direct UPI</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>Monthly Auto Payouts</div>
              </div>

              <div style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                padding: '20px',
                borderRadius: '16px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#0EA5E9' }}>100% Digital</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>Live Status CRM Tracking</div>
              </div>
            </div>
          </div>

          {/* ── 3-TIER COMPARISON SECTION ────────────────────────────────── */}
          <div style={{ margin: '80px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                Transparent, High-Reward Partner Tiers
              </h2>
              <p style={{ fontSize: '16px', color: '#64748B', margin: 0 }}>
                Choose how deeply you want to engage — from casual referrals to lifetime brokerage.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
              
              {/* Tier 1 */}
              <div style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                borderRadius: '24px',
                padding: '36px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', backgroundColor: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
                    🟢 Tier 1
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 8px 0' }}>Referral Partner</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                    For casual residents or friends who simply introduce an apartment committee.
                  </p>

                  <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingTop: '20px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>MONTH 1 COMMISSION</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: '4px 0 16px 0' }}>5% <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>of subscription</span></div>
                    
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>RECURRING SHARE</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#059669', margin: '4px 0 0 0' }}>2% <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>for 12 Months</span></div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 500 }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Just submit Society Name & Phone</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ GateLink team handles full demo & close</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Direct UPI payout on first invoice clearance</li>
                  </ul>
                </div>

                <a
                  href="#lead-form"
                  onClick={() => setSelectedTier('referral')}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    backgroundColor: isDark ? '#334155' : '#F1F5F9',
                    color: isDark ? '#FFFFFF' : '#1E293B',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1'
                  }}
                >
                  Start as Referral Partner
                </a>
              </div>

              {/* Tier 2 */}
              <div style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                borderRadius: '24px',
                padding: '36px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', backgroundColor: '#E0F2FE', color: '#0284C7', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
                    🔵 Tier 2
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 8px 0' }}>Onboarding Partner</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                    For proactive champions who introduce and help collect resident/flat rosters.
                  </p>

                  <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingTop: '20px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>MONTH 1 COMMISSION</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: '4px 0 16px 0' }}>10% <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>of subscription</span></div>
                    
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>RECURRING SHARE</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#0284C7', margin: '4px 0 0 0' }}>2% <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>for 24 Months (2 Yrs)</span></div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 500 }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Introduce committee & assist flat roster setup</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Doubled Month 1 bonus payout (10%)</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ 2 Full Years of recurring passive revenue</li>
                  </ul>
                </div>

                <a
                  href="#lead-form"
                  onClick={() => setSelectedTier('onboarding')}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    backgroundColor: isDark ? '#334155' : '#F1F5F9',
                    color: isDark ? '#FFFFFF' : '#1E293B',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1'
                  }}
                >
                  Start as Onboarding Partner
                </a>
              </div>

              {/* Tier 3: Growth Partner (Featured) */}
              <div style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #172554 100%)',
                color: '#FFFFFF',
                borderRadius: '24px',
                padding: '36px',
                border: '1px solid #1E3A8A',
                boxShadow: '0 10px 30px rgba(30, 58, 138, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                      🟣 Tier 3
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: '#F59E0B', color: '#78350F', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
                      PRO BROKER
                    </span>
                  </div>

                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 8px 0' }}>Growth Partner</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                    For property brokers, facility vendors & promoters managing multiple societies.
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase' }}>MONTH 1 COMMISSION</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: '4px 0 16px 0' }}>10% <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>of subscription</span></div>
                    
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase' }}>RECURRING SHARE</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#38BDF8', margin: '4px 0 0 0' }}>2% LIFETIME <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>(Active Soc.)</span></div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Lifetime recurring payout (as long as society stays)</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Dedicated Partner Relationship Manager</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Monthly automated direct UPI transfers</li>
                  </ul>
                </div>

                <a
                  href="#lead-form"
                  onClick={() => setSelectedTier('growth')}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    color: '#1E3A8A',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  Apply as Growth Partner
                </a>
              </div>

            </div>
          </div>

          {/* ── EARNINGS CALCULATOR ───────────────────────────────────────── */}
          <div id="calculator" style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            marginBottom: '80px'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px auto' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>
                Interactive Earnings Calculator
              </h2>
              <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
                Slide to see how much recurring passive income you earn based on society flat count.
              </p>
            </div>

            {/* Slider */}
            <div style={{ maxWidth: '700px', margin: '0 auto 30px auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#1E293B' }}>Total Flats in Referred Society</span>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#1E3A8A' }}>{flatCount} Flats</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={flatCount}
                onChange={(e) => setFlatCount(Number(e.target.value))}
                style={{ width: '100%', height: '8px', borderRadius: '4px', cursor: 'pointer', accentColor: '#1E3A8A' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
                <span>50 Flats</span>
                <span>500 Flats</span>
                <span>1,000 Flats</span>
                <span>2,000+ Flats</span>
              </div>
            </div>

            {/* Output Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', maxWidth: '850px', margin: '0 auto 24px auto' }}>
              <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '20px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>ESTIMATED MONTHLY BILLING</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: '4px 0' }}>₹{monthlySaaSRevenue.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>@ ₹25/flat/month</div>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '20px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>MONTH 1 CASH BONUS</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0D9488', margin: '4px 0' }}>₹{m1Bonus.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{selectedTier === 'referral' ? '5%' : '10%'} on first bill clearance</div>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '20px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>MONTHLY RECURRING SHARE</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#1E3A8A', margin: '4px 0' }}>₹{recurringMonthly.toLocaleString('en-IN')} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>/mo</span></div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>2% recurring monthly revenue</div>
              </div>
            </div>

            <div style={{
              maxWidth: '850px',
              margin: '0 auto',
              padding: '20px 24px',
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(30, 58, 138, 0.2)' : '#EFF6FF',
              border: isDark ? '1px solid rgba(30, 58, 138, 0.4)' : '1px solid #BFDBFE',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: isDark ? '#38BDF8' : '#1E3A8A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated Year 1 Total Earnings</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1E3A8A', margin: '2px 0 0 0' }}>₹{annualEarnings.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#3B82F6', fontWeight: 600 }}>
                Paid directly to your registered UPI ID
              </div>
            </div>
          </div>

          {/* ── SUBMISSION FORM ──────────────────────────────────────────── */}
          <div id="lead-form" style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            maxWidth: '850px',
            margin: '0 auto 80px auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                QUICK 1-MINUTE REGISTRATION
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: '6px 0 8px 0' }}>
                Submit a Society Lead & Register as Partner
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                Enter your details and the society contact. Our enterprise team handles the demo, close, and pays your commission.
              </p>
            </div>

            {submittedRefId ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <CheckCircle2 size={36} color="#059669" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Society Lead Submitted Successfully!</h3>
                <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                  Your lead reference ID is <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>{submittedRefId}</strong>. Our enterprise team will schedule a demo with the society committee and keep you updated via WhatsApp.
                </p>
                <button
                  onClick={() => setSubmittedRefId(null)}
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
                {formError && (
                  <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>
                    {formError}
                  </div>
                )}

                {/* Section 1: Partner Details */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '10px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#1E3A8A', color: '#FFFFFF', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>1</span>
                    Your Details (Partner & Payout Info)
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Your Full Name *</label>
                      <input
                        type="text"
                        name="partnerName"
                        value={formData.partnerName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        required
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Your Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        name="partnerPhone"
                        value={formData.partnerPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        required
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Your Email Address</label>
                      <input
                        type="email"
                        name="partnerEmail"
                        value={formData.partnerEmail}
                        onChange={handleInputChange}
                        placeholder="rahul@example.com"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Your UPI ID (For Direct Payouts) *</label>
                      <input
                        type="text"
                        name="partnerUpi"
                        value={formData.partnerUpi}
                        onChange={handleInputChange}
                        placeholder="e.g. rahul@okaxis or 9876543210@paytm"
                        required
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Who are you?</label>
                      <select
                        name="partnerType"
                        value={formData.partnerType}
                        onChange={handleInputChange}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      >
                        <option value="broker">Property Broker / Real Estate Dealer</option>
                        <option value="resident">Apartment Resident / Flat Owner</option>
                        <option value="freelancer">Freelancer / Independent Individual</option>
                        <option value="agency">Security / Facility Agency</option>
                        <option value="other">Other Promoter</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Your City</label>
                      <input
                        type="text"
                        name="partnerCity"
                        value={formData.partnerCity}
                        onChange={handleInputChange}
                        placeholder="e.g. Hyderabad / Farooqnagar"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Target Society */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingBottom: '10px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#1E3A8A', color: '#FFFFFF', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>2</span>
                    Target Society / Apartment Details
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Society / Apartment Name *</label>
                      <input
                        type="text"
                        name="targetSocietyName"
                        value={formData.targetSocietyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Green Valley Residency"
                        required
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Society City / Location</label>
                      <input
                        type="text"
                        name="targetCity"
                        value={formData.targetCity}
                        onChange={handleInputChange}
                        placeholder="e.g. Farooqnagar / Gachibowli"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Contact Person Name</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="e.g. Mr. K. Rao"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Contact Person Role</label>
                      <select
                        name="contactRole"
                        value={formData.contactRole}
                        onChange={handleInputChange}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      >
                        <option value="RWA Secretary">RWA Secretary</option>
                        <option value="RWA President">RWA President</option>
                        <option value="Treasurer">RWA Treasurer / Committee</option>
                        <option value="Builder / Developer">Builder / Developer</option>
                        <option value="Resident Friend">Friend / Resident living there</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Contact Phone Number</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9845011223"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '6px' }}>Approximate Number of Flats</label>
                      <select
                        name="approxFlats"
                        value={formData.approxFlats}
                        onChange={handleInputChange}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px' }}
                      >
                        <option value="50-150">50 - 150 Flats</option>
                        <option value="150-300">150 - 300 Flats</option>
                        <option value="300-600">300 - 600 Flats</option>
                        <option value="600+">600+ Large Gated Community</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    🔒 Direct payout guarantee. We never share partner contact info.
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '14px 36px',
                      borderRadius: '12px',
                      backgroundColor: '#1E3A8A',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.6 : 1,
                      boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)'
                    }}
                  >
                    {isSubmitting ? 'Submitting Lead...' : 'Submit Society Lead →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── FAQ SECTION ──────────────────────────────────────────────── */}
          <div style={{ maxWidth: '850px', margin: '0 auto 60px auto' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 8px 0' }}>Who is eligible to become a GateLink Partner?</h4>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  Anyone! Property brokers, flat residents, tenants, independent house owners, security agencies, and freelancers can join and earn recurring commission.
                </p>
              </div>

              <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 8px 0' }}>When and how is the commission paid?</h4>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  Commissions are calculated monthly and sent directly to your registered UPI ID (Google Pay, PhonePe, Paytm, BHIM) once the society pays their monthly SaaS fee.
                </p>
              </div>

              <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 8px 0' }}>What does "Lifetime Commission" mean for Growth Partners?</h4>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  As long as the society you onboarded remains active and pays their GateLink subscription, you receive 2% recurring revenue share every single month with no expiration date.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
