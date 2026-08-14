import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  AlertCircle,
  HelpCircle,
  Landmark
} from 'lucide-react';
import { societyAdminService } from '../../services/societyAdminService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

/**
 * GateLink Society Bank Account & Auto-Settlement Management Card
 * Allows the Society Admin to view, configure, and update their bank account details
 * for direct Cashfree auto-settlements.
 */
export default function BankAccountCard({ societyId, isDark = false }) {
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Current',
    upiId: '',
    branchName: '',
    status: 'Not Configured',
    settlementMode: 'Cashfree Auto-Settlement (T+1)',
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...bankData });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }
    loadBankDetails();
  }, [societyId]);

  const loadBankDetails = async () => {
    setLoading(true);
    try {
      const data = await societyAdminService.getSocietyBankDetails(societyId);
      if (data && data.accountNumber) {
        setBankData(data);
        setForm(data);
      } else {
        // Default fallback with society name
        const society = await societyAdminService.getSocietyDetails(societyId);
        const defaultName = society?.name ? `${society.name} RWA Account` : 'Resident Welfare Association';
        setBankData(prev => ({ ...prev, accountHolderName: defaultName }));
        setForm(prev => ({ ...prev, accountHolderName: defaultName }));
      }
    } catch (err) {
      console.error('Error loading bank details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Basic Validation
    if (!form.accountHolderName.trim()) {
      setError('Account Holder Name is required.');
      return;
    }
    if (!form.accountNumber || form.accountNumber.length < 9) {
      setError('Please enter a valid Bank Account Number (minimum 9 digits).');
      return;
    }
    if (!form.ifscCode || form.ifscCode.length !== 11) {
      setError('Please enter a valid 11-character IFSC Code (e.g. HDFC0000128).');
      return;
    }
    if (!form.bankName.trim()) {
      setError('Bank Name is required.');
      return;
    }

    setSaving(true);
    try {
      const cleanData = {
        accountHolderName: form.accountHolderName.trim(),
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.toUpperCase().trim(),
        accountType: form.accountType || 'Current',
        upiId: form.upiId ? form.upiId.trim() : '',
        branchName: form.branchName ? form.branchName.trim() : '',
      };

      await societyAdminService.updateSocietyBankDetails(societyId, cleanData);
      setBankData({ ...bankData, ...cleanData, status: 'Verified' });
      setIsEditing(false);
      setSuccessMsg('Bank account details successfully verified and saved for auto-settlement!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError('Failed to update bank details: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card isDark={isDark} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #E0F2FE', borderTopColor: '#1E3A8A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '14px', color: '#64748B' }}>Loading settlement bank details...</span>
        </div>
      </Card>
    );
  }

  const isConfigured = Boolean(bankData.accountNumber);

  return (
    <Card isDark={isDark} style={{ padding: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369A1' }}>
            <Landmark size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', margin: 0, fontFamily: 'Inter, sans-serif' }}>
              Society Settlement Bank Account
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0', fontFamily: 'Inter, sans-serif' }}>
              Direct T+1 auto-settlements for all resident maintenance & facility payments
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant={isConfigured ? 'success' : 'pending'}>
            {isConfigured ? 'Auto-Settlement Active' : 'Setup Required'}
          </Badge>
          {!isEditing && (
            <Button
              variant="outline"
              size="small"
              icon={Edit3}
              onClick={() => {
                setForm({ ...bankData });
                setIsEditing(true);
              }}
            >
              {isConfigured ? 'Edit Details' : 'Configure Bank A/C'}
            </Button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {!isEditing ? (
        /* Read-Only Summary View */
        <div>
          {isConfigured ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', padding: '18px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Account Holder Name</span>
                <p style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', margin: '4px 0 0' }}>
                  {bankData.accountHolderName || 'N/A'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Bank Name</span>
                <p style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', margin: '4px 0 0' }}>
                  {bankData.bankName || 'N/A'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Account Number</span>
                <p style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', margin: '4px 0 0', letterSpacing: '1px' }}>
                  •••• •••• {bankData.accountNumber?.slice(-4) || '••••'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>IFSC Code</span>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0369A1', margin: '4px 0 0', fontFamily: 'monospace' }}>
                  {bankData.ifscCode || 'N/A'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Account Type</span>
                <p style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', margin: '4px 0 0' }}>
                  {bankData.accountType || 'Current Account'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Settlement Schedule</span>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A', margin: '4px 0 0' }}>
                  Daily T+1 Direct Bank Deposit
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 16px', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <Landmark size={36} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 4px' }}>
                No Bank Account Configured
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '420px', margin: '0 auto 16px' }}>
                Link the society's official bank account to automatically receive maintenance fee settlements from resident payments.
              </p>
              <Button
                variant="primary"
                size="medium"
                onClick={() => setIsEditing(true)}
              >
                Configure Society Bank Account
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Edit Bank Details Form */
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <Input
              label="Account Holder Name (e.g. Society / RWA Name)"
              required
              isDark={isDark}
              value={form.accountHolderName}
              onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
              placeholder="e.g. Palm Meadows RWA Account"
            />

            <Input
              label="Bank Name"
              required
              isDark={isDark}
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="e.g. HDFC Bank, SBI, ICICI"
            />

            <Input
              label="Bank Account Number"
              required
              type="text"
              isDark={isDark}
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="Enter full account number"
            />

            <Input
              label="IFSC Code (11 alphanumeric characters)"
              required
              isDark={isDark}
              value={form.ifscCode}
              onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })}
              placeholder="e.g. HDFC0000128"
              maxLength={11}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
                Account Type
              </label>
              <select
                value={form.accountType}
                onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1.5px solid #E2E8F0',
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="Current">Current Account (Recommended for RWAs)</option>
                <option value="Savings">Savings Account</option>
              </select>
            </div>

            <Input
              label="Branch Name (Optional)"
              isDark={isDark}
              value={form.branchName}
              onChange={(e) => setForm({ ...form, branchName: e.target.value })}
              placeholder="e.g. Indiranagar Branch"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <Button
              variant="ghost"
              size="medium"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              icon={Save}
              loading={saving}
            >
              Save & Verify Bank Account
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
