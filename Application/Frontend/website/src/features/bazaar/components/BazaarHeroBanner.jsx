import React from 'react';
import { ArrowRight, Sparkles, Sun } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';

export default function BazaarHeroBanner() {
  const { setActiveCategory, setSearchQuery } = useBazaarCart();

  const handleShopNow = () => {
    setActiveCategory('all');
    setSearchQuery('');
    const shelfElem = document.querySelector('.qc-shelf-section');
    if (shelfElem) {
      shelfElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="qc-hero-banner-wrap">
      <div className="qc-hero-banner">
        {/* Left Content */}
        <div className="qc-hero-content">
          <div className="qc-hero-pill">
            <Sun size={14} color="#fef08a" fill="#fef08a" />
            <span>Delivering Every Morning 5 AM – 9 AM</span>
          </div>

          <h1 className="qc-hero-title">
            Stock up on daily essentials
          </h1>
          <p className="qc-hero-desc">
            Get farm-fresh goodness &amp; a range of exotic fruits, vegetables, pure A2 milk, country eggs &amp; more
          </p>

          <button 
            className="qc-hero-cta-btn" 
            onClick={handleShopNow}
            aria-label="Shop Now"
          >
            <span>Shop Now</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Imagery Composite */}
        <div className="qc-hero-image-side">
          <div className="qc-hero-img-glow"></div>
          <img 
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=80" 
            alt="Farm Fresh Essentials, Milk, Eggs, Fruits and Vegetables"
            className="qc-hero-featured-img"
          />
        </div>
      </div>
    </div>
  );
}
