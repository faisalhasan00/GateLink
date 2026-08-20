import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

export default function LiveVisitorCounter() {
  const [totalVisits, setTotalVisits] = useState(null);

  useEffect(() => {
    // 1. Session tracking - each new device or browser session logs +1 to Firestore cloud
    const logVisitorHit = async () => {
      try {
        const sessionKey = 'gatelink_visitor_logged';
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          await addDoc(collection(db, 'partner_leads'), {
            type: 'website_visitor_hit',
            timestamp: Date.now(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'web',
          });
        }
      } catch (err) {
        console.warn('Visitor hit logger:', err);
      }
    };

    logVisitorHit();

    // 2. Real-time dynamic Firestore listener across all devices globally
    const q = query(
      collection(db, 'partner_leads'),
      where('type', '==', 'website_visitor_hit')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setTotalVisits(snapshot.size);
      },
      (error) => {
        console.warn('Visitor listener notice:', error);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '999px',
        background: 'rgba(14, 165, 233, 0.08)',
        border: '1px solid rgba(14, 165, 233, 0.25)',
        fontSize: '11px',
        fontWeight: 600,
        color: '#CBD5E1',
        letterSpacing: '0.2px',
        whiteSpace: 'nowrap',
      }}
      title="Live verified website visits across all devices"
    >
      <Eye size={12} color="#0EA5E9" />
      <span style={{ color: '#94A3B8' }}>Total Visits:</span>
      <span style={{ color: '#38BDF8', fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
        {totalVisits !== null ? totalVisits.toLocaleString() : '...'}
      </span>
    </div>
  );
}
