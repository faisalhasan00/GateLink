import React from 'react';
import BazaarProductCard from './BazaarProductCard';

export default function BazaarProductShelf({ title, icon, count, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="qc-shelf-section">
      <div className="qc-shelf-header">
        <div className="qc-shelf-title-wrap">
          <span style={{ fontSize: '1.4rem' }}>{icon}</span>
          <h2 className="qc-shelf-title">{title}</h2>
          {count && <span className="qc-shelf-count">{count} Items</span>}
        </div>
      </div>

      <div className="qc-products-grid">
        {products.map((prod) => (
          <BazaarProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
