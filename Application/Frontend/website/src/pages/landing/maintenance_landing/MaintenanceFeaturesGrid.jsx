import React from 'react';
import { 
  FileText, 
  CreditCard, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

const FEATURES = [
  {
    icon: FileText,
    title: 'Automated Multi-Component Invoicing',
    desc: 'Society administrators can configure itemized recurring billing parameters including base maintenance charges, fixed vehicle parking fees, water utility charges, and dedicated sinking funds for automated monthly generation.',
    highlight: '✓ Recurring monthly billing cycles & itemized charge breakdowns'
  },
  {
    icon: CreditCard,
    title: 'Integrated Cashfree UPI & Card Payments',
    desc: 'Direct payment gateway integration via Cashfree enables residents to pay their maintenance dues seamlessly through UPI intent (GPay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking with immediate status updates.',
    highlight: '✓ In-app UPI, Card & Net Banking payment gateway checkout'
  },
  {
    icon: Receipt,
    title: 'GST Tax Invoices & Digital Receipts',
    desc: 'Generate official tax invoices with society GSTIN, registration numbers, unique invoice sequences, and itemized component breakdowns. Residents can view, print, or download authentic A4 PDF receipts instantly.',
    highlight: '✓ Printable PDF tax invoice generation & GSTIN declaration'
  },
  {
    icon: AlertCircle,
    title: 'Overdue Dues & Defaulter Tracking',
    desc: 'Track flat-wise payment statuses with clear paid, unpaid, and overdue indicators. The system automatically computes configured late penalty fees when invoices exceed due dates and provides clear overdue summaries.',
    highlight: '✓ Status filtering, overdue visibility & late penalty computation'
  },
  {
    icon: CheckCircle2,
    title: 'Offline Cheque & NEFT Payment Reconciliation',
    desc: 'Accommodate traditional payment preferences. Residents submit offline bank transfer UTR numbers, cheques, or cash details through the app, allowing society admins to review and approve payments with official records.',
    highlight: '✓ Offline UTR reference submission & admin verification'
  },
  {
    icon: Clock,
    title: 'Financial Payment History & Ledger Records',
    desc: 'Maintain chronological transaction logs for every apartment unit. Treasurers and residents can inspect historical payment records, transaction reference IDs, and payment methods for transparent society audits.',
    highlight: '✓ Chronological transaction logs & resident billing archives'
  }
];

export default function MaintenanceFeaturesGrid({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
          Core Features of GateLink Maintenance &amp; Billing
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto' }}>
          Explore the verified billing, payment collection, and accounting features engineered into the GateLink platform.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {FEATURES.map((f, i) => {
          const IconComp = f.icon;
          return (
            <div 
              key={i} 
              style={{ 
                background: isDark ? '#0F172A' : '#FFFFFF', 
                padding: '28px', 
                borderRadius: '16px', 
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', 
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <IconComp size={26} color="#10B981" />
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>{f.title}</h3>
              </div>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                {f.desc}
              </p>
              <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                {f.highlight}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
