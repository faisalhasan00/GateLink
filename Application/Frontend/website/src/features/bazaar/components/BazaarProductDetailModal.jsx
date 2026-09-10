import React, { useState } from 'react';
import { 
  X, Star, ShieldCheck, Sun, Plus, Minus, Check, MapPin, 
  Truck, Clock, Info, Heart, PackageCheck, Leaf, 
  Flame, Droplets, HelpCircle
} from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';

export default function BazaarProductDetailModal({ product, isOpen, onClose }) {
  const { cartItems, addToCart, removeFromCart, selectedSlot, selectedFlat } = useBazaarCart();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !product) return null;

  const currentQty = cartItems[product.id]?.quantity || 0;

  return (
    <div className="qc-modal-overlay" onClick={onClose}>
      <div className="qc-detail-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          className="qc-detail-modal-close" 
          onClick={onClose}
          aria-label="Close Product Details"
        >
          <X size={18} />
        </button>

        <div className="qc-detail-modal-body">
          {/* Left / Top Product Image & Trust Badges */}
          <div className="qc-detail-img-col">
            <img 
              src={product.image} 
              alt={product.name} 
              className="qc-detail-hero-img" 
            />
            {product.isBestseller && (
              <span className="qc-detail-bestseller-badge">BESTSELLER</span>
            )}
            {product.discount && (
              <span className="qc-detail-discount-badge">{product.discount}</span>
            )}

            {/* Quick Sourcing Badge on Image */}
            {product.source && (
              <div className="qc-img-source-tag">
                <MapPin size={12} />
                <span>{product.source}</span>
              </div>
            )}
          </div>

          {/* Right Product Details Info */}
          <div className="qc-detail-info-col">
            {/* Delivery time & rating */}
            <div className="qc-detail-top-meta">
              <div className="qc-delivery-tag" style={{ margin: 0 }}>
                <Sun size={12} color="#d97706" fill="#f59e0b" />
                <span>{product.deliveryTime || '🌅 Morning Slot (5 AM - 9 AM)'}</span>
              </div>
              {product.rating && (
                <div className="qc-detail-rating-pill">
                  <Star size={13} color="#f59e0b" fill="#f59e0b" />
                  <span>{product.rating}</span>
                  <span className="qc-detail-rating-count">({product.ratingCount} reviews)</span>
                </div>
              )}
            </div>

            <h2 className="qc-detail-title">{product.name}</h2>
            <div className="qc-detail-unit">{product.unit}</div>

            {/* Detail Tabs */}
            <div className="qc-detail-tabs">
              <button 
                type="button" 
                className={`qc-detail-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview &amp; Story
              </button>
              <button 
                type="button" 
                className={`qc-detail-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications &amp; Storage
              </button>
              {product.benefits && (
                <button 
                  type="button" 
                  className={`qc-detail-tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
                  onClick={() => setActiveTab('benefits')}
                >
                  Health Benefits
                </button>
              )}
            </div>

            {/* Tab 1: Overview & Story */}
            {activeTab === 'overview' && (
              <div className="qc-tab-content-area">
                <div className="qc-detail-desc-block">
                  <h4 className="qc-section-heading">
                    <Info size={14} color="#059669" />
                    <span>Product Description &amp; Purity</span>
                  </h4>
                  <p className="qc-detail-desc-text">
                    {product.description}
                  </p>
                </div>

                {/* Highlights list */}
                {product.highlights && product.highlights.length > 0 && (
                  <div className="qc-highlights-block">
                    <h4 className="qc-section-heading">
                      <ShieldCheck size={14} color="#059669" />
                      <span>Key Highlights</span>
                    </h4>
                    <ul className="qc-highlights-list">
                      {product.highlights.map((h, i) => (
                        <li key={i}>
                          <Check size={14} color="#059669" className="qc-hl-check" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quality Pillars */}
                <div className="qc-detail-pillars-grid">
                  <div className="qc-detail-pillar">
                    <ShieldCheck size={16} color="#0c831f" />
                    <div>
                      <strong>100% Lab Tested &amp; Pure</strong>
                      <small>Zero adulteration or synthetic preservatives</small>
                    </div>
                  </div>
                  <div className="qc-detail-pillar">
                    <Truck size={16} color="#0c831f" />
                    <div>
                      <strong>Direct Doorstep Delivery</strong>
                      <small>Delivered to {selectedFlat?.flatNumber || 'Your Flat'} in {selectedSlot}</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Specifications & Storage Guide */}
            {activeTab === 'specs' && (
              <div className="qc-tab-content-area">
                <div className="qc-specs-table">
                  <div className="qc-spec-row">
                    <span className="qc-spec-label">Pack / Unit Size</span>
                    <span className="qc-spec-value">{product.unit}</span>
                  </div>
                  {product.source && (
                    <div className="qc-spec-row">
                      <span className="qc-spec-label">Source Origin</span>
                      <span className="qc-spec-value">{product.source}</span>
                    </div>
                  )}
                  {product.shelfLife && (
                    <div className="qc-spec-row">
                      <span className="qc-spec-label">Shelf Life</span>
                      <span className="qc-spec-value">{product.shelfLife}</span>
                    </div>
                  )}
                  {product.storage && (
                    <div className="qc-spec-row">
                      <span className="qc-spec-label">Storage Instructions</span>
                      <span className="qc-spec-value">{product.storage}</span>
                    </div>
                  )}
                  {product.ingredients && (
                    <div className="qc-spec-row">
                      <span className="qc-spec-label">Ingredients / Composition</span>
                      <span className="qc-spec-value">{product.ingredients}</span>
                    </div>
                  )}
                  <div className="qc-spec-row">
                    <span className="qc-spec-label">Delivery Slot</span>
                    <span className="qc-spec-value">Morning {selectedSlot}</span>
                  </div>
                </div>

                <div className="qc-storage-tip-box">
                  <PackageCheck size={16} color="#059669" />
                  <div>
                    <strong>Society Freshness Guarantee:</strong>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569' }}>
                      Inspected and packed in hygienic food-grade pouches or glass jars with 100% instant return/replace on any morning quality issue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Health Benefits */}
            {activeTab === 'benefits' && (
              <div className="qc-tab-content-area">
                {product.benefits && product.benefits.length > 0 && (
                  <div className="qc-benefits-grid">
                    {product.benefits.map((b, idx) => (
                      <div key={idx} className="qc-benefit-card">
                        <Leaf size={16} color="#059669" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="qc-ayurveda-callout">
                  <Heart size={16} color="#dc2626" />
                  <div>
                    <strong>Nutritional Cleanliness</strong>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                      Clean single-origin foods processed without commercial shortcuts, keeping natural vitamins and macro-nutrients intact.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Pricing & Add to Cart */}
            <div className="qc-detail-footer">
              <div className="qc-detail-pricing">
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Price
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="qc-detail-price">₹{product.price}</span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="qc-detail-mrp">₹{product.mrp}</span>
                  )}
                  {product.discount && (
                    <span className="qc-detail-save-badge">{product.discount}</span>
                  )}
                </div>
              </div>

              {currentQty === 0 ? (
                <button 
                  className="qc-detail-add-btn"
                  onClick={() => addToCart(product)}
                >
                  <Plus size={16} />
                  <span>ADD TO BASKET</span>
                </button>
              ) : (
                <div className="qc-qty-stepper" style={{ padding: '0.2rem' }}>
                  <button className="qc-qty-btn" onClick={() => removeFromCart(product.id)}>
                    <Minus size={16} />
                  </button>
                  <span className="qc-qty-count" style={{ fontSize: '1rem', padding: '0 0.8rem' }}>{currentQty}</span>
                  <button className="qc-qty-btn" onClick={() => addToCart(product)}>
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
