import React, { useState, useEffect } from 'react';
import { Search, X, Users, UserCheck, ShieldAlert, FileText, Wrench, Megaphone, Truck, Shield, Building2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = async (val) => {
    setQuery(val);
    if (!val.trim() || val.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const q = val.toLowerCase().trim();
    const searchResults = [];

    try {
      // 1. Search Public Gated Communities & Societies
      const snapSocieties = await getDocs(collection(db, 'societies'));
      snapSocieties.forEach(d => {
        const s = d.data();
        if ((s.name || '').toLowerCase().includes(q) || (s.code || d.id).toLowerCase().includes(q) || (s.city || '').toLowerCase().includes(q)) {
          searchResults.push({
            id: d.id,
            title: s.name || 'Society',
            subtitle: `${s.city || 'Gated Community'} • Code: ${s.code || d.id}`,
            type: 'Society',
            path: '/contact',
            icon: <Building2 size={16} color="var(--primary)" />
          });
        }
      });

      setResults(searchResults.slice(0, 10));
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 2000,
      display: 'flex', justifyContent: 'center', paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px'
    }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: '640px', maxHeight: '500px', borderRadius: '16px', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        
        {/* Search Header */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <Search size={20} color="var(--primary)" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search across Residents, Visitors, Complaints, Bills, Docs... (Press Esc to close)"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px', background: 'transparent', fontWeight: 600 }}
          />
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Search Results List */}
        <div style={{ padding: '12px', maxHeight: '420px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Searching society database...</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              {query.length < 2 ? 'Type at least 2 characters to search across GateLink.' : 'No matching results found.'}
            </div>
          ) : (
            results.map((r) => (
              <div 
                key={`${r.type}-${r.id}`}
                onClick={() => {
                  navigate(r.path);
                  onClose();
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  transition: 'background-color 0.2s',
                  backgroundColor: 'var(--bg-color)'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{r.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{r.subtitle}</div>
                </div>
                <span className="badge primary" style={{ fontSize: '10px' }}>{r.type}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
