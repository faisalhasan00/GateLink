import React, { useState } from 'react';
import { X, Check, Building2, Sun } from 'lucide-react';
import { useBazaarCart, MORNING_DELIVERY_SLOTS } from '../context/BazaarCartContext';

const POPULAR_SOCIETIES = [
  { society: 'My Home Bhooja', locality: 'Hitec City, Hyderabad' },
  { society: 'Aparna Serene Park', locality: 'Gachibowli, Hyderabad' },
  { society: 'Jayabheri Silicon County', locality: 'Hitec City, Hyderabad' },
  { society: 'Rainbow Vistas Rock Garden', locality: 'Moosapet, Hyderabad' },
  { society: 'My Home Avatar', locality: 'Puppalguda, Narsingi' },
  { society: 'L&T Serene County', locality: 'Gachibowli, Hyderabad' }
];

export default function BazaarSocietyFlatModal({ isOpen, onClose }) {
  const { 
    selectedSocietyFlat, 
    setSelectedSocietyFlat, 
    selectedSlot, 
    setSelectedSlot 
  } = useBazaarCart();

  const [society, setSociety] = useState(selectedSocietyFlat.society);
  const [tower, setTower] = useState(selectedSocietyFlat.tower);
  const [flat, setFlat] = useState(selectedSocietyFlat.flat);
  const [slot, setSlot] = useState(selectedSlot);

  if (!isOpen) return null;

  const handleSave = () => {
    const selected = POPULAR_SOCIETIES.find(s => s.society === society) || {
      society,
      locality: 'Hyderabad'
    };

    setSelectedSocietyFlat({
      society: selected.society,
      locality: selected.locality,
      tower: tower || 'Tower 1',
      flat: flat || 'Flat 101',
      deliveryTime: `Tomorrow ${slot}`
    });
    setSelectedSlot(slot);
    onClose();
  };

  return (
    <div className="qc-modal-overlay" onClick={onClose}>
      <div className="qc-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#ecfdf5', color: '#059669', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Building2 size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
              Delivery Address & Slot
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Morning Slot Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Sun size={15} color="#d97706" fill="#f59e0b" />
            <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
              Morning Slot (5 AM - 9 AM)
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {MORNING_DELIVERY_SLOTS.map((s) => {
              const isSelected = slot === s.label;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlot(s.label)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #0c831f' : '1px solid #cbd5e1',
                    background: isSelected ? '#ecfdf5' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: isSelected ? '#065f46' : '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{s.label}</span>
                  {isSelected && <Check size={14} color="#0c831f" />}
                </button>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700 }}>
          Select Gated Society:
        </p>

        {/* Quick Society Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '140px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '4px' }}>
          {POPULAR_SOCIETIES.map((s) => {
            const isSelected = society === s.society;
            return (
              <div
                key={s.society}
                onClick={() => setSociety(s.society)}
                style={{
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #0c831f' : '1px solid #e2e8f0',
                  background: isSelected ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#065f46' : '#1e293b' }}>
                    {s.society}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {s.locality}
                  </div>
                </div>
                {isSelected && <Check size={16} color="#0c831f" />}
              </div>
            );
          })}
        </div>

        {/* Tower and Flat inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              Tower / Block
            </label>
            <input
              type="text"
              value={tower}
              onChange={(e) => setTower(e.target.value)}
              placeholder="e.g. Tower 4"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              Flat / Unit No.
            </label>
            <input
              type="text"
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              placeholder="e.g. Flat 1204"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{ width: '100%', background: '#0c831f', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '0.85rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(12, 131, 31, 0.3)' }}
        >
          Confirm Flat & Morning Slot
        </button>
      </div>
    </div>
  );
}
