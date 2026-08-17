import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';

export default function PartnersPage() {
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
    partnerType: 'broker', // 'broker' | 'resident' | 'freelancer' | 'agency' | 'other'
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
  const ratePerFlat = 25; // ₹25/flat/month average
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0EA5E9]/20 selection:text-[#1E3A8A]">
      <Navbar />

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 text-[#1E3A8A] text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#1E3A8A] animate-pulse"></span>
            GateLink Partner & Revenue Share Program
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-6">
            Earn Recurring Passive Income <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9]">
              By Onboarding Residential Societies
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#475569] leading-relaxed mb-10 font-medium">
            Whether you are a real estate broker, resident, facility manager, or independent promoter — partner with GateLink and earn up to <strong className="text-[#0F172A]">10% Month 1 Bonus + 2% Lifetime Recurring Commissions</strong> on every paying society you bring.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#lead-form"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1E3A8A] text-white font-bold text-base hover:bg-[#1E3A8A]/90 transition-all duration-200 shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              Submit a Society Lead &rarr;
            </a>
            <a
              href="#calculator"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-[#CBD5E1] text-[#1E293B] font-bold text-base hover:bg-[#F1F5F9] transition-all duration-200 shadow-sm"
            >
              Calculate Your Earnings
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 text-left">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E2E8F0] shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A]">10% + 2%</div>
              <div className="text-xs text-[#64748B] font-semibold mt-1">Month 1 + Lifetime Share</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E2E8F0] shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0D9488]">Zero Cost</div>
              <div className="text-xs text-[#64748B] font-semibold mt-1">Free to Join & Partner</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E2E8F0] shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D97706]">Direct UPI</div>
              <div className="text-xs text-[#64748B] font-semibold mt-1">Monthly Auto Payouts</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E2E8F0] shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0EA5E9]">100% Digital</div>
              <div className="text-xs text-[#64748B] font-semibold mt-1">Live CRM Status Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-TIER PARTNER COMPARISON ──────────────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
            Transparent, High-Reward Partner Tiers
          </h2>
          <p className="text-[#64748B] text-base font-medium">
            Choose how deeply you want to engage. From casual resident referrals to professional lifetime brokerage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1: Referral Partner */}
          <div className="relative rounded-3xl bg-white p-8 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#059669] text-xs font-extrabold uppercase tracking-wider mb-4">
                🟢 Tier 1
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Referral Partner</h3>
              <p className="text-sm text-[#64748B] mb-6">
                For casual residents or friends who introduce a society committee.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#F1F5F9] mb-8">
                <div>
                  <div className="text-xs text-[#64748B] font-semibold">MONTH 1 COMMISSION</div>
                  <div className="text-2xl font-extrabold text-[#0F172A]">5% <span className="text-sm font-normal text-[#64748B]">of subscription</span></div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B] font-semibold">RECURRING SHARE</div>
                  <div className="text-2xl font-extrabold text-[#059669]">2% <span className="text-sm font-normal text-[#64748B]">for 12 Months</span></div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#475569] font-medium mb-6">
                <li className="flex items-center gap-2">✓ Just submit Society Name & Phone</li>
                <li className="flex items-center gap-2">✓ GateLink handles full demo & onboarding</li>
                <li className="flex items-center gap-2">✓ Direct UPI transfer on first bill clearance</li>
              </ul>
            </div>
            <a
              href="#lead-form"
              onClick={() => setSelectedTier('referral')}
              className="w-full py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-center font-bold text-sm hover:bg-[#F1F5F9] transition-colors"
            >
              Start as Referral Partner
            </a>
          </div>

          {/* Tier 2: Onboarding Partner */}
          <div className="relative rounded-3xl bg-white p-8 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0284C7]/10 text-[#0284C7] text-xs font-extrabold uppercase tracking-wider mb-4">
                🔵 Tier 2
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Onboarding Partner</h3>
              <p className="text-sm text-[#64748B] mb-6">
                For proactive champions who introduce and help collect flat/resident rosters.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#F1F5F9] mb-8">
                <div>
                  <div className="text-xs text-[#64748B] font-semibold">MONTH 1 COMMISSION</div>
                  <div className="text-2xl font-extrabold text-[#0F172A]">10% <span className="text-sm font-normal text-[#64748B]">of subscription</span></div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B] font-semibold">RECURRING SHARE</div>
                  <div className="text-2xl font-extrabold text-[#0284C7]">2% <span className="text-sm font-normal text-[#64748B]">for 24 Months (2 Yrs)</span></div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#475569] font-medium mb-6">
                <li className="flex items-center gap-2">✓ Introduce committee & assist flat roster setup</li>
                <li className="flex items-center gap-2">✓ Doubled Month 1 bonus payout (10%)</li>
                <li className="flex items-center gap-2">✓ 2 Full Years of recurring passive revenue</li>
              </ul>
            </div>
            <a
              href="#lead-form"
              onClick={() => setSelectedTier('onboarding')}
              className="w-full py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-center font-bold text-sm hover:bg-[#F1F5F9] transition-colors"
            >
              Start as Onboarding Partner
            </a>
          </div>

          {/* Tier 3: Growth Partner (Featured) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#1E3A8A] to-[#172554] text-white p-8 border border-[#1E3A8A] shadow-xl flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-[#F59E0B] text-[#78350F] text-xs font-black rounded-full uppercase tracking-wider shadow">
              MOST POPULAR
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-extrabold uppercase tracking-wider mb-4">
                🟣 Tier 3
              </div>
              <h3 className="text-xl font-bold mb-2">Growth Partner</h3>
              <p className="text-sm text-white/80 mb-6">
                For property dealers, security agencies & super promoters managing 3+ societies.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10 mb-8">
                <div>
                  <div className="text-xs text-white/70 font-semibold">MONTH 1 COMMISSION</div>
                  <div className="text-2xl font-extrabold">10% <span className="text-sm font-normal text-white/70">of subscription</span></div>
                </div>
                <div>
                  <div className="text-xs text-white/70 font-semibold">RECURRING SHARE</div>
                  <div className="text-2xl font-extrabold text-[#38BDF8]">2% LIFETIME <span className="text-xs font-normal text-white/70">(Active Soc.)</span></div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-white/90 font-medium mb-6">
                <li className="flex items-center gap-2">✓ Active indefinitely as long as society stays</li>
                <li className="flex items-center gap-2">✓ Dedicated partner account manager support</li>
                <li className="flex items-center gap-2">✓ Lifetime monthly passive payout directly to UPI</li>
              </ul>
            </div>
            <a
              href="#lead-form"
              onClick={() => setSelectedTier('growth')}
              className="w-full py-3 rounded-xl bg-white text-[#1E3A8A] text-center font-extrabold text-sm hover:bg-white/90 transition-colors shadow-md"
            >
              Apply as Growth Partner
            </a>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE EARNINGS CALCULATOR ───────────────────────────────── */}
      <section id="calculator" className="py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              Interactive Earnings Calculator
            </h2>
            <p className="text-sm sm:text-base text-[#64748B]">
              Slide to see how much passive income you earn based on society size and your partner tier.
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-6 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-sm">
            {/* Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#1E293B]">Total Flats in Referred Society</span>
                <span className="text-xl font-extrabold text-[#1E3A8A]">{flatCount} Flats</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={flatCount}
                onChange={(e) => setFlatCount(Number(e.target.value))}
                className="w-full h-2.5 bg-[#CBD5E1] rounded-lg appearance-none cursor-pointer accent-[#1E3A8A]"
              />
              <div className="flex justify-between text-xs text-[#94A3B8] mt-1 font-medium">
                <span>50 Flats</span>
                <span>500 Flats</span>
                <span>1,000 Flats</span>
                <span>2,000+ Flats</span>
              </div>
            </div>

            {/* Calculated Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E2E8F0]">
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B] font-bold uppercase">Estimated Monthly Billing</div>
                <div className="text-2xl font-extrabold text-[#0F172A] mt-1">₹{monthlySaaSRevenue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">@ ₹25/flat/mo</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B] font-bold uppercase">Month 1 Cash Bonus</div>
                <div className="text-2xl font-extrabold text-[#0D9488] mt-1">₹{m1Bonus.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">{selectedTier === 'referral' ? '5%' : '10%'} First Month</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B] font-bold uppercase">Monthly Recurring Share</div>
                <div className="text-2xl font-extrabold text-[#1E3A8A] mt-1">₹{recurringMonthly.toLocaleString('en-IN')} <span className="text-xs font-normal text-[#64748B]">/mo</span></div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">2% of net monthly bill</div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">Estimated Year 1 Total Earnings</div>
                <div className="text-2xl sm:text-3xl font-black text-[#1E3A8A] mt-0.5">₹{annualEarnings.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right text-xs text-[#3B82F6] font-medium hidden sm:block">
                Paid directly to your registered UPI ID
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBMISSION FORM ──────────────────────────────────────────────── */}
      <section id="lead-form" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-xs font-extrabold uppercase tracking-wide mb-3">
            Quick 1-Minute Registration
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            Submit a Society Lead & Register as Partner
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] font-medium">
            Enter your details and the society contact. Our team handles the demo, contract, and pays your commission.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-xl">
          {submittedRefId ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-[#F0FDF4] text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Society Lead Submitted Successfully!</h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">
                Your lead reference ID is <strong className="text-[#0F172A] font-extrabold">{submittedRefId}</strong>. Our enterprise team will schedule a demo with the society committee and keep you updated via WhatsApp.
              </p>
              <button
                onClick={() => setSubmittedRefId(null)}
                className="px-6 py-2.5 rounded-xl bg-[#1E3A8A] text-white font-bold text-sm hover:bg-[#1E3A8A]/90 transition-all"
              >
                Submit Another Society Lead
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {formError && (
                <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#F87171] text-[#991B1B] text-sm font-medium">
                  {formError}
                </div>
              )}

              {/* Section 1: Partner (Your) Details */}
              <div>
                <h3 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white text-xs flex items-center justify-center font-bold">1</span>
                  Your Details (Partner & Payout Info)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      name="partnerName"
                      value={formData.partnerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Your Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      name="partnerPhone"
                      value={formData.partnerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Your Email Address</label>
                    <input
                      type="email"
                      name="partnerEmail"
                      value={formData.partnerEmail}
                      onChange={handleInputChange}
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Your UPI ID (For Commission Payouts) *</label>
                    <input
                      type="text"
                      name="partnerUpi"
                      value={formData.partnerUpi}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@okaxis or 9876543210@paytm"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Who are you?</label>
                    <select
                      name="partnerType"
                      value={formData.partnerType}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    >
                      <option value="broker">Property Broker / Real Estate Agent</option>
                      <option value="resident">Apartment Resident / Flat Owner</option>
                      <option value="freelancer">Freelancer / Independent Individual</option>
                      <option value="agency">Security / Facility Management Agency</option>
                      <option value="other">Other Promoter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Your City</label>
                    <input
                      type="text"
                      name="partnerCity"
                      value={formData.partnerCity}
                      onChange={handleInputChange}
                      placeholder="e.g. Hyderabad / Farooqnagar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Target Society Details */}
              <div>
                <h3 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white text-xs flex items-center justify-center font-bold">2</span>
                  Target Society / Apartment Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Society / Apartment Name *</label>
                    <input
                      type="text"
                      name="targetSocietyName"
                      value={formData.targetSocietyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Green Valley Residency"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Society City / Location</label>
                    <input
                      type="text"
                      name="targetCity"
                      value={formData.targetCity}
                      onChange={handleInputChange}
                      placeholder="e.g. Farooqnagar / Gachibowli"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="e.g. Mr. K. Rao"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Contact Person Role</label>
                    <select
                      name="contactRole"
                      value={formData.contactRole}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    >
                      <option value="RWA Secretary">RWA Secretary</option>
                      <option value="RWA President">RWA President</option>
                      <option value="Treasurer">RWA Treasurer / Committee</option>
                      <option value="Builder / Developer">Builder / Developer</option>
                      <option value="Resident Friend">Friend / Resident living there</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9845011223"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">Approximate Number of Flats</label>
                    <select
                      name="approxFlats"
                      value={formData.approxFlats}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    >
                      <option value="50-150">50 - 150 Flats</option>
                      <option value="150-300">150 - 300 Flats</option>
                      <option value="300-600">300 - 600 Flats</option>
                      <option value="600+">600+ Large Gated Community</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-[#334155] mb-1">Additional Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Any specific requirement? (e.g. Need boom barrier gate integration, moving from manual register)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#64748B]">
                  🔒 Your UPI ID & personal data are encrypted. We never share partner data.
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1E3A8A] text-white font-bold text-sm hover:bg-[#1E3A8A]/90 transition-all disabled:opacity-50 shadow-md"
                >
                  {isSubmitting ? 'Submitting Lead...' : 'Submit Society Lead &rarr;'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E2E8F0]">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0]">
            <h4 className="text-base font-bold text-[#0F172A] mb-2">Who is eligible to become a GateLink Partner?</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Anyone! Real estate brokers, apartment owners, tenants, security agency operators, facility managers, and independent freelancers can join and earn recurring commission.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0]">
            <h4 className="text-base font-bold text-[#0F172A] mb-2">When and how is the commission paid?</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Commissions are calculated monthly and transferred directly to your registered UPI ID (e.g. Google Pay, PhonePe, Paytm, BHIM) once the society pays their monthly SaaS maintenance bill.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0]">
            <h4 className="text-base font-bold text-[#0F172A] mb-2">What does "Lifetime Commission" mean for Growth Partners?</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              As long as the society you onboarded remains active and pays their GateLink subscription, you receive 2% recurring revenue share every single month with no expiry date.
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
