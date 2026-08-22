import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, CreditCard, FileText, CheckCircle2, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function RefundPolicyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Refund & Cancellation Policy - GateLink" 
        description="GateLink official refund, cancellation, and payment processing policy for housing societies, RWAs, and maintenance bill payments."
        canonicalUrl="https://gatelink.in/refund-policy"
      />

      <Navbar />

      {/* Hero Header */}
      <header style={{ paddingTop: '120px', paddingBottom: '50px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0EA5E9', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#0EA5E9', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
            <RefreshCw size={14} /> Billing Transparency
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.2, marginBottom: '12px' }}>
            Refund & Cancellation Policy
          </h1>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '720px', lineHeight: 1.6 }}>
            Transparent financial guidelines governing GateLink SaaS subscription plans, RWA onboarding, and resident maintenance bill payments.
          </p>
          <div style={{ marginTop: '16px', fontSize: '12px', color: isDark ? '#64748B' : '#94A3B8', fontWeight: 600 }}>
            Last Updated: August 2026 • Effective for all active GateLink accounts
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '50px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', padding: '36px', boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.05)', fontSize: '15px', lineHeight: 1.7, color: isDark ? '#CBD5E1' : '#334155' }}>
            
            {/* Overview */}
            <p style={{ fontSize: '16px', marginBottom: '28px' }}>
              At <strong>GateLink Technologies</strong>, we maintain complete transparency in our billing operations. This policy governs refunds, cancellations, and payment processing terms for both Housing Society / RWA software subscriptions and resident maintenance bill payments processed via our integrated Cashfree payment gateway.
            </p>

            {/* Section 1 */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} color="#0EA5E9" /> 1. Housing Society SaaS Subscription Refunds
            </h2>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>14-Day Money-Back Guarantee:</strong> Newly onboarded housing societies (RWAs) are eligible for a 100% refund on their initial SaaS subscription plan within 14 days of activation if dissatisfied with the service.</li>
              <li><strong>Pro-Rata Adjustments:</strong> Annual subscriptions cancelled after 14 days will receive a pro-rata refund for the unexpired full calendar months, minus a nominal 5% administrative setup fee.</li>
              <li><strong>Monthly Plans:</strong> Monthly subscription fees are non-refundable once the billing month has commenced.</li>
            </ul>

            {/* Section 2 */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCw size={20} color="#0EA5E9" /> 2. Resident Maintenance & Utility Payments
            </h2>
            <p style={{ marginBottom: '12px' }}>
              GateLink acts as a payment technology facilitator between residents and their registered Housing Society (RWA) bank account:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Failed & Double-Debited Transactions:</strong> If funds are debited from a resident’s bank account or credit card but the transaction fails or is double-charged, the excess amount is automatically reversed by the bank within 3 to 5 business days.</li>
              <li><strong>Direct Deposit Transfers:</strong> Once a maintenance payment status shows "Settled", funds are directly transferred into the RWA’s registered bank account. Any disputes regarding ledger entry credits must be raised directly with your Society Administrator.</li>
              <li><strong>Convenience Fees:</strong> Transaction convenience fees charged by third-party payment gateways (UPI, Credit/Debit Cards, Net Banking) are non-refundable unless the failure occurred due to a system malfunction on GateLink.</li>
            </ul>

            {/* Section 3 */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="#0EA5E9" /> 3. Cancellation Process
            </h2>
            <p style={{ marginBottom: '12px' }}>
              RWAs may cancel their GateLink subscription at any time by following these steps:
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Submit a formal cancellation request via the Society Admin Portal or email <a href="mailto:billing@gatelink.in" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>billing@gatelink.in</a>.</li>
              <li>Complete the account closure procedure with your designated GateLink Account Manager.</li>
              <li>Export all society resident data, visitor logs, and accounting receipts prior to the final account deactivation date.</li>
            </ol>

            {/* Section 4: Refund Timelines & Mode */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} color="#0EA5E9" /> 4. Refund Processing Timelines
            </h2>
            <div style={{ background: isDark ? '#020617' : '#F1F5F9', borderRadius: '12px', padding: '20px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>PAYMENT METHOD</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>UPI / Net Banking</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>ESTIMATED REFUND TIME</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0EA5E9' }}>2 - 4 Business Days</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>CREDIT / DEBIT CARD</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0EA5E9' }}>5 - 7 Business Days</div>
                </div>
              </div>
            </div>

            {/* Contact Box */}
            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={20} color="#0EA5E9" />
              <span>For billing inquiries or refund assistance, contact our Finance Team at <a href="mailto:billing@gatelink.in" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>billing@gatelink.in</a> or support at <a href="mailto:support@gatelink.in" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>support@gatelink.in</a>.</span>
            </div>

          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
