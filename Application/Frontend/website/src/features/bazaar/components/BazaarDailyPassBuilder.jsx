import React, { useState } from 'react';
import { Sparkles, Check, Plus, Minus, ArrowRight, ShieldCheck, Sun, RefreshCw, CalendarCheck, Zap } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';

const PASS_TIERS = [
  {
    id: 'pass-7',
    name: '7-Day Fresh Pass',
    duration: '7 Days',
    discountPercent: 10,
    discountBadge: '10% OFF',
    tagline: 'Ideal for trial & weekly morning routine'
  },
  {
    id: 'pass-15',
    name: '15-Day Routine Pass',
    duration: '15 Days',
    discountPercent: 15,
    discountBadge: '15% OFF',
    popular: true,
    tagline: 'Best for regular society breakfast needs'
  },
  {
    id: 'pass-30',
    name: '30-Day VIP Society Pass',
    duration: '30 Days',
    discountPercent: 22,
    discountBadge: '22% OFF',
    tagline: 'Maximum savings • Zero delivery fee guaranteed'
  }
];

const CUSTOMIZABLE_ITEMS = [
  {
    id: 'c-milk',
    category: 'Dairy',
    name: 'A2 Gir Cow Milk (1L)',
    icon: '🥛',
    basePrice: 88,
    defaultQty: 1
  },
  {
    id: 'c-eggs',
    category: 'Eggs',
    name: 'Free-Range Desi Eggs (Pack of 6)',
    icon: '🥚',
    basePrice: 95,
    defaultQty: 1
  },
  {
    id: 'c-veg',
    category: 'Veggies',
    name: 'Daily Farm Fresh Vegetable Basket (1.5kg)',
    icon: '🥦',
    basePrice: 90,
    defaultQty: 1
  },
  {
    id: 'c-curd',
    category: 'Dairy',
    name: 'Thick Farm Set Curd (400g)',
    icon: '🥣',
    basePrice: 45,
    defaultQty: 0
  },
  {
    id: 'c-paneer',
    category: 'Dairy',
    name: 'Fresh Malai Paneer (200g)',
    icon: '🧀',
    basePrice: 110,
    defaultQty: 0
  },
  {
    id: 'c-honey',
    category: 'Artisanal',
    name: 'Raw Forest Honey (500g)',
    icon: '🍯',
    basePrice: 399,
    defaultQty: 0
  },
  {
    id: 'c-achar',
    category: 'Artisanal',
    name: "Dadi's Raw Mango Achar (400g)",
    icon: '🌶️',
    basePrice: 249,
    defaultQty: 0
  },
  {
    id: 'c-papad',
    category: 'Artisanal',
    name: 'Punjabi Urad Masala Papad (250g)',
    icon: '🍘',
    basePrice: 135,
    defaultQty: 0
  }
];

