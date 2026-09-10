import React, { useState } from 'react';
import { Sparkles, Check, Plus, Minus, ArrowRight, ShieldCheck, Sun, RefreshCw, CalendarCheck, Zap, Scale } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';
import { BAZAAR_PRODUCTS, BAZAAR_CATEGORIES } from '../data/quickCommerceData';

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

// Available weight/volume variants for different product types
const UNIT_VARIANTS = {
  'milk-dairy': [
    { label: '500 ml', multiplier: 0.55 },
    { label: '1 Litre', multiplier: 1 },
    { label: '1.5 Litres', multiplier: 1.45 },
    { label: '2 Litres', multiplier: 1.9 }
  ],
  'eggs': [
    { label: '6 Eggs', multiplier: 1 },
    { label: '12 Eggs', multiplier: 1.9 },
    { label: '24 Eggs (Tray)', multiplier: 3.6 }
  ],
  'vegetables': [
    { label: '500 g', multiplier: 0.55 },
    { label: '1 kg', multiplier: 1 },
    { label: '1.5 kg', multiplier: 1.45 },
    { label: '2 kg', multiplier: 1.85 }
  ],
  'honey-ghee': [
    { label: '250 g', multiplier: 0.55 },
    { label: '500 g / 500ml', multiplier: 1 },
    { label: '1 kg / 1 Litre', multiplier: 1.9 }
  ],
  'achar': [
    { label: '200 g (Small)', multiplier: 0.6 },
    { label: '400 g (Standard)', multiplier: 1 },
    { label: '1 kg (Family Jar)', multiplier: 2.2 }
  ],
  'papad': [
    { label: '200 g (1 Pack)', multiplier: 1 },
    { label: '500 g (Combo)', multiplier: 2.2 },
    { label: '1 kg (Bulk)', multiplier: 4.0 }
  ]
};

