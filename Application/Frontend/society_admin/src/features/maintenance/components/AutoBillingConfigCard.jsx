import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Settings2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  IndianRupee,
  RefreshCw,
  BellRing
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { societyAdminService } from '../../../services/societyAdminService';

export default function AutoBillingConfigCard({ societyId, onBillingGenerated }) {
  const [config, setConfig] = useState({
    isAutoBillingEnabled: true,
    billingDayOfMonth: 1,
    dueDayOfMonth: 15,
    baseMaintenanceCharge: 3500,
    parkingCharge: 500,
    waterCharge: 300,
    sinkingFund: 200,
    billingTitle: 'Monthly Maintenance & Society Facilities',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [runningManual, setRunningManual] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [manualResult, setManualResult] = useState(null);
  const [manualMonth, setManualMonth] = useState(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const d = new Date();
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  useEffect(() => {
    if (!societyId) return;

    let isMounted = true;
    societyAdminService.getBillingConfig(societyId)
      .then((data) => {
        if (isMounted && data) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error('Error loading billing config:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [societyId]);

  const totalPerFlat = (
    Number(config.baseMaintenanceCharge || 0) +
    Number(config.parkingCharge || 0) +
    Number(config.waterCharge || 0) +
    Number(config.sinkingFund || 0)
  );

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await societyAdminService.updateBillingConfig(societyId, config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      alert('Error saving auto-billing settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerManualNow = async () => {
    const confirmRun = window.confirm(
      `Are you sure you want to generate monthly invoices for "${manualMonth}" right now?\n\n` +
      `Each occupied flat will receive an invoice of ₹${totalPerFlat.toLocaleString('en-IN')}.\n` +
      `Flats already billed for this month will be automatically skipped.`
    );
    if (!confirmRun) return;

    setRunningManual(true);
    setManualResult(null);

    try {
      const res = await societyAdminService.triggerAutoInvoicing(societyId, {
        month: manualMonth,
        isManualTrigger: true,
      });
      setManualResult(res);
      if (onBillingGenerated) onBillingGenerated();
    } catch (err) {
      alert('Error triggering auto-invoicing: ' + err.message);
    } finally {
      setRunningManual(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', background: 'white', borderRadius: '16px' }}>
        <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 8px', color: '#1E3A8A' }} />
        <p style={{ fontSize: '13px', color: '#64748B' }}>Loading automated billing configuration...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
      {/* 1. Automated Cron Settings Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Settings2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Automated Monthly Invoicing Cron
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Serverless scheduled recurring billing engine
              </p>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            backgroundColor: config.isAutoBillingEnabled ? '#DCFCE7' : '#F1F5F9',
            color: config.isAutoBillingEnabled ? '#166534' : '#64748B',
            fontSize: '11.5px',
            fontWeight: 700
          }}>
            <Clock size={12} />
            {config.isAutoBillingEnabled ? 'Cron Active (Daily 00:05 IST)' : 'Cron Paused'}
          </div>
        </div>

        <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Toggle Switch */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '12px',
            backgroundColor: config.isAutoBillingEnabled ? '#F8FAFC' : '#FEF2F2',
            border: `1px solid ${config.isAutoBillingEnabled ? '#E2E8F0' : '#FECACA'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Enable Automatic Monthly Generation
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                Generates invoices automatically on schedule without manual admin action
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.isAutoBillingEnabled}
              onChange={(e) => setConfig({ ...config, isAutoBillingEnabled: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#1E3A8A' }}
            />
          </div>

          {/* Billing Day & Due Day */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Billing Day of Month
              </label>
              <select
                value={config.billingDayOfMonth}
                onChange={(e) => setConfig({ ...config, billingDayOfMonth: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <option value={1}>1st of every month (Standard)</option>
                <option value={5}>5th of every month</option>
                <option value={10}>10th of every month</option>
                <option value={15}>15th of every month</option>
                <option value={20}>20th of every month</option>
                <option value={25}>25th of every month</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Payment Due Day
              </label>
              <select
                value={config.dueDayOfMonth}
                onChange={(e) => setConfig({ ...config, dueDayOfMonth: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <option value={10}>10th of the month</option>
                <option value={15}>15th of the month (Recommended)</option>
                <option value={20}>20th of the month</option>
                <option value={25}>25th of the month</option>
                <option value={28}>28th of the month</option>
              </select>
            </div>
          </div>

          {/* Default Fee Breakdown */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IndianRupee size={14} color="#1E3A8A" /> Default Monthly Fee Structure (Per Flat)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Base Maintenance (₹)</label>
                <input
                  type="number"
                  value={config.baseMaintenanceCharge}
                  onChange={(e) => setConfig({ ...config, baseMaintenanceCharge: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Parking Fee (₹)</label>
                <input
                  type="number"
                  value={config.parkingCharge}
                  onChange={(e) => setConfig({ ...config, parkingCharge: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Water & Utility (₹)</label>
                <input
                  type="number"
                  value={config.waterCharge}
                  onChange={(e) => setConfig({ ...config, waterCharge: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Sinking Fund (₹)</label>
                <input
                  type="number"
                  value={config.sinkingFund}
                  onChange={(e) => setConfig({ ...config, sinkingFund: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Invoice Title */}
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Invoice Description Title
            </label>
            <input
              type="text"
              value={config.billingTitle}
              onChange={(e) => setConfig({ ...config, billingTitle: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          {/* Summary Total & Save */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            marginTop: '4px'
          }}>
            <div>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Total Monthly Bill: </span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#1E3A8A' }}>₹{totalPerFlat.toLocaleString('en-IN')} / Flat</span>
            </div>

            <Button type="submit" disabled={saving} style={{ padding: '8px 20px', borderRadius: '10px' }}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>

          {saveSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '12px', fontWeight: 600 }}>
              <CheckCircle2 size={15} /> Billing automation settings saved successfully.
            </div>
          )}
        </form>
      </div>

      {/* 2. On-Demand Manual Generator & Safety Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* On-Demand Generator Box */}
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
              onClick={handleTriggerManualNow}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '13px', color: manualResult.skipped ? '#991B1B' : '#166534' }}>
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

        {/* Safety & Notification Checklist */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '20px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#16A34A" /> Automated Pipeline Guarantees
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: 1.4 }}>
            <li><strong>Zero Duplicate Billing:</strong> Pre-execution index scan ensures no flat is billed twice in the same cycle.</li>
            <li><strong>Automated FCM Alerts:</strong> Residents receive push notifications with bill breakdown on generation.</li>
            <li><strong>Live Payment Gateway:</strong> Invoices seamlessly integrate with Cashfree & UPI on resident app.</li>
            <li><strong>Audit Logging:</strong> Every automated and manual billing run is recorded in the society audit trail.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
