import React from 'react';
import logoImg from '../../../assets/logo.png';

export default function TaxInvoiceTemplate({ invoice, societyInfo }) {
  if (!invoice) return null;

  const societyName = societyInfo?.name || invoice.societyName || 'Housing Co-operative Society Ltd.';
  const societyRegNo = societyInfo?.regNo || 'REG/HSG/2018/10482';
  const societyGstin = societyInfo?.gstin || '27AAAAA0000A1Z5';
  const societyAddress = societyInfo?.address || `${societyInfo?.city || 'City'}, India`;

  const invoiceNo = invoice.invoiceNumber || invoice.billNumber || `INV/2026-27/${(invoice.id || '101').slice(-4).toUpperCase()}`;
  const issueDate = invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN');
  const dueDate = invoice.dueDate || '10-th of Month';
  const isPaid = invoice.status === 'paid';

  const maintenanceCharge = Number(invoice.maintenanceCharge || invoice.amount || 0);
  const parkingCharge = Number(invoice.parkingCharge || 0);
  const waterCharge = Number(invoice.waterCharge || 0);
  const sinkingFund = Number(invoice.sinkingFund || 0);
  const totalAmount = Number(invoice.amount || (maintenanceCharge + parkingCharge + waterCharge + sinkingFund));

  return (
    <div className="tax-invoice-printable" style={{
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      backgroundColor: '#FFFFFF',
      color: '#1E293B',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      maxWidth: '750px',
      margin: '0 auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .tax-invoice-printable, .tax-invoice-printable * { visibility: visible; }
          .tax-invoice-printable { position: absolute; left: 0; top: 0; width: 100%; max-width: 100%; border: none; box-shadow: none; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header Branding Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1E3A8A', paddingBottom: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <img src={logoImg} alt="GateLink" style={{ height: '32px', width: 'auto', display: 'block' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#E0F2FE', color: '#0284C7', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              OFFICIAL TAX INVOICE
            </span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#1E3A8A', margin: '4px 0 2px 0' }}>{societyName}</h2>
          <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>
            Reg No: <strong>{societyRegNo}</strong> | GSTIN: <strong>{societyGstin}</strong><br />
            {societyAddress}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: isPaid ? '#ECFDF5' : '#FEF3C7',
            color: isPaid ? '#059669' : '#D97706',
            border: isPaid ? '1px solid #A7F3D0' : '1px solid #FDE68A',
            fontSize: '12px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {isPaid ? '✓ PAID & SETTLED' : '⏳ PENDING PAYMENT'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#1E3A8A', marginTop: '8px' }}>
            Invoice #: {invoiceNo}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            Date: {issueDate} | Due: {dueDate}
          </div>
        </div>
      </div>

      {/* Bill To & Billing Period Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: '#F8FAFC', padding: '14px 18px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>BILL TO RESIDENT</div>
          <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
            {invoice.residentName || 'Resident Owner / Tenant'}
          </div>
          <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', fontWeight: 700 }}>
            Flat No: <span style={{ color: '#1E3A8A' }}>{invoice.flatNumber || 'N/A'}</span>
          </div>
          {invoice.residentPhone && <div style={{ fontSize: '11px', color: '#64748B' }}>Phone: {invoice.residentPhone}</div>}
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>BILLING DETAILS</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
            Billing Period: <span style={{ color: '#0EA5E9' }}>{invoice.month || 'Current Month'}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            SAC Code: <strong>999598</strong> (Services by RWAs)
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            Platform: <strong>GateLink Society OS (gatelink.in)</strong>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#1E3A8A', color: '#FFFFFF', textAlign: 'left' }}>
            <th style={{ padding: '10px 12px', borderRadius: '6px 0 0 6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>#</th>
            <th style={{ padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description / Head</th>
            <th style={{ padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SAC Code</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', borderRadius: '0 6px 6px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '10px 12px' }}>1</td>
            <td style={{ padding: '10px 12px', fontWeight: 700 }}>Base Maintenance Charges</td>
            <td style={{ padding: '10px 12px', color: '#64748B' }}>999598</td>
            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>₹{maintenanceCharge.toLocaleString('en-IN')}</td>
          </tr>
          {parkingCharge > 0 && (
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '10px 12px' }}>2</td>
              <td style={{ padding: '10px 12px', fontWeight: 700 }}>Reserved Parking Slot Fee</td>
              <td style={{ padding: '10px 12px', color: '#64748B' }}>999598</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>₹{parkingCharge.toLocaleString('en-IN')}</td>
            </tr>
          )}
          {waterCharge > 0 && (
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '10px 12px' }}>3</td>
              <td style={{ padding: '10px 12px', fontWeight: 700 }}>Water & Utility Charges</td>
              <td style={{ padding: '10px 12px', color: '#64748B' }}>999598</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>₹{waterCharge.toLocaleString('en-IN')}</td>
            </tr>
          )}
          {sinkingFund > 0 && (
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '10px 12px' }}>4</td>
              <td style={{ padding: '10px 12px', fontWeight: 700 }}>Sinking Fund Contribution</td>
              <td style={{ padding: '10px 12px', color: '#64748B' }}>999598</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>₹{sinkingFund.toLocaleString('en-IN')}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tax Calculation & Grand Total Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div style={{ width: '280px', backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
            <span>Subtotal:</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
            <span>CGST (0% - Exempt):</span>
            <span>₹0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>
            <span>SGST (0% - Exempt):</span>
            <span>₹0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, color: '#1E3A8A', borderTop: '2px solid #CBD5E1', paddingTop: '8px' }}>
            <span>Total Payable:</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Payment Settlement Proof (If Paid) */}
      {isPaid && (
        <div style={{ backgroundColor: '#ECFDF5', padding: '12px 16px', borderRadius: '8px', border: '1px solid #A7F3D0', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#065F46' }}>✓ Cashfree Payment Settlement Audit Proof</div>
          <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span>Payment Method: <strong>{invoice.paymentMethod || 'Cashfree UPI'}</strong></span>
            <span>Txn Ref / UTR #: <code>{invoice.transactionId || invoice.cashfreePaymentId || 'CF-PAY-98401'}</code></span>
            {invoice.paidAt && <span>Paid Date: <strong>{new Date(invoice.paidAt).toLocaleDateString('en-IN')}</strong></span>}
          </div>
        </div>
      )}

      {/* Legal Footer Disclaimer */}
      <div style={{ textAlign: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '14px', fontSize: '11px', color: '#94A3B8' }}>
        <div>Computer-generated Tax Invoice issued via GateLink Society OS (gatelink.in). No physical signature required.</div>
        <div style={{ marginTop: '2px', fontWeight: 700, color: '#64748B' }}>GateLink Technologies • Society Maintenance & Security Platform</div>
      </div>
    </div>
  );
}
