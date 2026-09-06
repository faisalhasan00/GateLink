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

  const getCurrentMonthYear = () => {
    const d = new Date();
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentModalBill, setPaymentModalBill] = useState(null);

  const [billingScope, setBillingScope] = useState('single');
  const [selectedResidentUid, setSelectedResidentUid] = useState('');
  const [formData, setFormData] = useState({
    title: 'Monthly Maintenance & Society Facilities',
    month: getCurrentMonthYear(),
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

  // Filter residents so only genuine residents (with real flat numbers and not staff/guards) are billed
  const validBillingResidents = residents.filter((r) => {
    const role = (r.role || '').toLowerCase();
    const flat = (r.flatNumber || r.flatNo || '').trim();
    if (!flat || flat === 'N/A') return false;
    if (['guard', 'security', 'staff', 'manager', 'admin', 'super_admin'].includes(role)) return false;
    return true;
  });

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

      if (billingScope === 'all') {
        if (validBillingResidents.length === 0) {
          alert('No valid residential flats found to generate bills for.');
          setIsSubmitting(false);
          return;
        }

        let createdCount = 0;
        for (const res of validBillingResidents) {
          const invoiceNo = `INV/2026-27/${Math.floor(1000 + Math.random() * 9000)}`;
          await societyAdminService.createMaintenanceBill(societyId, {
            billNumber: invoiceNo,
            invoiceNumber: invoiceNo,
            title: formData.title,
            month: formData.month,
            dueDate: formData.dueDate,
            maintenanceCharge: Number(formData.maintenanceCharge),
            parkingCharge: Number(formData.parkingCharge),
            waterCharge: Number(formData.waterCharge),
            sinkingFund: Number(formData.sinkingFund),
            penaltyFee: Number(formData.penaltyFee || 0),
            amount: totalAmount,
            residentUid: res.id || res.uid,
            residentName: res.name || res.fullName || 'Resident',
            flatNumber: res.flatNumber || res.flatNo || 'N/A',
          });
          createdCount++;
        }

        alert(`Successfully generated maintenance bills for ${createdCount} flat(s).`);
      } else {
        const resObj = validBillingResidents.find((r) => r.id === selectedResidentUid || r.uid === selectedResidentUid);
        if (!resObj || !resObj.flatNumber || resObj.flatNumber === 'N/A') {
          alert('Please select a valid resident with an assigned flat number.');
          setIsSubmitting(false);
          return;
        }
        const invoiceNo = `INV/2026-27/${Math.floor(1000 + Math.random() * 9000)}`;

        await societyAdminService.createMaintenanceBill(societyId, {
          billNumber: invoiceNo,
          invoiceNumber: invoiceNo,
          title: formData.title,
          month: formData.month,
          dueDate: formData.dueDate,
          maintenanceCharge: Number(formData.maintenanceCharge),
          parkingCharge: Number(formData.parkingCharge),
          waterCharge: Number(formData.waterCharge),
          sinkingFund: Number(formData.sinkingFund),
          penaltyFee: Number(formData.penaltyFee || 0),
          amount: totalAmount,
          residentUid: selectedResidentUid,
          residentName: resObj.name || resObj.fullName || 'Resident',
          flatNumber: resObj.flatNumber || resObj.flatNo,
        });

        alert(`Successfully generated maintenance bill #${invoiceNo} for Flat ${resObj.flatNumber || resObj.flatNo}.`);
      }

      setIsSubmitting(false);
      setIsGenerateModalOpen(false);
    } catch (e) {
      setIsSubmitting(false);
      alert('Error generating bill: ' + e.message);
    }
  };

  const handleDeleteBill = async (bill) => {
    if (!window.confirm(`Are you sure you want to permanently delete / void bill #${bill.billNumber || bill.id} (Flat: ${bill.flatNumber || 'N/A'})?`)) {
      return;
    }
    try {
      await societyAdminService.deleteMaintenanceBill(societyId, bill.id);
      alert('Maintenance bill deleted successfully.');
    } catch (e) {
      alert('Error deleting bill: ' + e.message);
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
    handleDeleteBill,
    handleSettlePayment,
    handleApproveVerification,
    handleRejectVerification,
    validBillingResidents,
    filteredBills,
    totalGeneratedAmount,
    totalCollectedAmount,
    pendingAmount,
    overdueAmount,
    paidBills,
    pendingBills,
    overdueBills,
    pendingVerifications,
    session,
    societyId
  };
}
