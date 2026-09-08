import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Percent, 
  Search, 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  CheckCircle2, 
  Building2,
  Lock
} from 'lucide-react';

export default function BazaarHero({ onOpenPostModal, onSearchSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const sampleLiveItems = [
    {
      id: 'item-1',
      title: 'Solid Teak Study Table + Ergonomic Chair',
      category: 'Furniture',
      price: '₹4,500',
      seller: 'Rahul Verma',
      flat: 'Tower B-604',
      time: '12 mins ago',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'item-2',
      title: 'Decathlon Rockrider 26T Mountain Bike',
      category: 'Kids & Sports',
      price: '₹6,200',
      seller: 'Sneha Kapoor',
      flat: 'Tower D-1201',
      time: '35 mins ago',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'item-3',
      title: 'Fresh Homemade Belgian Chocolate Brownies (Box of 6)',
      category: 'Home Baker',
      price: '₹350',
      seller: 'Aarti & Kitchen',
      flat: 'Tower A-402',
      time: '1 hour ago',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <section className="bazaar-hero-section">
      <div className="bazaar-hero-container">
        {/* Left Content Column */}
        <div>
          <div className="bazaar-hero-badge">
            <Sparkles size={16} style={{ color: '#059669' }} />
            <span>Hyper-Local Society Marketplace • Zero Commission</span>
          </div>

          <h1 className="bazaar-hero-title">
            Buy, Sell & Trade with <span className="bazaar-highlight">Verified Neighbors</span> Inside Your Gate.
          </h1>

          <p className="bazaar-hero-subtitle">
            Say goodbye to stranger meetups and online scams. Trade pre-loved furniture, electronics, kids’ cycles, and homemade treats with verified residents in your apartment complex.
          </p>

          {/* Trust Factors */}
          <div className="bazaar-hero-trust-row">
            <div className="bazaar-trust-item">
              <ShieldCheck className="bazaar-trust-icon" />
              <span>100% KYC Verified Residents</span>
            </div>
            <div className="bazaar-trust-item">
              <Percent className="bazaar-trust-icon" />
              <span>0% Commission (Always Free)</span>
            </div>
            <div className="bazaar-trust-item">
              <MapPin className="bazaar-trust-icon" />
              <span>1-Minute Walk Pickup</span>
            </div>
            <div className="bazaar-trust-item">
              <Lock className="bazaar-trust-icon" />
              <span>Zero Strangers at Gate</span>
            </div>
          </div>

          {/* CTA Group */}
          <div className="bazaar-hero-cta-group">
            <button 
              type="button" 
              className="bazaar-hero-btn-primary"
              onClick={onOpenPostModal}
            >
              <PlusCircle size={20} />
              <span>Post Free Listing in 60s</span>
            </button>
            <a href="#live-feed" className="bazaar-hero-btn-secondary">
              <span>Browse Society Feed</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Right Side Live Society Feed Preview Card */}
        <div>
          <div className="bazaar-hero-card-preview">
            <div className="bazaar-hero-card-header">
              <div className="bazaar-card-society-tag">
                <span className="bazaar-live-pulse-dot" />
                <Building2 size={16} style={{ color: '#059669' }} />
                <span>Prestige Falcon City • Live Feed</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                48 Active Listings
              </span>
            </div>

            {/* Quick Filter Search Bar */}
            <div className="bazaar-search-bar-mock">
              <Search size={18} style={{ color: '#64748b' }} />
              <input 
                type="text" 
                className="bazaar-search-input"
                placeholder="Search furniture, cycles, books in your society..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Recent Live Listings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sampleLiveItems.map((item) => (
                <div key={item.id} className="bazaar-featured-item-card">
                  <img src={item.image} alt={item.title} className="bazaar-item-thumb" />
                  <div className="bazaar-item-details">
                    <span className="bazaar-item-category-tag">{item.category}</span>
                    <h4 className="bazaar-item-name">{item.title}</h4>
                    <div className="bazaar-item-seller-row">
                      <span>{item.seller} • <strong>{item.flat}</strong></span>
                      <span className="bazaar-item-price">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <a href="#live-feed" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>View all verified items</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
