import React, { useState } from 'react';
import { 
  Sparkles, Check, Plus, Minus, ArrowRight, ShieldCheck, Sun, 
  RefreshCw, CalendarCheck, Zap, Scale, Search, X, Info, ChevronRight 
} from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';
import { BAZAAR_PRODUCTS, BAZAAR_CATEGORIES } from '../data/quickCommerceData';
import BazaarProductDetailModal from './BazaarProductDetailModal';

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
  const [passSearch, setPassSearch] = useState('');
  const [modalProduct, setModalProduct] = useState(null);

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
    const chosenVariantLabel = selectedVariants[product.id] || variants[0]?.label;
    const variantObj = variants.find(v => v.label === chosenVariantLabel) || variants[0];
    const multiplier = variantObj?.multiplier || 1;
    return Math.round(product.price * multiplier);
  };

  // Filter products by category and search query
  const filteredProducts = availableProducts.filter(item => {
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch = passSearch.trim() === '' || 
      item.name.toLowerCase().includes(passSearch.toLowerCase()) ||
      (item.source && item.source.toLowerCase().includes(passSearch.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(passSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const displayedProducts = filteredProducts;

  // Calculate daily basket subtotal
  const rawDailyTotal = availableProducts.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    const price = getItemPrice(item);
    return sum + (price * qty);
  }, 0);

  // Apply Pass Discount
  const discountedDailyTotal = Math.round(rawDailyTotal * (1 - activePass.discountPercent / 100));
  const passGrandTotal = discountedDailyTotal * daysCount;
  const originalGrandTotal = rawDailyTotal * daysCount;
  const totalPassSavings = originalGrandTotal - passGrandTotal;

  // Selected items summary string
  const selectedItemsSummary = availableProducts
    .filter(item => (quantities[item.id] || 0) > 0)
    .map(item => `${item.name} (${selectedVariants[item.id] || item.unit} × ${quantities[item.id]})`);

  const handleActivatePass = () => {
    if (rawDailyTotal === 0) return;

    const passItem = {
      id: `custom-pass-${activePass.id}-${Date.now()}`,
      name: `${activePass.name} (${activePass.duration} Morning Pass)`,
      category: 'daily-pass',
      unit: `${daysCount} Days Subscription (${selectedItemsSummary.length} Items Daily)`,
      price: passGrandTotal,
      mrp: originalGrandTotal,
      deliveryTime: `🌅 5 AM - 9 AM Slot (${selectedSlot})`,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      description: `Daily Morning Doorstep Delivery for ${activePass.duration}: ${selectedItemsSummary.join(', ')}`,
      isCustomPass: true,
      passDetails: {
        passTier: activePass.name,
        days: daysCount,
        discountPercent: activePass.discountPercent,
        items: selectedItemsSummary
      }
    };

    addToCart(passItem);
    setIsCartOpen(true);
  };

  return (
    <section id="bazaar-daily-pass" className="qc-pass-builder-section">
      <div className="qc-pass-builder-card">
        {/* Top Header Badge */}
        <div className="qc-pass-top-badge">
          <Sparkles size={14} />
          <span>SOCIETY EXCLUSIVE • ZERO DELIVERY FEE</span>
        </div>

        <div className="qc-pass-header">
          <div>
            <h3 className="qc-pass-title">
              Build Your Daily Society Morning Basket Pass
            </h3>
            <p className="qc-pass-subtitle">
              Choose your morning essentials, customize litres &amp; kilograms, and get farm-fresh deliveries to your flat door every morning between <strong>5:00 AM – 9:00 AM ({selectedSlot})</strong>. Pause or modify anytime.
            </p>
          </div>
        </div>

        {/* Step 1: Select Pass Duration */}
        <div className="qc-pass-step-block">
          <div className="qc-step-label">
            <span className="qc-step-num">1</span>
            <span>Choose Your Pass Duration &amp; Savings</span>
          </div>

          <div className="qc-pass-tiers-grid">
            {PASS_TIERS.map((tier) => {
              const isSelected = selectedPass === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`qc-pass-tier-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedPass(tier.id)}
                >
                  {tier.popular && <span className="qc-tier-pop-badge">MOST POPULAR</span>}
                  <div className="qc-tier-header">
                    <h4 className="qc-tier-name">{tier.name}</h4>
                    <span className="qc-tier-discount-badge">{tier.discountBadge}</span>
                  </div>
                  <div className="qc-tier-duration">{tier.duration} Auto Doorstep Delivery</div>
                  <p className="qc-tier-tagline">{tier.tagline}</p>
                  <div className="qc-tier-select-indicator">
                    {isSelected ? (
                      <span className="qc-selected-pill"><Check size={14} /> Selected</span>
                    ) : (
                      <span className="qc-unselected-pill">Select Pass</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Pick Available Products with Litre/Kg Customizer */}
        <div className="qc-pass-step-block">
          <div className="qc-step-label">
            <span className="qc-step-num">2</span>
            <span>Select Available Products &amp; Customize Units (Litres / Kgs)</span>
          </div>

          {/* Search bar inside Pass Builder */}
          <div className="qc-pass-search-bar">
            <div className="qc-pass-search-input-wrap">
              <Search size={16} color="#64748b" />
              <input
                type="text"
                value={passSearch}
                onChange={(e) => setPassSearch(e.target.value)}
                placeholder="Search products in pass builder (e.g. Gir cow milk, eggs, tomatoes, achar, papad)..."
                className="qc-pass-search-input"
              />
              {passSearch && (
                <button
                  type="button"
                  className="qc-pass-search-clear"
                  onClick={() => setPassSearch('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Available Category Filters */}
          <div className="qc-pass-category-chips">
            {BAZAAR_CATEGORIES.filter(c => c.id !== 'daily-pass').map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`qc-pass-cat-chip ${activeFilter === cat.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Available Products Grid with Unit Stepper */}
          <div className="qc-customize-items-grid">
            {displayedProducts.map((item) => {
              const qty = quantities[item.id] || 0;
              const isIncluded = qty > 0;
              const variants = UNIT_VARIANTS[item.category] || UNIT_VARIANTS['vegetables'];
              const currentVariant = selectedVariants[item.id] || variants[0]?.label;
              const unitAdjustedPrice = getItemPrice(item);

              return (
                <div key={item.id} className={`qc-custom-item-card ${isIncluded ? 'active' : ''}`}>
                  <div 
                    className="qc-pass-item-img-wrap"
                    onClick={() => setModalProduct(item)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view product details"
                  >
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

                  <h4 
                    className="qc-item-name" 
                    title={item.name}
                    onClick={() => setModalProduct(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.name}
                  </h4>

                  {/* Description Preview */}
                  {item.description && (
                    <p 
                      className="qc-pass-item-desc"
                      onClick={() => setModalProduct(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.description}
                    </p>
                  )}

                  {/* View Details Link */}
                  <button
                    type="button"
                    className="qc-card-detail-link"
                    style={{ margin: '0 0 8px', padding: 0 }}
                    onClick={() => setModalProduct(item)}
                  >
                    <Info size={12} />
                    <span>View details &amp; specs</span>
                  </button>

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

      {/* Product Detail Modal for Pass Builder items */}
      <BazaarProductDetailModal
        product={modalProduct}
        isOpen={Boolean(modalProduct)}
        onClose={() => setModalProduct(null)}
      />
    </section>
  );
}
