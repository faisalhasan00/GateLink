import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, ChevronDown, X, ShoppingCart, ArrowLeft, Sun, Clock } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';

export default function BazaarQuickHeader({ onOpenLocationModal }) {
  const { 
    totalItemsCount, 
    itemsTotalAmount, 
    setIsCartOpen, 
    selectedSocietyFlat, 
    selectedSlot,
    searchQuery, 
    setSearchQuery 
  } = useBazaarCart();

  return (
    <header className="qc-header">
      <div className="qc-header-inner">
        {/* Brand & Location */}
        <div className="qc-brand-section">
          <Link to="/bazaar" className="qc-logo">
            <div className="qc-logo-icon">
              <ShoppingBag size={22} />
            </div>
            <span>
              GateLink <span style={{ color: '#0c831f' }}>Bazaar</span>
            </span>
          </Link>

          {/* Morning Slot & Flat Selector */}
          <div className="qc-delivery-pill" onClick={onOpenLocationModal} role="button" tabIndex={0}>
            <div className="qc-timer-badge">
              <Sun size={13} color="#f59e0b" fill="#f59e0b" />
              <span>Morning Slot: {selectedSlot}</span>
            </div>
            <div className="qc-location-text">
              <span>{selectedSocietyFlat.society} • {selectedSocietyFlat.tower}, {selectedSocietyFlat.flat}</span>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>
        </div>

        {/* Big Search Bar with Search Button */}
        <div className="qc-search-wrapper">
          <Search size={18} className="qc-search-icon" />
          <input
            type="text"
            className="qc-search-input"
            placeholder="Search 'fresh milk', 'farm eggs', 'raw honey', 'mango achar', 'papad'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="qc-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <X size={12} />
            </button>
          )}
          <button 
            type="button"
            className="qc-search-action-btn"
            onClick={() => {
              const shelf = document.querySelector('.qc-shelf-section');
              if (shelf) shelf.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Search
          </button>
        </div>

        {/* Header Actions */}
        <div className="qc-header-actions">
          <Link to="/" className="qc-back-home">
            <ArrowLeft size={16} />
            <span>Main Site</span>
          </Link>

          <button 
            className="qc-cart-btn" 
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
          >
            <ShoppingCart size={18} />
            <span>My Cart</span>
            {totalItemsCount > 0 && (
              <span className="qc-cart-badge">
                {totalItemsCount} | ₹{itemsTotalAmount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
