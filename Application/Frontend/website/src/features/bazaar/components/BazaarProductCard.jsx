import React, { useState } from 'react';
import { Plus, Minus, Sun, Info, Star, ChevronRight } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';
import BazaarProductDetailModal from './BazaarProductDetailModal';

export default function BazaarProductCard({ product }) {
  const { cartItems, addToCart, removeFromCart } = useBazaarCart();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const currentQuantity = cartItems[product.id]?.quantity || 0;

  return (
    <>
      <div className="qc-product-card">
        {/* Product Image Container */}
        <div 
          className="qc-img-container" 
          onClick={() => setIsDetailOpen(true)}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${product.name}`}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="qc-product-img"
            loading="lazy"
          />
          {product.isBestseller && (
            <span className="qc-bestseller-tag">BESTSELLER</span>
          )}
          {product.discount && (
            <span className="qc-discount-badge">{product.discount}</span>
          )}
        </div>

        {/* Morning delivery time pill & rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <div className="qc-delivery-tag" style={{ margin: 0 }}>
            <Sun size={11} color="#d97706" fill="#f59e0b" />
            <span>{product.deliveryTime}</span>
          </div>
          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>
              <Star size={11} color="#f59e0b" fill="#f59e0b" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        {/* Product Name & Details */}
        <h4 
          className="qc-product-name" 
          title={product.name}
          onClick={() => setIsDetailOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h4>
        <div className="qc-product-unit">{product.unit}</div>

        {/* Product Description Snippet */}
        {product.description && (
          <p 
            className="qc-product-card-desc"
            onClick={() => setIsDetailOpen(true)}
            style={{ cursor: 'pointer' }}
            title="Click to view full description and purity details"
          >
            {product.description}
          </p>
        )}

        {/* View Details Link */}
        <button
          type="button"
          className="qc-card-detail-link"
          onClick={() => setIsDetailOpen(true)}
        >
          <span>View details &amp; purity</span>
          <ChevronRight size={12} />
        </button>

        {product.source && (
          <div className="qc-product-source">
            {product.source}
          </div>
        )}

        {/* Card Bottom: Price & ADD Button / Counter */}
        <div className="qc-card-bottom">
          <div className="qc-price-block">
            <div className="qc-price-row">
              <span className="qc-current-price">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="qc-mrp-price">₹{product.mrp}</span>
              )}
            </div>
          </div>

          {currentQuantity === 0 ? (
            <button 
              className="qc-add-btn"
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              ADD
            </button>
          ) : (
            <div className="qc-qty-stepper">
              <button 
                className="qc-qty-btn"
                onClick={() => removeFromCart(product.id)}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="qc-qty-count">{currentQuantity}</span>
              <button 
                className="qc-qty-btn"
                onClick={() => addToCart(product)}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <BazaarProductDetailModal 
        product={product}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}
