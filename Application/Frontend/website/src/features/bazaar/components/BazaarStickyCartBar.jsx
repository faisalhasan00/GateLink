import React from 'react';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';

export default function BazaarStickyCartBar() {
  const { totalItemsCount, itemsTotalAmount, isCartOpen, setIsCartOpen } = useBazaarCart();

  if (totalItemsCount === 0 || isCartOpen) return null;

  return (
    <div 
      className="qc-sticky-cart-bar"
      onClick={() => setIsCartOpen(true)}
      role="button"
      tabIndex={0}
      aria-label="View Cart"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
          <ShoppingCart size={20} />
        </div>
        <div className="qc-sticky-info">
          <span className="qc-sticky-items">{totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}</span>
          <span className="qc-sticky-total">₹{itemsTotalAmount}</span>
        </div>
      </div>

      <div className="qc-sticky-action">
        <span>View Cart</span>
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
