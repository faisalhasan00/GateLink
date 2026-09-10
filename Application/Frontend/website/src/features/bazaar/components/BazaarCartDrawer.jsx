import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Sun, CheckCircle2, ShieldCheck, ArrowRight, Clock, Check } from 'lucide-react';
import { useBazaarCart, MORNING_DELIVERY_SLOTS } from '../context/BazaarCartContext';

export default function BazaarCartDrawer() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    selectedSlot,
    setSelectedSlot,
    selectedSocietyFlat,
    totalItemsCount,
    itemsTotalAmount,
    totalSavings,
    deliveryFee,
    handlingFee,
    grandTotal
  } = useBazaarCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SOCIETYFREE' || promoCode.trim().toUpperCase() === 'DADI15') {
      setAppliedPromo(promoCode.trim().toUpperCase());
    }
  };

  const handleCheckout = () => {
    setOrderPlaced(true);
  };

  const handleResetAndClose = () => {
    setOrderPlaced(false);
    clearCart();
    setIsCartOpen(false);
  };

  const itemsList = Object.values(cartItems);

  return (
    <div className="qc-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="qc-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="qc-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="qc-drawer-title">My Morning Cart</h3>
            {totalItemsCount > 0 && (
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>
          <button 
            className="qc-drawer-close" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="qc-drawer-body">
          {orderPlaced ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Manrope, sans-serif' }}>
                Order Confirmed!
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Delivering to <strong>{selectedSocietyFlat.society} • {selectedSocietyFlat.tower}, {selectedSocietyFlat.flat}</strong>.
              </p>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.88rem', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Delivery Schedule:</span>
                  <strong style={{ color: '#059669' }}>Tomorrow, {selectedSlot}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Order Placement Cutoff:</span>
                  <span style={{ color: '#64748b' }}>Order placed before 11:00 PM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Society Security PIN:</span>
                  <strong style={{ color: '#0c831f' }}>GATE-8492</strong>
                </div>
              </div>
              <button 
                className="qc-checkout-btn"
                style={{ justifyContent: 'center' }}
                onClick={handleResetAndClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : itemsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Your Cart is Empty
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Add fresh farm milk, country eggs, raw honey, farm veggies, or Dadi's homemade pickles for tomorrow's morning delivery.
              </p>
              <button 
                className="qc-checkout-btn" 
                style={{ justifyContent: 'center', background: '#0f172a' }}
                onClick={() => setIsCartOpen(false)}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Morning Slot Selector (5 AM - 9 AM) */}
              <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.65rem' }}>
                  <Sun size={18} color="#d97706" fill="#f59e0b" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                    Choose Morning Delivery Slot (5 AM - 9 AM)
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 0.75rem' }}>
                  Order by 11:00 PM tonight for flat doorstep delivery in your preferred slot:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {MORNING_DELIVERY_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot.label;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot.label)}
                        style={{
                          padding: '0.55rem 0.65rem',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #0c831f' : '1px solid #cbd5e1',
                          background: isSelected ? '#ecfdf5' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isSelected ? '#065f46' : '#1e293b' }}>
                            {slot.label}
                          </span>
                          {isSelected && <Check size={14} color="#0c831f" />}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: isSelected ? '#059669' : '#64748b' }}>
                          {slot.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="qc-items-list">
                {itemsList.map((item) => (
                  <div key={item.id} className="qc-drawer-item">
                    <img src={item.image} alt={item.name} className="qc-drawer-item-img" />
                    <div className="qc-drawer-item-info">
                      <div className="qc-drawer-item-name">{item.name}</div>
                      <div className="qc-drawer-item-unit">{item.unit}</div>
                      <div className="qc-drawer-item-price">₹{item.price * item.quantity}</div>
                    </div>
                    <div className="qc-qty-stepper">
                      <button className="qc-qty-btn" onClick={() => removeFromCart(item.id)}>
                        <Minus size={13} />
                      </button>
                      <span className="qc-qty-count">{item.quantity}</span>
                      <button className="qc-qty-btn" onClick={() => addToCart(item)}>
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code input */}
              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter Promo (e.g. SOCIETYFREE)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', textTransform: 'uppercase' }}
                />
                <button
                  onClick={handleApplyPromo}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 1rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div style={{ color: '#059669', fontSize: '0.78rem', fontWeight: 700, marginTop: '4px' }}>
                  ✓ Promo '{appliedPromo}' applied: Free Society Delivery!
                </div>
              )}

              {/* Bill Details */}
              <div className="qc-bill-card">
                <div className="qc-bill-title">Bill Details</div>
                <div className="qc-bill-row">
                  <span>Items Total</span>
                  <span>₹{itemsTotalAmount}</span>
                </div>
                <div className="qc-bill-row">
                  <span>Morning Doorstep Delivery</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: '#0c831f' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="qc-bill-row">
                  <span>Handling Fee</span>
                  <span>₹{handlingFee}</span>
                </div>
                <div className="qc-bill-row total">
                  <span>To Pay</span>
                  <span>₹{grandTotal}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="qc-savings-tag">
                    🎉 You saved ₹{totalSavings} with Direct Farm & Kitchen prices!
                  </div>
                )}
              </div>

              {/* Society Trust badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem', padding: '0.6rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                <ShieldCheck size={16} color="#0c831f" />
                <span>100% Cold-Chain Maintained • Chilled Milk Delivery • Flat Door Drop</span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {!orderPlaced && itemsList.length > 0 && (
          <div className="qc-drawer-footer">
            <button className="qc-checkout-btn" onClick={handleCheckout}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.9 }}>
                  Tomorrow ({selectedSlot})
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{grandTotal}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Confirm Morning Slot</span>
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
