import { useState, useEffect } from 'react';
import { getSocietyAdminSession } from '../../../services/sessionManager';
import { societyAdminService } from '../../../services/societyAdminService';

export function useMaintenance() {
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
      const resObj = residents.find((r) => r.id === selectedResidentUid || r.uid === selectedResidentUid);
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
      alert('UTR submission rejected. Bill reverted to pending.');
    } catch (e) {
      alert('Error rejecting payment: ' + e.message);
    }
  };

  const filteredBills = bills.filter((b) => {
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
  const paidBills = bills.filter((b) => b.status === 'paid');
  const pendingBills = bills.filter((b) => b.status === 'pending');
  const overdueBills = bills.filter((b) => b.status === 'overdue' || (b.status === 'pending' && new Date(b.dueDate) < new Date()));
  const totalCollectedAmount = paidBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingAmount = pendingBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const overdueAmount = overdueBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingVerifications = bills.filter((b) => b.status === 'pending_verification');

  return {
    activeTab,
    setActiveTab,
    bills,
    residents,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    isGenerateModalOpen,
    setIsGenerateModalOpen,
    selectedInvoice,
    setSelectedInvoice,
    paymentModalBill,
    setPaymentModalBill,
    billingScope,
    setBillingScope,
    selectedResidentUid,
    setSelectedResidentUid,
    formData,
    setFormData,
    paymentData,
    setPaymentData,
    isSubmitting,
    calculateTotal,
    handleGenerateBills,
    handleSettlePayment,
    handleApproveVerification,
    handleRejectVerification,
    filteredBills,
    totalGeneratedAmount,
    totalCollectedAmount,
    pendingAmount,
    overdueAmount,
    paidBills,
    pendingBills,
    overdueBills,
    pendingVerifications
  };
}
