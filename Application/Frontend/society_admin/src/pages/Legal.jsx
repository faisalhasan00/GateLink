import React from 'react';
import { ShieldCheck, FileText, PhoneCall, Building2, HelpCircle } from 'lucide-react';

export default function Legal() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={24} color="var(--primary)" /> GateLink Legal & Enterprise Compliance
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Platform Privacy Policy, Terms of Service, Multi-Tenant Data Protection, and 24x7 Enterprise Support.
        </p>
      </div>

      {/* Grid of Legal Documents */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>

        {/* Privacy Policy Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--primary)" /> Privacy Policy & Data Isolation
            </h3>
          </div>
          <div style={{ padding: '20px', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
            <p><strong>1. Data Isolation & RBAC:</strong> GateLink enforces strict multi-tenant isolation. No resident data or society record is accessible outside your assigned Society ID.</p>
            <p><strong>2. Encryption & Storage:</strong> All Firestore documents, Cloud Storage files, and credentials are encrypted in transit and at rest using GCP enterprise standards.</p>
            <p><strong>3. Zero Data Monetization:</strong> We never sell resident directory records or visitor logs to third-party advertisers.</p>
          </div>
        </div>

        {/* Terms of Service Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="var(--secondary)" /> Terms of Service
            </h3>
          </div>
          <div style={{ padding: '20px', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
            <p><strong>1. Subscription License:</strong> Local Management Committees operate on active Enterprise or Standard license tiers. Terminated accounts lose write privileges.</p>
            <p><strong>2. Guard Gate Protocol:</strong> Gatekeepers must accurately log visitor entries and verify host resident approvals.</p>
            <p><strong>3. Audit Logging:</strong> System actions are logged into immutable audit tables for security inspection.</p>
          </div>
        </div>

      </div>

      {/* Contact Support Section */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <PhoneCall size={20} color="#10B981" /> 24x7 Enterprise Customer Support
        </h3>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', fontSize: '13px' }}>
          <div>
            <strong>Technical Support Email:</strong>
            <div style={{ color: 'var(--primary)', fontWeight: 600 }}>support@gatelink.in</div>
          </div>
          <div>
            <strong>Helpline Hotline:</strong>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>1800-123-4567 (Toll-Free)</div>
          </div>
          <div>
            <strong>Headquarters:</strong>
            <div style={{ color: 'var(--text-secondary)' }}>Bandra Kurla Complex, Mumbai 400051</div>
          </div>
        </div>
      </div>

    </div>
  );
}
