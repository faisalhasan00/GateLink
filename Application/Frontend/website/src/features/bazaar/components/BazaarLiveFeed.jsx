import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  MessageCircle, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Building
} from 'lucide-react';

export default function BazaarLiveFeed({ onOpenItemModal }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedItems, setSavedItems] = useState([]);

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedItems((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const categories = ['All', 'Furniture', 'Electronics', 'Kids & Toys', 'Food & Bakery', 'Books & Hobbies'];

  const allListings = [
    {
      id: 'lst-1',
      category: 'Furniture',
      title: 'Solid Sheesham Wood 6-Seater Dining Table',
      price: '₹14,500',
      originalPrice: '₹32,000',
      condition: 'Like New (1 yr old)',
      walkTime: '2 min walk',
      tower: 'Tower C - 1404',
      seller: 'Deepak Saxena',
      sellerInitials: 'DS',
      verified: true,
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
      timeAgo: '15 mins ago'
    },
    {
      id: 'lst-2',
      category: 'Electronics',
      title: 'LG 28L Convection Microwave Oven (Auto-Cook)',
      price: '₹4,200',
      originalPrice: '₹11,500',
      condition: 'Mint Condition',
      walkTime: '3 min walk',
      tower: 'Tower A - 502',
      seller: 'Pooja Sundaram',
      sellerInitials: 'PS',
      verified: true,
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80',
      timeAgo: '42 mins ago'
    },
    {
      id: 'lst-3',
      category: 'Kids & Toys',
      title: 'Chicco Cortina CX Baby Stroller & Travel System',
      price: '₹3,800',
      originalPrice: '₹12,000',
      condition: 'Gently Used',
      walkTime: '1 min walk',
      tower: 'Tower B - 801',
      seller: 'Kavita Menon',
      sellerInitials: 'KM',
      verified: true,
      image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80',
      timeAgo: '1 hr ago'
    },
    {
      id: 'lst-4',
      category: 'Food & Bakery',
      title: 'Artisan Sourdough Loaf + Jalapeno Cheddar Dip',
      price: '₹280',
      originalPrice: '₹400',
      condition: 'Fresh Today',
      walkTime: 'Doorstep Handover',
      tower: 'Tower D - 1103',
      seller: 'The Crust Corner (Anita)',
      sellerInitials: 'TC',
      verified: true,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      timeAgo: 'Just now'
    },
    {
      id: 'lst-5',
      category: 'Electronics',
      title: 'Dell 27-inch 4K Ultra HD IPS Monitor (Type-C 90W)',
      price: '₹18,000',
      originalPrice: '₹36,000',
      condition: 'Like New (With Box)',
      walkTime: '4 min walk',
      tower: 'Tower F - 302',
      seller: 'Rohan Deshmukh',
      sellerInitials: 'RD',
      verified: true,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
      timeAgo: '2 hrs ago'
    },
    {
      id: 'lst-6',
      category: 'Books & Hobbies',
      title: 'Yamaha F310 Acoustic Guitar + Padded Gig Bag',
      price: '₹4,900',
      originalPrice: '₹10,500',
      condition: 'Excellent String Action',
      walkTime: '2 min walk',
      tower: 'Tower A - 904',
      seller: 'Siddharth Roy',
      sellerInitials: 'SR',
      verified: true,
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
      timeAgo: '3 hrs ago'
    }
  ];

  const filteredListings = activeCategory === 'All' 
    ? allListings 
    : allListings.filter(item => item.category === activeCategory);

  return (
    <section id="live-feed" className="bazaar-feed-section">
      <div className="bazaar-feed-container">
        <div className="bazaar-section-header">
          <div className="bazaar-section-badge">
            <ShieldCheck size={14} />
            <span>Verified Society Feed</span>
          </div>
          <h2 className="bazaar-section-title">
            Live Marketplace Listings in Your Complex
          </h2>
          <p className="bazaar-section-subtitle">
            Chat directly with your neighbors, inspect items in person inside the clubhouse or lobby, and take them home immediately.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="bazaar-feed-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`bazaar-filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="bazaar-listings-grid">
          {filteredListings.map((item) => {
            const isSaved = savedItems.includes(item.id);
            return (
              <div 
                key={item.id} 
                className="bazaar-listing-card"
                onClick={() => onOpenItemModal && onOpenItemModal(item)}
              >
                {/* Image & Badges */}
                <div className="bazaar-listing-image-wrapper">
                  <img src={item.image} alt={item.title} className="bazaar-listing-img" />
                  <span className="bazaar-listing-condition-badge">
                    {item.condition}
                  </span>
                  <span className="bazaar-listing-walk-badge">
                    <MapPin size={12} />
                    {item.walkTime}
                  </span>
                  
                  <button
                    type="button"
                    onClick={(e) => toggleSave(item.id, e)}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isSaved ? '#e11d48' : '#64748b'
                    }}
                    aria-label="Save listing"
                  >
                    <Heart size={16} fill={isSaved ? '#e11d48' : 'none'} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="bazaar-listing-body">
                  <div className="bazaar-listing-price-row">
                    <span className="bazaar-listing-price">{item.price}</span>
                    <span className="bazaar-listing-original-price">{item.originalPrice}</span>
                  </div>

                  <h3 className="bazaar-listing-title">{item.title}</h3>

                  <div className="bazaar-listing-seller-info">
                    <div className="bazaar-seller-avatar">
                      {item.sellerInitials}
                    </div>
                    <div className="bazaar-seller-meta">
                      <div className="bazaar-seller-name">
                        <span>{item.seller}</span>
                        {item.verified && <CheckCircle2 size={13} style={{ color: '#059669' }} />}
                      </div>
                      <div className="bazaar-seller-location">
                        {item.tower} • {item.timeAgo}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="bazaar-listing-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenItemModal && onOpenItemModal(item);
                    }}
                  >
                    <MessageCircle size={15} />
                    <span>Chat with Neighbor</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
