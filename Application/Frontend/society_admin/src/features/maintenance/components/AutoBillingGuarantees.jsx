import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AutoBillingGuarantees() {
  return (
    <div style={{
      backgroundColor: '#F8FAFC',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      padding: '20px'
    }}>
      <div style={{
        fontSize: '13px',
        fontWeight: 800,
        color: '#1E293B',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <ShieldCheck size={16} color="#16A34A" /> Automated Pipeline Guarantees
      </div>
      <ul style={{
        margin: 0,
        paddingLeft: '20px',
        fontSize: '12px',
        color: '#64748B',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        lineHeight: 1.4
      }}>
        <li><strong>Zero Duplicate Billing:</strong> Pre-execution index scan ensures no flat is billed twice in the same cycle.</li>
        <li><strong>Automated FCM Alerts:</strong> Residents receive push notifications with bill breakdown on generation.</li>
        <li><strong>Live Payment Gateway:</strong> Invoices seamlessly integrate with Cashfree & UPI on resident app.</li>
        <li><strong>Audit Logging:</strong> Every automated and manual billing run is recorded in the society audit trail.</li>
      </ul>
    </div>
  );
}
