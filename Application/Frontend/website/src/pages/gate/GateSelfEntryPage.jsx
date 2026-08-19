import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, ShieldCheck, CheckCircle2, Clock, Phone, User, MapPin, AlertCircle, ArrowRight, Sparkles
} from 'lucide-react';
import { doc, getDoc, addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function GateSelfEntryPage() {
  const [searchParams] = useSearchParams();
  const socId = searchParams.get('soc') || 'SOC-001';
  const gateName = searchParams.get('gate') || 'Main Gate 1';

  const [societyInfo, setSocietyInfo] = useState({ name: 'Housing Society', address: 'Gated Township' });
  const [loadingSoc, setLoadingSoc] = useState(true);
  
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [visitorType, setVisitorType] = useState('Delivery'); // Delivery, Cab, Guest, Service
  const [companyName, setCompanyName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState(null);
  const [requestStatus, setRequestStatus] = useState('pending'); // pending, approved, denied

  // Fetch Society info on mount
  useEffect(() => {
    async function fetchSociety() {
      try {
        const snap = await getDoc(doc(db, 'societies', socId));
        if (snap.exists()) {
          setSocietyInfo(snap.data());
        }
      } catch (err) {
        console.warn('Could not fetch society metadata:', err);
      } finally {
        setLoadingSoc(false);
      }
    }
    fetchSociety();
  }, [socId]);

  // Listen to submitted request for live approval status
  useEffect(() => {
    if (!submittedRequestId) return;
    const unsub = onSnapshot(doc(db, 'societies', socId, 'visitor_logs', submittedRequestId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status) {
          setRequestStatus(data.status);
        }
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
      alert('Failed to submit entry request. Please notify security guard.');
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
      {/* Header Badge */}
      <div style={{
        maxWidth: '460px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'spaceBetween',
          gap: '12px',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #0EA5E9 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(14, 165, 233, 0.25)',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <ShieldCheck size={26} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#BAE6FD' }}>
              GateLink Self Check-in
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0', color: '#FFFFFF' }}>
              {societyInfo.name}
            </h1>
            <div style={{ fontSize: '12px', color: '#E0F2FE', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} /> {gateName}
            </div>
          </div>
        </div>

        {/* Live Status Container */}
        {submittedRequestId ? (
          <div style={{
            background: '#1E293B',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #334155',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            {requestStatus === 'pending' && (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Clock size={32} color="#F59E0B" className="animate-spin" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 8px' }}>
                  Entry Request Sent!
                </h2>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 20px' }}>
                  Awaiting resident approval for <strong>Flat {flatNumber}</strong>. Please show your phone to the Security Guard.
                </p>
                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#0F172A',
                  border: '1px border #334155',
                  fontSize: '13px',
                  color: '#CBD5E1'
                }}>
                  Visitor: <strong>{visitorName}</strong> ({visitorType})
                </div>
              </>
            )}

            {requestStatus === 'approved' && (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <CheckCircle2 size={36} color="#10B981" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#10B981', margin: '0 0 8px' }}>
                  Gate Entry Approved!
                </h2>
                <p style={{ fontSize: '14px', color: '#CBD5E1', margin: '0 0 20px' }}>
                  You are cleared to proceed to <strong>Flat {flatNumber}</strong>. Have a great visit!
                </p>
              </>
            )}

            {requestStatus === 'denied' && (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <AlertCircle size={36} color="#EF4444" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#EF4444', margin: '0 0 8px' }}>
                  Entry Request Declined
                </h2>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 20px' }}>
                  Resident at Flat {flatNumber} declined entry. Please speak with Security Guard.
                </p>
              </>
            )}
          </div>
        ) : (
          /* Form Card */
          <form onSubmit={handleSubmit} style={{
            background: '#1E293B',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Visiting Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {['Delivery', 'Cab', 'Guest', 'Service'].map((type) => {
                  const isSel = visitorType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVisitorType(type)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSel ? '2px solid #0EA5E9' : '1px solid #334155',
                        backgroundColor: isSel ? 'rgba(14, 165, 233, 0.15)' : '#0F172A',
                        color: isSel ? '#38BDF8' : '#94A3B8',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Flat / Wing Number *
              </label>
              <input
                type="text"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                placeholder="e.g. A-402 or B-101"
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  fontSize: '15px',
                  fontWeight: 800
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Your Full Name *
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="e.g. Amit Sharma"
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  fontSize: '14px',
                  fontWeight: 700
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Your Mobile Number *
              </label>
              <input
                type="tel"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  fontSize: '14px',
                  fontWeight: 700
                }}
              />
            </div>

            {visitorType === 'Delivery' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Zomato, Swiggy, Amazon, Blinkit"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #1E3A8A 100%)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 900,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px',
                boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)'
              }}
            >
              {submitting ? 'Sending Entry Request...' : 'Request Gate Entry Now'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', margin: '24px 0 0', fontSize: '11px', color: '#64748B' }}>
          Powered by <strong>GateLink Gatekeeper OS</strong> • Verified Resident Security
        </div>
      </div>
    </div>
  );
}
