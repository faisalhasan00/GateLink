import React from 'react';
import { BAZAAR_PROMOS } from '../data/quickCommerceData';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';

export default function BazaarPromoBanners() {
  const { setActiveCategory } = useBazaarCart();

  const handlePromoClick = (id) => {
    if (id === 'promo-2') setActiveCategory('milk-dairy');
    else if (id === 'promo-3') setActiveCategory('achar');
    else setActiveCategory('all');
  };

  return (
    <div className="qc-promos-grid">
      {BAZAAR_PROMOS.map((promo) => (
        <div
          key={promo.id}
          className="qc-promo-card"
          style={{ background: promo.bgGradient, cursor: 'pointer' }}
          onClick={() => handlePromoClick(promo.id)}
        >
          <div>
            <span className="qc-promo-badge">{promo.badge}</span>
            <h3 className="qc-promo-title">{promo.title}</h3>
            <p className="qc-promo-subtitle">{promo.subtitle}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <span className="qc-promo-code">Use: {promo.code}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 700 }}>
              <span>Shop Now</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