export default function BazaarDailyPassBuilder() {
  const { addToCart, setIsCartOpen, selectedSlot } = useBazaarCart();
  const [selectedPass, setSelectedPass] = useState('pass-30');
  const [activeFilter, setActiveFilter] = useState('all');

  // Available in-stock products
  const availableProducts = BAZAAR_PRODUCTS.filter(p => p.inStock !== false);

  // Selected Unit Variant state for each product (e.g., '1 Litre', '2 kg', '12 Eggs')
  const [selectedVariants, setSelectedVariants] = useState(() => {
    const init = {};
    availableProducts.forEach(p => {
      const variants = UNIT_VARIANTS[p.category] || UNIT_VARIANTS['vegetables'];
      init[p.id] = variants[1]?.label || variants[0]?.label || p.unit;
    });
    return init;
  });

  // Selected quantities for each product
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    availableProducts.forEach(p => {
      if (p.id === 'milk-01') initial[p.id] = 1;
      else if (p.id === 'egg-01') initial[p.id] = 1;
      else if (p.id === 'veg-01') initial[p.id] = 1;
      else initial[p.id] = 0;
    });
    return initial;
  });

  const activePass = PASS_TIERS.find(p => p.id === selectedPass) || PASS_TIERS[2];
  const daysCount = parseInt(activePass.duration);

  const handleVariantChange = (productId, variantLabel) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantLabel
    }));
  };

  const handleQtyChange = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Helper to compute unit-adjusted price
  const getItemPrice = (product) => {
    const variants = UNIT_VARIANTS[product.category] || UNIT_VARIANTS['vegetables'];
    const currentVariantLabel = selectedVariants[product.id];
    const variantObj = variants.find(v => v.label === currentVariantLabel) || variants[0];
    return Math.round(product.price * (variantObj?.multiplier || 1));
  };

  // Filter products for the pass builder
  const displayedProducts = availableProducts.filter(p => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  // Calculate daily price
  const rawDailyTotal = availableProducts.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    const price = getItemPrice(item);
    return sum + (price * qty);
  }, 0);

  const discountedDailyTotal = Math.round(rawDailyTotal * (1 - activePass.discountPercent / 100));
  const passGrandTotal = discountedDailyTotal * daysCount;
  const originalGrandTotal = rawDailyTotal * daysCount;
  const totalPassSavings = originalGrandTotal - passGrandTotal;

  // Selected item summaries with custom Litres / Kg / Units
  const selectedItemsSummary = availableProducts
    .filter(item => (quantities[item.id] || 0) > 0)
    .map(item => `${item.name} (${selectedVariants[item.id]} × ${quantities[item.id]})`);

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
      description: `Includes: ${selectedItemsSummary.join(', ')}. Delivered daily between ${selectedSlot}. Pause, swap or modify anytime.`,
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
            Customize exact <strong>Litres (Milk / Oil), Kilograms (Vegetables / Achar / Ghee), or Quantities</strong>. Get your custom basket delivered fresh at your flat door every morning in your preferred slot with VIP pass discounts.
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

        {/* Step 2: Customize Available Products & Litre / Kg Options */}
        <div className="qc-pass-step-block">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
            <div className="qc-step-label" style={{ margin: 0 }}>
              <span>STEP 2</span> Customize Litres, Kg &amp; Quantity for Available Products:
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`qc-pass-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All ({availableProducts.length})
              </button>
              {BAZAAR_CATEGORIES.filter(c => c.id !== 'all' && c.id !== 'daily-pass').map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`qc-pass-filter-pill ${activeFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="qc-customize-items-grid">
            {displayedProducts.map((item) => {
              const qty = quantities[item.id] || 0;
              const isIncluded = qty > 0;
              const variants = UNIT_VARIANTS[item.category] || UNIT_VARIANTS['vegetables'];
              const currentVariant = selectedVariants[item.id] || variants[0]?.label;
              const unitAdjustedPrice = getItemPrice(item);

              return (
                <div key={item.id} className={`qc-custom-item-card ${isIncluded ? 'active' : ''}`}>
                  <div className="qc-pass-item-img-wrap">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="qc-pass-item-img" 
                      loading="lazy"
                    />
                    {isIncluded && (
                      <span className="qc-pass-item-selected-badge">
                        {currentVariant} × {qty}
                      </span>
                    )}
                  </div>

                  <h4 className="qc-item-name" title={item.name}>
                    {item.name}
                  </h4>

                  {/* Litre / Kg / Unit Variant Selector */}
                  <div className="qc-variant-selector-wrap">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>
                      <Scale size={11} color="#059669" />
                      <span>Choose Size / Weight:</span>
                    </div>
                    <div className="qc-variant-chips">
                      {variants.map((v) => {
                        const isVarActive = currentVariant === v.label;
                        return (
                          <button
                            key={v.label}
                            type="button"
                            className={`qc-variant-chip ${isVarActive ? 'active' : ''}`}
                            onClick={() => handleVariantChange(item.id, v.label)}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="qc-item-price-unit">
                    ₹{unitAdjustedPrice} <small style={{ color: '#64748b', fontWeight: 600 }}>/ {currentVariant}</small>
                  </div>

                  <div className="qc-item-counter-row">
                    {qty === 0 ? (
                      <button
                        type="button"
                        className="qc-item-add-btn"
                        onClick={() => handleQtyChange(item.id, 1)}
                      >
                        <Plus size={14} />
                        <span>Add {currentVariant}</span>
                      </button>
                    ) : (
                      <div className="qc-qty-stepper" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <button type="button" className="qc-qty-btn" onClick={() => handleQtyChange(item.id, -1)}>
                          <Minus size={14} />
                        </button>
                        <span className="qc-qty-count">{qty} daily</span>
                        <button type="button" className="qc-qty-btn" onClick={() => handleQtyChange(item.id, 1)}>
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
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 8px', lineHeight: 1.4 }}>
              {selectedItemsSummary.length > 0
                ? `Daily Basket: ${selectedItemsSummary.join(' + ')}`
                : 'Select available products above to build your daily pass'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#64748b' }}>
              <span>🌅 Delivery: <strong>Tomorrow {selectedSlot}</strong></span>
              <span>🛡️ <strong>Pause / Modify Anytime</strong></span>
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
