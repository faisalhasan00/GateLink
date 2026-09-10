import React from 'react';
import { Plus, Minus, Sun, Clock } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';

export default function BazaarProductCard({ product }) {
  const { cartItems, addToCart, removeFromCart } = useBazaarCart();
  const currentQuantity = cartItems[product.id]?.quantity || 0;

  return (
    <div className="qc-product-card">
      {/* Product Image Container */}
      <div className="qc-img-container">
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

      {/* Morning delivery time pill */}
      <div className="qc-delivery-tag">
        <Sun size={11} color="#d97706" fill="#f59e0b" />
        <span>{product.deliveryTime}</span>
      </div>

      {/* Product Name & Details */}
      <h4 className="qc-product-name" title={product.name}>
        {product.name}
      </h4>
      <div className="qc-product-unit">{product.unit}</div>

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
  );
}
