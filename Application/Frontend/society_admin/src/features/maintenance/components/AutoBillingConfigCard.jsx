import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { societyAdminService } from '../../../services/societyAdminService';
import AutoBillingCronSettings from './AutoBillingCronSettings';
import AutoBillingManualTrigger from './AutoBillingManualTrigger';
import AutoBillingGuarantees from './AutoBillingGuarantees';

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
      <AutoBillingCronSettings
        config={config}
        setConfig={setConfig}
        saving={saving}
        saveSuccess={saveSuccess}
        totalPerFlat={totalPerFlat}
        onSaveConfig={handleSaveConfig}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <AutoBillingManualTrigger
          manualMonth={manualMonth}
          setManualMonth={setManualMonth}
          runningManual={runningManual}
          manualResult={manualResult}
          onTriggerManualNow={handleTriggerManualNow}
        />

        <AutoBillingGuarantees />
      </div>
    </div>
  );
}
