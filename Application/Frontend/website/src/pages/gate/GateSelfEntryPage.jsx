import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import GateHeaderBadge from '../../features/gate/components/GateHeaderBadge';
import GateSelfEntryForm from '../../features/gate/components/GateSelfEntryForm';
import GateRequestStatusCard from '../../features/gate/components/GateRequestStatusCard';

export default function GateSelfEntryPage() {
  const [searchParams] = useSearchParams();
  const socId = searchParams.get('soc') || 'SOC-001';
  const gateName = searchParams.get('gate') || 'Main Gate 1';

  const [societyInfo, setSocietyInfo] = useState({ name: 'Housing Society', address: 'Gated Township' });
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [visitorType, setVisitorType] = useState('Delivery');
  const [companyName, setCompanyName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState(null);
  const [requestStatus, setRequestStatus] = useState('pending');

  useEffect(() => {
    async function fetchSociety() {
      try {
        const snap = await getDoc(doc(db, 'societies', socId));
        if (snap.exists()) setSocietyInfo(snap.data());
      } catch (err) {
        console.warn('Could not fetch society metadata:', err);
      }
    }
    fetchSociety();
  }, [socId]);

  useEffect(() => {
    if (!submittedRequestId) return;
    const unsub = onSnapshot(doc(db, 'societies', socId, 'visitor_logs', submittedRequestId), (docSnap) => {
      if (docSnap.exists() && docSnap.data().status) {
        setRequestStatus(docSnap.data().status);
      }
    });
    return () => unsub();
  }, [submittedRequestId, socId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim() || !flatNumber.trim()) {
      alert('Please fill Visitor Name, Phone Number, and Flat / Wing Number.');
      return;
    }

    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'societies', socId, 'visitor_logs'), {
        societyId: socId,
        gateName,
        visitorName: visitorName.trim(),
        visitorPhone: visitorPhone.trim(),
        flatNumber: flatNumber.trim().toUpperCase(),
        type: visitorType,
        companyName: companyName.trim() || visitorType,
        status: 'pending',
        entryMethod: 'SELF_QR_SCAN',
        createdAt: serverTimestamp(),
      });
      setSubmittedRequestId(docRef.id);
    } catch (err) {
      console.error('Failed to submit gate self-entry:', err);
      alert('Failed to submit entry request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      color: '#F8FAFC',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '460px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* 1. Header Badge */}
        <GateHeaderBadge societyName={societyInfo.name} gateName={gateName} />

        {/* 2. Form or Live Status Card */}
        {submittedRequestId ? (
          <GateRequestStatusCard
            requestStatus={requestStatus}
            flatNumber={flatNumber}
            visitorName={visitorName}
            visitorType={visitorType}
          />
        ) : (
          <GateSelfEntryForm
            visitorType={visitorType} setVisitorType={setVisitorType}
            flatNumber={flatNumber} setFlatNumber={setFlatNumber}
            visitorName={visitorName} setVisitorName={setVisitorName}
            visitorPhone={visitorPhone} setVisitorPhone={setVisitorPhone}
            companyName={companyName} setCompanyName={setCompanyName}
            submitting={submitting} onSubmit={handleSubmit}
          />
        )}

        <div style={{ textAlign: 'center', margin: '24px 0 0', fontSize: '11px', color: '#64748B' }}>
          Powered by <strong>GateLink Gatekeeper OS</strong> • Verified Resident Security
        </div>
      </div>
    </div>
  );
}
