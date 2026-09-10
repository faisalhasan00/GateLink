import React from 'react';
import { BAZAAR_CATEGORIES } from '../data/quickCommerceData';
import { useBazaarCart } from '../context/BazaarCartContext';

export default function BazaarCategoryCarousel() {
  const { activeCategory, setActiveCategory } = useBazaarCart();

  return (
    <nav className="qc-category-bar" aria-label="Product Categories">
      <div className="qc-category-inner">
        {BAZAAR_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`qc-category-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <div className="qc-category-icon-circle">
                <span>{cat.icon}</span>
              </div>
              <span className="qc-category-name">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
