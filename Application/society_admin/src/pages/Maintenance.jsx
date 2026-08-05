import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Printer, 
  Download, 
  DollarSign, 
  Building2, 
  AlertCircle,
  Calendar,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  addDoc, 
  getDocs, 
  writeBatch, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getSocietyAdminSession } from '../services/sessionManager';

export default function Maintenance() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'paid', 'pending'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentModalBill, setPaymentModalBill] = useState(null);

  // Form State for Bill Generation
  const [billingScope, setBillingScope] = useState('single'); // 'single' or 'all'
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

  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    method: 'Razorpay UPI / Card',
    transactionId: '',
    notes: 'Verified via Society Admin Office'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch Maintenance Bills Stream
    const qBills = query(collection(db, `societies/${societyId}/maintenance_bills`), orderBy('createdAt', 'desc'));
    const unsubBills = onSnapshot(qBills, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBills(data);
      setLoading(false);
    });

    // 2. Fetch Residents for single bill dropdown
    const qUsers = query(collection(db, `societies/${societyId}/users`), where('role', '==', 'resident'));
    getDocs(qUsers).then((snap) => {
      const resList = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setResidents(resList);
    }).catch(e => console.error(e));

    return () => unsubBills();
  }, [societyId]);

  // Compute Total Bill Amount dynamically
  const calculateTotal = (data) => {
    const m = Number(data.maintenanceCharge) || 0;
    const p = Number(data.parkingCharge) || 0;
    const w = Number(data.waterCharge) || 0;
    const s = Number(data.sinkingFund) || 0;
    const f = Number(data.penaltyFee) || 0;
    return m + p + w + s + f;
  };

  // Generate Itemized Bill(s)
  const handleGenerateBills = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const totalAmount = calculateTotal(formData);
      const billsRef = collection(db, `societies/${societyId}/maintenance_bills`);
      const timestampStr = new Date().toISOString();

      if (billingScope === 'single') {
        if (!selectedResidentUid) {
          alert('Please select a resident for single billing.');
          setIsSubmitting(false);
          return;
        }

        const resObj = residents.find(r => r.uid === selectedResidentUid);
        const billNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        const newBill = {
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
          status: 'pending',
          residentUid: selectedResidentUid,
          residentName: resObj?.name || 'Resident',
          flatNumber: resObj?.flatNumber || 'N/A',
          block: resObj?.block || 'A',
          createdAt: timestampStr
        };

        await addDoc(billsRef, newBill);

        // Dispatch in-app notification to resident
        await addDoc(collection(db, `societies/${societyId}/users/${selectedResidentUid}/notifications`), {
          title: `New Maintenance Bill Generated (${formData.month})`,
          body: `Bill #${billNo} for ₹${totalAmount} has been generated. Due Date: ${formData.dueDate}`,
          createdAt: timestampStr,
          isRead: false,
          type: 'billing'
        });

        alert(`Successfully generated bill #${billNo} for ${resObj?.name}.`);
      } else {
        // Bulk Society Billing
        if (residents.length === 0) {
          alert('No registered residents found to generate bulk bills.');
          setIsSubmitting(false);
          return;
        }

        const batch = writeBatch(db);
        let count = 0;

        for (const resObj of residents) {
          const billNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const newDocRef = doc(billsRef);

          batch.set(newDocRef, {
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
            status: 'pending',
            residentUid: resObj.uid,
            residentName: resObj.name || 'Resident',
            flatNumber: resObj.flatNumber || 'N/A',
            block: resObj.block || 'A',
            createdAt: timestampStr
          });

          // Dispatch notification
          addDoc(collection(db, `societies/${societyId}/users/${resObj.uid}/notifications`), {
            title: `New Maintenance Bill Generated (${formData.month})`,
            body: `Bill #${billNo} for ₹${totalAmount} has been generated. Due Date: ${formData.dueDate}`,
            createdAt: timestampStr,
            isRead: false,
            type: 'billing'
          });

          count++;
        }

        await batch.commit();
        alert(`Successfully generated maintenance bills for ${count} residents.`);
      }

      setIsSubmitting(false);
      setIsGenerateModalOpen(false);
    } catch (e) {
      setIsSubmitting(false);
      alert('Error generating bills: ' + e.message);
    }
  };

  // Mark Payment Settlement (Razorpay / Cash / Cheque)
  const handleSettlePayment = async (e) => {
    e.preventDefault();
    if (!paymentModalBill) return;

    try {
      const txnId = paymentData.transactionId.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const timestampStr = new Date().toISOString();

      await updateDoc(doc(db, `societies/${societyId}/maintenance_bills`, paymentModalBill.id), {
        status: 'paid',
        paymentMethod: paymentData.method,
        transactionId: txnId,
        paymentDate: timestampStr,
        paymentNotes: paymentData.notes
      });

      // Dispatch resident notification
      if (paymentModalBill.residentUid) {
        await addDoc(collection(db, `societies/${societyId}/users/${paymentModalBill.residentUid}/notifications`), {
          title: `Payment Received & Verified!`,
          body: `Payment of ₹${paymentModalBill.amount} for Bill #${paymentModalBill.billNumber || paymentModalBill.id.substring(0,7)} has been settled via ${paymentData.method}. Txn: ${txnId}`,
          createdAt: timestampStr,
          isRead: false,
          type: 'billing'
        });
      }

      alert(`Payment settled successfully! Transaction ID: ${txnId}`);
      setPaymentModalBill(null);
      setPaymentData({ method: 'Razorpay', transactionId: '', notes: 'Online settlement verified' });
    } catch (e) {
      alert('Error settling payment: ' + e.message);
    }
  };

  // Print Invoice PDF Trigger
  const handlePrintInvoice = () => {
    window.print();
  };

  // Filter Logic
  const filteredBills = bills.filter(b => {
    const q = searchQuery.toLowerCase();
    const billNo = (b.billNumber || b.id || '').toLowerCase().includes(q);
    const residentName = (b.residentName || '').toLowerCase().includes(q);
    const flatNo = (b.flatNumber || '').toLowerCase().includes(q);
    const txnId = (b.transactionId || '').toLowerCase().includes(q);

    const matchesSearch = billNo || residentName || flatNo || txnId;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesMethod = methodFilter === 'All' || (b.paymentMethod || 'Razorpay') === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate Financial Summary Statistics
  const totalBillsCount = bills.length;
  const totalGeneratedAmount = bills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const paidBills = bills.filter(b => b.status === 'paid');
  const pendingBills = bills.filter(b => b.status === 'pending');
  const overdueBills = bills.filter(b => b.status === 'overdue' || (b.status === 'pending' && new Date(b.dueDate) < new Date()));

  const totalCollectedAmount = paidBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingAmount = pendingBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const overdueAmount = overdueBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="skeleton-loader" style={{ height: '120px', borderRadius: '12px', marginBottom: '24px' }}></div>
        <div className="skeleton-loader" style={{ height: '300px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. Dynamic Financial Summary Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <CreditCard size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Total Generated</p>
            <h3>₹{(totalGeneratedAmount / 1000).toFixed(1)}k</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{totalBillsCount} Bills Issued</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <DollarSign size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Total Collected</p>
            <h3>₹{(totalCollectedAmount / 1000).toFixed(1)}k</h3>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>{paidBills.length} Settled Bills</span>
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

      {/* 2. Search & Multi-Filter Control Panel */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by Bill No, Resident, Flat, Txn ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="var(--text-secondary)" />
              <select 
                className="form-select" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="All">Status: All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid / Settled</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <select 
              className="form-select" 
              value={methodFilter} 
              onChange={(e) => setMethodFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
            >
              <option value="All">Method: All</option>
              <option value="Razorpay">Razorpay Online</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Issue Bill Action */}
          <button 
            className="btn btn-primary" 
            onClick={() => setIsGenerateModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Generate Maintenance Bill
          </button>

        </div>
      </div>

      {/* 3. Maintenance Bills Register Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Maintenance Register</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing {filteredBills.length} of {bills.length} bills
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Resident & Flat</th>
                <th>Period</th>
                <th>Breakdown Total</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <CreditCard size={36} color="var(--border-color)" style={{ marginBottom: '8px' }} />
                    <div style={{ fontWeight: 600 }}>No maintenance bills match your search criteria.</div>
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => {
                  const isPaid = b.status === 'paid';
                  const isOverdue = b.status === 'overdue' || (!isPaid && new Date(b.dueDate) < new Date());

                  return (
                    <tr key={b.id}>
                      <td>
                        <code style={{ background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 800 }}>
                          {b.billNumber || `INV-${b.id.substring(0, 6)}`}
                        </code>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{b.residentName || 'Resident'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Flat {b.flatNumber || 'N/A'} {b.block ? `(Block ${b.block})` : ''}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{b.month || 'July 2026'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{b.amount}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          Maint: ₹{b.maintenanceCharge || b.amount}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', color: isOverdue ? 'var(--danger)' : 'var(--text-primary)', fontWeight: isOverdue ? 700 : 500 }}>
                          {b.dueDate}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${isPaid ? 'success' : isOverdue ? 'danger' : 'warning'}`}>
                          {isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {!isPaid ? (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => setPaymentModalBill(b)}
                            >
                              <ShieldCheck size={13} /> Settle Payment
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle size={13} /> Settled
                            </span>
                          )}

                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => setSelectedInvoice(b)}
                          >
                            <FileText size={13} /> Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Generate Maintenance Bill Modal */}
      {isGenerateModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }}>
            <div className="card-header">
              <h3 className="card-title">Generate Maintenance Bill</h3>
              <button className="btn-icon" onClick={() => setIsGenerateModalOpen(false)}><XCircle size={20} /></button>
            </div>

            <form onSubmit={handleGenerateBills} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              
              {/* Billing Scope Selector */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  BILLING SCOPE
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ flex: 1, padding: '10px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <input type="radio" name="scope" value="bulk" checked={billingScope === 'bulk'} onChange={() => setBillingScope('bulk')} />
                    Bulk Society (All Residents)
                  </label>
                  <label style={{ flex: 1, padding: '10px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <input type="radio" name="scope" value="single" checked={billingScope === 'single'} onChange={() => setBillingScope('single')} />
                    Single Specific Flat
                  </label>
                </div>
              </div>

              {billingScope === 'single' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Select Resident</label>
                  <select 
                    className="form-select"
                    value={selectedResidentUid}
                    onChange={(e) => setSelectedResidentUid(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13px' }}
                    required
                  >
                    <option value="">Select Resident & Flat...</option>
                    {residents.map(r => (
                      <option key={r.uid} value={r.uid}>{r.name} — Flat {r.flatNumber || 'N/A'}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Billing Cycle / Month</label>
                  <input required type="text" className="form-input" value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Due Date</label>
                  <input required type="date" className="form-input" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                </div>
              </div>

              {/* Itemized Charge Breakdown Inputs */}
              <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px' }}>ITEMIZED CHARGES BREAKDOWN (₹)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Maintenance Fee</label>
                    <input type="number" value={formData.maintenanceCharge} onChange={e => setFormData({ ...formData, maintenanceCharge: e.target.value })} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Parking Charge</label>
                    <input type="number" value={formData.parkingCharge} onChange={e => setFormData({ ...formData, parkingCharge: e.target.value })} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Water Charges</label>
                    <input type="number" value={formData.waterCharge} onChange={e => setFormData({ ...formData, waterCharge: e.target.value })} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sinking Fund</label>
                    <input type="number" value={formData.sinkingFund} onChange={e => setFormData({ ...formData, sinkingFund: e.target.value })} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>Total Calculated Bill Amount:</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>₹{calculateTotal(formData)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsGenerateModalOpen(false)} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Generating...' : billingScope === 'bulk' ? 'Generate Bulk Society Bills' : 'Generate Single Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Payment Settlement Modal (Razorpay / Cash) */}
      {paymentModalBill && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px', borderRadius: '16px' }}>
            <div className="card-header">
              <h3 className="card-title">Settle Maintenance Payment</h3>
              <button className="btn-icon" onClick={() => setPaymentModalBill(null)}><XCircle size={20} /></button>
            </div>

            <form onSubmit={handleSettlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div style={{ background: 'var(--primary-light)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>Settling Bill #{paymentModalBill.billNumber || paymentModalBill.id.substring(0,7)}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>₹{paymentModalBill.amount}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Resident: {paymentModalBill.residentName} (Flat {paymentModalBill.flatNumber})</div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Payment Gateway / Method</label>
                <select 
                  className="form-select"
                  value={paymentData.method}
                  onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value="Razorpay">Razorpay Online Gateway</option>
                  <option value="Cash">Cash at Society Office</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Transaction / Receipt ID</label>
                <input 
                  type="text" 
                  placeholder="Enter Razorpay Txn ID or Receipt No..." 
                  value={paymentData.transactionId} 
                  onChange={e => setPaymentData({ ...paymentData, transactionId: e.target.value })} 
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setPaymentModalBill(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#10B981', borderColor: '#10B981' }}>
                  Verify & Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Printable Professional Invoice Modal */}
      {selectedInvoice && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '640px', borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            
            <div style={{ padding: '16px 24px', background: '#0F172A', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700 }}>
                <FileText size={18} color="#38BDF8" /> Official Maintenance Invoice Receipt
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', padding: '4px 10px', fontSize: '12px' }} onClick={handlePrintInvoice}>
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }} onClick={() => setSelectedInvoice(null)}>
                  <XCircle size={22} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div id="printable-invoice" style={{ padding: '28px', backgroundColor: '#ffffff' }}>
              
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0F172A' }}>{session?.societyName || 'Housing Society'}</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>Registered Multi-Tenant Operations Hub</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>SOCIETY CODE: {societyId}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563EB' }}>INVOICE</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>#{selectedInvoice.billNumber || selectedInvoice.id.substring(0,8)}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Date: {selectedInvoice.createdAt ? new Date(selectedInvoice.createdAt).toLocaleDateString() : 'Today'}</div>
                </div>
              </div>

              {/* Billed To */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Billed To Resident</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{selectedInvoice.residentName}</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>Flat {selectedInvoice.flatNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Billing Cycle</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{selectedInvoice.month || 'July 2026'}</div>
                  <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>Due Date: {selectedInvoice.dueDate}</div>
                </div>
              </div>

              {/* Itemized Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #CBD5E1', textAlign: 'left', color: '#64748B', fontSize: '11px' }}>
                    <th style={{ padding: '8px 0' }}>DESCRIPTION</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>AMOUNT (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '8px 0' }}>Monthly Maintenance Fee</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹{selectedInvoice.maintenanceCharge || selectedInvoice.amount}</td>
                  </tr>
                  {selectedInvoice.parkingCharge > 0 && (
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '8px 0' }}>Parking Slot Charge</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹{selectedInvoice.parkingCharge}</td>
                    </tr>
                  )}
                  {selectedInvoice.waterCharge > 0 && (
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '8px 0' }}>Water Supply Charge</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹{selectedInvoice.waterCharge}</td>
                    </tr>
                  )}
                  {selectedInvoice.sinkingFund > 0 && (
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '8px 0' }}>Sinking Fund</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹{selectedInvoice.sinkingFund}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Total & Payment Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '2px solid #0F172A' }}>
                <div>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 800,
                    backgroundColor: selectedInvoice.status === 'paid' ? '#DCFCE7' : '#FEF3C7',
                    color: selectedInvoice.status === 'paid' ? '#15803D' : '#D97706'
                  }}>
                    {selectedInvoice.status === 'paid' ? 'PAID & VERIFIED' : 'PAYMENT PENDING'}
                  </span>
                  {selectedInvoice.transactionId && (
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                      Txn: {selectedInvoice.transactionId} ({selectedInvoice.paymentMethod || 'Razorpay'})
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>TOTAL AMOUNT DUE</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>₹{selectedInvoice.amount}</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
