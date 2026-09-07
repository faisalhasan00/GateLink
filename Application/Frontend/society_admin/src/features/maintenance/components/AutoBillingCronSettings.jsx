import React from 'react';
import { Settings2, Clock, IndianRupee, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function AutoBillingCronSettings({
  config,
  setConfig,
  saving,
  saveSuccess,
  totalPerFlat,
  onSaveConfig
}) {
  return (
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

      <form onSubmit={onSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
  );
}
