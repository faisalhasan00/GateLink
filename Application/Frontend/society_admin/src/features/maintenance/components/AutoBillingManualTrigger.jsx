import React from 'react';
import { Zap, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function AutoBillingManualTrigger({
  manualMonth,
  setManualMonth,
  runningManual,
  manualResult,
  onTriggerManualNow
}) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      padding: '24px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: '#FEF3C7',
          color: '#D97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Instant Monthly Invoicing Run
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
            Manually trigger billing for any specific month
          </p>
        </div>
      </div>

      <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
        Need to generate bills ahead of schedule or for a previous cycle? Run the automated pipeline on demand. 
        GateLink automatically enforces <strong>Idempotency</strong> — flats already billed for this month will not be charged again.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Billing Cycle Month
          </label>
          <input
            type="text"
            value={manualMonth}
            onChange={(e) => setManualMonth(e.target.value)}
            placeholder="e.g. September 2026"
            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          />
        </div>

        <Button
          type="button"
          onClick={onTriggerManualNow}
          disabled={runningManual}
          style={{
            backgroundColor: '#1E3A8A',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '4px'
          }}
        >
          {runningManual ? (
            <>
              <RefreshCw className="animate-spin" size={16} /> Generating Invoices...
            </>
          ) : (
            <>
              <Zap size={16} /> Run Invoicing for {manualMonth}
            </>
          )}
        </Button>

        {manualResult && (
          <div style={{
            marginTop: '12px',
            padding: '14px',
            borderRadius: '12px',
            backgroundColor: manualResult.skipped ? '#FEF2F2' : '#F0FDF4',
            border: `1px solid ${manualResult.skipped ? '#FECACA' : '#BBF7D0'}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '13px',
              color: manualResult.skipped ? '#991B1B' : '#166534'
            }}>
              {manualResult.skipped ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              {manualResult.skipped ? 'Invoicing Completed (No New Bills Needed)' : 'Invoices Successfully Generated!'}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
              {manualResult.skipped ? (
                `All active flats already have invoices for ${manualResult.month || manualMonth}.`
              ) : (
                <>
                  • <strong>{manualResult.generatedCount}</strong> invoices created.<br />
                  • Total Amount: <strong>₹{(manualResult.totalAmount || 0).toLocaleString('en-IN')}</strong>.<br />
                  • Due Date: <strong>{manualResult.dueDate}</strong>.<br />
                  • Push notifications dispatched to resident mobile devices.
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
