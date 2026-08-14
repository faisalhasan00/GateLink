import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  FileText, 
  DollarSign, 
  AlertCircle,
  ShieldCheck,
  Landmark
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';
import BankAccountCard from '../components/finance/BankAccountCard';
import Button from '../components/ui/Button';

export default function Maintenance() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'bank_account'
  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentModalBill, setPaymentModalBill] = useState(null);

  const [billingScope, setBillingScope] = useState('single');
  const [selectedResidentUid, setSelectedResidentUid] = useState('');
  const [formData, setFormData] = useState({
    title: 'Monthly Maintenance & Society Facilities',
    month: 'March 2026',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    maintenanceCharge: 3500,
    parkingCharge: 500,
    waterCharge: 300,
    sinkingFund: 200,
    penaltyFee: 0,
  });

  const [paymentData, setPaymentData] = useState({
    method: 'Razorpay UPI / Card',
    transactionId: '',
    notes: 'Verified via Society Admin Office'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubBills = societyAdminService.subscribeMaintenanceBills(
      societyId,
      (data) => {
        setBills(data);
        setLoading(false);
      },
      (err) => console.error('Error fetching bills:', err)
    );

    const unsubUsers = societyAdminService.subscribeResidents(
      societyId,
      (resList) => setResidents(resList),
      (err) => console.error('Error fetching residents:', err)
    );

    return () => {
      if (unsubBills) unsubBills();
      if (unsubUsers) unsubUsers();
    };
  }, [societyId]);

  const calculateTotal = (data) => {
    const m = Number(data.maintenanceCharge) || 0;
    const p = Number(data.parkingCharge) || 0;
    const w = Number(data.waterCharge) || 0;
    const s = Number(data.sinkingFund) || 0;
    const f = Number(data.penaltyFee) || 0;
    return m + p + w + s + f;
  };

  const handleGenerateBills = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const totalAmount = calculateTotal(formData);
      const resObj = residents.find(r => r.id === selectedResidentUid || r.uid === selectedResidentUid);
      const billNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      await societyAdminService.createMaintenanceBill(societyId, {
        billNumber: billNo,
        title: formData.title,
        month: formData.month,
        dueDate: formData.dueDate,
        maintenanceCharge: Number(formData.maintenanceCharge),
        parkingCharge: Number(formData.parkingCharge),
        waterCharge: Number(formData.waterCharge),
        sinkingFund: Number(formData.sinkingFund),
        penaltyFee: Number(formData.penaltyFee),
        amount: totalAmount,
        residentUid: selectedResidentUid || 'ALL',
        residentName: resObj?.name || 'Resident',
        flatNumber: resObj?.flatNumber || 'N/A',
      });

      alert(`Successfully generated maintenance bill #${billNo}.`);
      setIsSubmitting(false);
      setIsGenerateModalOpen(false);
    } catch (e) {
      setIsSubmitting(false);
      alert('Error generating bill: ' + e.message);
    }
  };

  const handleSettlePayment = async (e) => {
    e.preventDefault();
    if (!paymentModalBill) return;

    try {
      const txnId = paymentData.transactionId.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

      await societyAdminService.updateBillStatus(societyId, paymentModalBill.id, 'paid', {
        paymentMethod: paymentData.method,
        transactionId: txnId,
        paymentNotes: paymentData.notes
      });

      alert(`Payment settled successfully! Transaction ID: ${txnId}`);
      setPaymentModalBill(null);
    } catch (e) {
      alert('Error settling payment: ' + e.message);
    }
  };

  const handleApproveVerification = async (bill) => {
    try {
      await societyAdminService.updateBillStatus(societyId, bill.id, 'paid', {
        verifiedBy: session?.adminName || 'Society Admin'
      });
      alert(`Payment for ${bill.billNumber || bill.id} approved successfully!`);
    } catch (e) {
      alert('Error approving payment: ' + e.message);
    }
  };

  const handleRejectVerification = async (bill) => {
    if (!window.confirm('Reject this UTR submission and revert bill to pending status?')) return;
    try {
      await societyAdminService.updateBillStatus(societyId, bill.id, 'pending', {
        rejectionReason: 'Invalid or unverified UTR reference number'
      });
      alert(`UTR submission rejected. Bill reverted to pending.`);
    } catch (e) {
      alert('Error rejecting payment: ' + e.message);
    }
  };

  const filteredBills = bills.filter(b => {
    const q = searchQuery.toLowerCase();
    const billNo = (b.billNumber || b.id || '').toLowerCase().includes(q);
    const residentName = (b.residentName || '').toLowerCase().includes(q);
    const flatNo = (b.flatNumber || '').toLowerCase().includes(q);
    const matchesSearch = billNo || residentName || flatNo;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesMethod = methodFilter === 'All' || (b.paymentMethod || 'Razorpay') === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalGeneratedAmount = bills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const paidBills = bills.filter(b => b.status === 'paid');
  const pendingBills = bills.filter(b => b.status === 'pending');
  const overdueBills = bills.filter(b => b.status === 'overdue' || (b.status === 'pending' && new Date(b.dueDate) < new Date()));
  const totalCollectedAmount = paidBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingAmount = pendingBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const overdueAmount = overdueBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingVerifications = bills.filter(b => b.status === 'pending_verification');

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading maintenance register...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <CreditCard size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Total Generated</p>
            <h3>₹{(totalGeneratedAmount / 1000).toFixed(1)}k</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{bills.length} Bills Issued</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <DollarSign size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Total Collected</p>
            <h3>₹{(totalCollectedAmount / 1000).toFixed(1)}k</h3>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>{paidBills.length} Settled</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
            <AlertCircle size={22} color="var(--warning)" />
          </div>
          <div className="stat-info">
            <p>Pending Collection</p>
            <h3>₹{(pendingAmount / 1000).toFixed(1)}k</h3>
            <span style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 600 }}>{pendingBills.length} Outstanding</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
            <AlertCircle size={22} color="var(--danger)" />
          </div>
          <div className="stat-info">
            <p>Overdue Amount</p>
            <h3>₹{(overdueAmount / 1000).toFixed(1)}k</h3>
            <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>{overdueBills.length} Overdue</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'invoices' ? '#1E3A8A' : 'transparent',
            color: activeTab === 'invoices' ? '#FFFFFF' : '#475569',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <CreditCard size={15} />
          <span>All Invoices & Ledger</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank_account')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'bank_account' ? '#1E3A8A' : 'transparent',
            color: activeTab === 'bank_account' ? '#FFFFFF' : '#475569',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Landmark size={15} />
          <span>Auto-Settlement Bank A/C</span>
        </button>
      </div>

      {activeTab === 'bank_account' ? (
        <BankAccountCard societyId={societyId} />
      ) : (
        <>
          {pendingVerifications.length > 0 && (
            <div className="card" style={{ padding: '20px', borderLeft: '4px solid #F59E0B', backgroundColor: '#FFFBEB' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#92400E' }}>Pending Payment Verifications Queue ({pendingVerifications.length})</h4>
              <table className="data-table" style={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
                <thead>
                  <tr>
                    <th>Invoice & Resident</th>
                    <th>UTR / Ref</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVerifications.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.billNumber || b.id}</strong> — {b.residentName} ({b.flatNumber})</td>
                      <td><code>{b.utrNumber || 'N/A'}</code></td>
                      <td>₹{b.amount}</td>
                      <td>
                        <button onClick={() => handleApproveVerification(b)} className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px', marginRight: '6px' }}>Approve</button>
                        <button onClick={() => handleRejectVerification(b)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)' }}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            <input 
              type="text" 
              placeholder="Search by Bill No, Resident, Flat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', width: '240px' }}
            />
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
              <option value="All">Status: All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setIsGenerateModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Generate Maintenance Bill
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Maintenance Register</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Resident & Flat</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No maintenance bills found.</td></tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.id}>
                    <td><code>{b.billNumber || b.id}</code></td>
                    <td><strong>{b.residentName}</strong> (Flat {b.flatNumber})</td>
                    <td>{b.month || 'Current'}</td>
                    <td><strong>₹{b.amount}</strong></td>
                    <td>{b.dueDate}</td>
                    <td><span className={`badge ${b.status === 'paid' ? 'success' : 'warning'}`}>{b.status}</span></td>
                    <td>
                      {b.status !== 'paid' && (
                        <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setPaymentModalBill(b)}>
                          Settle
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

      {isGenerateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGenerateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate Maintenance Bill</h3>
              <button onClick={() => setIsGenerateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleGenerateBills} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Select Resident</label>
                <select className="form-select" value={selectedResidentUid} onChange={e => setSelectedResidentUid(e.target.value)} required>
                  <option value="">Choose resident...</option>
                  {residents.map(r => (
                    <option key={r.id || r.uid} value={r.id || r.uid}>{r.name} — Flat {r.flatNumber}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Month / Period</label>
                <input required type="text" value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Maintenance Charge (₹)</label>
                <input required type="number" value={formData.maintenanceCharge} onChange={e => setFormData({ ...formData, maintenanceCharge: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsGenerateModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Generating...' : 'Save & Generate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
