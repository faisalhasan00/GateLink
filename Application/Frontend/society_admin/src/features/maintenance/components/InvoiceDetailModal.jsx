import React from 'react';
import Button from '../../../components/ui/Button';
import TaxInvoiceTemplate from './TaxInvoiceTemplate';
import { Printer } from 'lucide-react';

export default function InvoiceDetailModal({ invoice, onClose, societyInfo }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0 }}>Tax Invoice Breakdown</h3>
            <span style={{ fontSize: '11px', backgroundColor: '#E0F2FE', color: '#0284C7', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
              GST & RWA COMPLIANT
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <div style={{ margin: '16px 0' }}>
          <TaxInvoiceTemplate invoice={invoice} societyInfo={societyInfo} />
        </div>

        <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={16} />
            Print / Save as PDF Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