export default function BazaarDailyPassBuilder() {
  const { addToCart, setIsCartOpen, selectedSlot } = useBazaarCart();
  const [selectedPass, setSelectedPass] = useState('pass-30');
  const [quantities, setQuantities] = useState({
    'c-milk': 1,
    'c-eggs': 1,
    'c-veg': 1,
    'c-curd': 0,
    'c-paneer': 0,
    'c-honey': 0,
    'c-achar': 0,
    'c-papad': 0
  });

  const activePass = PASS_TIERS.find(p => p.id === selectedPass) || PASS_TIERS[2];
  const daysCount = parseInt(activePass.duration);

  const handleQtyChange = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Calculate daily price
  const rawDailyTotal = CUSTOMIZABLE_ITEMS.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + (item.basePrice * qty);
  }, 0);

  const discountedDailyTotal = Math.round(rawDailyTotal * (1 - activePass.discountPercent / 100));
  const passGrandTotal = discountedDailyTotal * daysCount;
  const originalGrandTotal = rawDailyTotal * daysCount;
  const totalPassSavings = originalGrandTotal - passGrandTotal;

  // Selected item summaries
  const selectedItemsSummary = CUSTOMIZABLE_ITEMS
    .filter(item => (quantities[item.id] || 0) > 0)
    .map(item => `${item.name} (${quantities[item.id]}x)`);

  const handleActivatePass = () => {
    if (rawDailyTotal === 0) return;

    const passCartItem = {
      id: `pass-${activePass.id}-${Date.now()}`,
      name: `GateLink Society ${activePass.name}`,
      category: 'pass',
      unit: `${activePass.duration} • Custom Morning Basket`,
      price: passGrandTotal,
      mrp: originalGrandTotal,
      discount: `${activePass.discountBadge} (Saved ₹${totalPassSavings})`,
      deliveryTime: `🌅 Daily ${selectedSlot}`,
      source: 'Society Priority Doorstep Pass',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      description: `Includes: ${selectedItemsSummary.join(', ')}. Delivered daily between ${selectedSlot}. Pause or modify anytime.`,
      quantity: 1
    };

    addToCart(passCartItem);
    setIsCartOpen(true);
  };

  return (
    <section className="qc-pass-section" id="daily-society-pass">
      <div className="qc-pass-card">
        {/* Pass Header */}
        <div className="qc-pass-header">
          <div className="qc-pass-badge">
            <Sparkles size={14} color="#0c831f" />
            <span>CUSTOMIZABLE SOCIETY MORNING PASS</span>
          </div>
          <h2 className="qc-pass-title">
            Build Your Custom Daily Society Pass
          </h2>
          <p className="qc-pass-subtitle">
            Choose your daily essentials (fresh milk, farm eggs, daily vegetables, achar &amp; papad). Get everything delivered fresh at your flat doorstep every morning before 6:30 AM with VIP pass discounts.
          </p>
        </div>

        {/* Step 1: Choose Pass Tier */}
        <div className="qc-pass-step-block">
          <div className="qc-step-label">
            <span>STEP 1</span> Select Pass Duration:
          </div>
          <div className="qc-pass-tiers-grid">
            {PASS_TIERS.map((tier) => {
              const isSelected = selectedPass === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`qc-pass-tier-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedPass(tier.id)}
                >
                  {tier.popular && (
                    <span className="qc-tier-popular">RECOMMENDED</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {tier.name}
                    </h4>
                    <span className="qc-tier-discount-tag">{tier.discountBadge}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem' }}>
                    {tier.tagline}
                  </p>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0c831f' }}>
                    ✓ Free Morning Doorstep Drop
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Customize Daily Items */}
        <div className="qc-pass-step-block">
          <div className="qc-step-label">
            <span>STEP 2</span> Customize What You Want in Your Daily Basket:
          </div>

          <div className="qc-customize-items-grid">
            {CUSTOMIZABLE_ITEMS.map((item) => {
              const qty = quantities[item.id] || 0;
              const isIncluded = qty > 0;
              return (
                <div key={item.id} className={`qc-custom-item-card ${isIncluded ? 'active' : ''}`}>
                  <div className="qc-item-card-top">
                    <span className="qc-item-icon">{item.icon}</span>
                    <span className="qc-item-cat">{item.category}</span>
                  </div>
                  <h4 className="qc-item-name">{item.name}</h4>
                  <div className="qc-item-price-unit">
                    ₹{item.basePrice} / delivery
                  </div>

                  <div className="qc-item-counter-row">
                    {qty === 0 ? (
                      <button
                        className="qc-item-add-btn"
                        onClick={() => handleQtyChange(item.id, 1)}
                      >
                        <Plus size={14} />
                        <span>Add to Pass</span>
                      </button>
                    ) : (
                      <div className="qc-qty-stepper" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <button className="qc-qty-btn" onClick={() => handleQtyChange(item.id, -1)}>
                          <Minus size={14} />
                        </button>
                        <span className="qc-qty-count">{qty} daily</span>
                        <button className="qc-qty-btn" onClick={() => handleQtyChange(item.id, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Pass Summary & Action Bar */}
        <div className="qc-pass-summary-card">
          <div className="qc-summary-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CalendarCheck size={20} color="#0c831f" />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {activePass.name} Summary
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 8px' }}>
              {selectedItemsSummary.length > 0
                ? `Daily Basket: ${selectedItemsSummary.join(' + ')}`
                : 'Select items above to add to your daily basket'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#64748b' }}>
              <span>🌅 Delivery: <strong>Tomorrow {selectedSlot}</strong></span>
              <span>🛡️ <strong>Pause / Resume Anytime</strong></span>
            </div>
          </div>

          <div className="qc-summary-right">
            <div className="qc-pass-pricing-block">
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                {activePass.duration} Total
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{passGrandTotal}
                </span>
                {totalPassSavings > 0 && (
                  <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{originalGrandTotal}
                  </span>
                )}
              </div>
              {totalPassSavings > 0 && (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>
                  🎉 You save ₹{totalPassSavings} ({activePass.discountBadge})
                </span>
              )}
            </div>

            <button
              className="qc-activate-pass-btn"
              onClick={handleActivatePass}
              disabled={rawDailyTotal === 0}
            >
              <span>Activate Morning Pass</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
