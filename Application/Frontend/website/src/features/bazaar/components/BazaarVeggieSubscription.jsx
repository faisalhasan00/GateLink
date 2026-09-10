import React, { useState } from 'react';
import { Calendar, CheckCircle2, Sparkles, RefreshCw, Sun, ArrowRight, ShieldCheck, Plus, Check } from 'lucide-react';
import { useBazaarCart } from '../context/BazaarCartContext';

const WEEKLY_DEFAULT_SCHEDULE = [
  {
    day: 'Monday',
    theme: 'Light & Green Detox',
    items: ['Tender Palak (250g)', 'Desi Bhindi (500g)', 'Vine Tomatoes (500g)', 'Dhaniya-Mirchi'],
    icon: '🥬'
  },
  {
    day: 'Tuesday',
    theme: 'Staple Comfort Curry',
    items: ['Sweet Lauki / Bottle Gourd (1pc)', 'Green Capsicum (250g)', 'Farm Potatoes (500g)', 'Ginger-Garlic'],
    icon: '🫑'
  },
  {
    day: 'Wednesday',
    theme: 'Iron & Aromatic Leafy',
    items: ['Fresh Methi (250g)', 'Round Purple Baingan (500g)', 'Red Onions (500g)', 'Fresh Mint Bunch'],
    icon: '🌿'
  },
  {
    day: 'Thursday',
    theme: 'Crunchy Stir-Fry Day',
    items: ['Fresh Cauliflower (1pc)', 'Tender French Beans (250g)', 'Orange Carrots (500g)', 'Curry Leaves'],
    icon: '🥕'
  },
  {
    day: 'Friday',
    theme: 'Digestive & Coolers',
    items: ['Desi Torai / Ridge Gourd (500g)', 'Green Peas (250g)', 'Juicy Tomatoes (500g)', 'Fresh Lemon (2pcs)'],
    icon: '🥒'
  },
  {
    day: 'Saturday',
    theme: 'Weekend Gourmet Box',
    items: ['Fresh Button Mushrooms (200g)', 'Tricolor Bell Peppers (300g)', 'Broccoli (1pc)', 'Baby Corn (200g)'],
    icon: '🥦'
  },
  {
    day: 'Sunday',
    theme: 'Sunday Biryani & Feast',
    items: ['Baby Potatoes (500g)', 'Beans & Carrot Combo (400g)', 'Mint & Coriander Bunch', 'Spicy Green Chillies'],
    icon: '🍲'
  }
];

const SUBSCRIPTION_PLANS = [
  {
    id: '7-day',
    name: '7-Day Trial Plan',
    tagline: 'Perfect for trying fresh morning delivery',
    perDay: '₹129',
    totalPrice: 899,
    mrp: 1050,
    savings: '₹151 OFF',
    popular: false
  },
  {
    id: '15-day',
    name: '15-Day Routine Plan',
    tagline: 'Bi-weekly routine for busy households',
    perDay: '₹119',
    totalPrice: 1785,
    mrp: 2150,
    savings: '₹365 OFF',
    popular: true
  },
  {
    id: '30-day',
    name: '30-Day Monthly Saver',
    tagline: 'Best value • Never worry about sabzi again',
    perDay: '₹99',
    totalPrice: 2970,
    mrp: 3900,
    savings: '₹930 OFF (24% OFF)',
    popular: false
  }
];

export default function BazaarVeggieSubscription() {
  const { addToCart, setIsCartOpen, selectedSlot } = useBazaarCart();
  const [selectedPlan, setSelectedPlan] = useState('30-day');
  const [familySize, setFamilySize] = useState('standard'); // 'compact' (1-2 ppl) or 'standard' (3-5 ppl)
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const activePlanObj = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan) || SUBSCRIPTION_PLANS[2];

  const handleSubscribeNow = () => {
    const planItem = {
      id: `veggie-sub-${selectedPlan}-${familySize}`,
      name: `Daily Farm Veggie Subscription (${activePlanObj.name})`,
      category: 'vegetables',
      unit: `${familySize === 'compact' ? 'Compact 1.5kg/day' : 'Family 2.5kg/day'} • ${activePlanObj.name}`,
      price: activePlanObj.totalPrice,
      mrp: activePlanObj.mrp,
      discount: activePlanObj.savings,
      deliveryTime: `🌅 Daily ${selectedSlot}`,
      source: 'Direct Farm Harvest (Harvested at 3 AM)',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      description: `Daily rotating farm-fresh vegetables delivered every morning in your ${selectedSlot} slot. Full flexibility to pause or swap veggies.`,
      quantity: 1
    };

    addToCart(planItem);
    setIsCartOpen(true);
  };

  return (
    <section className="qc-veggie-sub-section">
      <div className="qc-veggie-sub-card">
        {/* Header Tag */}
        <div className="qc-sub-top-badge">
          <Sparkles size={15} color="#059669" />
          <span>DAILY ROTATING VEGETABLE SUBSCRIPTION</span>
        </div>

        <div className="qc-sub-header">
          <div>
            <h2 className="qc-sub-title">
              Fresh Daily Sabzi Delivered to Your Doorstep
            </h2>
            <p className="qc-sub-subtitle">
              Never stress about what vegetables to buy. Get a hand-picked, pesticide-tested daily vegetable basket harvested at 3:00 AM and delivered by 6:00 AM.
            </p>
          </div>

          <div className="qc-family-size-toggle">
            <button
              className={`qc-size-btn ${familySize === 'compact' ? 'active' : ''}`}
              onClick={() => setFamilySize('compact')}
            >
              <span>🌱 Compact (1-2 Ppl)</span>
              <small>1.5 kg daily box</small>
            </button>
            <button
              className={`qc-size-btn ${familySize === 'standard' ? 'active' : ''}`}
              onClick={() => setFamilySize('standard')}
            >
              <span>👨‍👩‍👧‍👦 Family (3-5 Ppl)</span>
              <small>2.5 kg daily box</small>
            </button>
          </div>
        </div>

        {/* 7-Day Interactive Menu Selector */}
        <div className="qc-sub-weekly-wrap">
          <div className="qc-sub-weekly-header">
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px' }}>
              🗓️ 7-Day Rotating Menu (Customizable Anytime)
            </span>
            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
              ✓ 100% Free Swap Guarantee
            </span>
          </div>

          <div className="qc-days-tabs">
            {WEEKLY_DEFAULT_SCHEDULE.map((item, idx) => (
              <button
                key={item.day}
                className={`qc-day-tab ${activeDayIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveDayIndex(idx)}
              >
                <span className="qc-day-icon">{item.icon}</span>
                <span className="qc-day-label">{item.day.slice(0, 3)}</span>
              </button>
            ))}
          </div>

          {/* Active Day Card */}
          <div className="qc-active-day-box">
            <div className="qc-day-box-header">
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                  {WEEKLY_DEFAULT_SCHEDULE[activeDayIndex].day} Basket: {WEEKLY_DEFAULT_SCHEDULE[activeDayIndex].theme}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Harvested fresh early morning • Delivered in {selectedSlot}
                </p>
              </div>
              <span style={{ background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {familySize === 'compact' ? '1.5 kg Mix' : '2.5 kg Mix'}
              </span>
            </div>

            <div className="qc-day-items-grid">
              {WEEKLY_DEFAULT_SCHEDULE[activeDayIndex].items.map((veg, i) => (
                <div key={i} className="qc-veg-chip">
                  <CheckCircle2 size={15} color="#0c831f" />
                  <span>{veg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription Duration Pricing Cards */}
        <div className="qc-sub-plans-grid">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`qc-sub-plan-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <span className="qc-plan-popular-tag">MOST POPULAR</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {plan.name}
                  </h4>
                  {isSelected && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#0c831f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} />
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem', minHeight: '32px' }}>
                  {plan.tagline}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{plan.totalPrice}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{plan.mrp}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>
                    ({plan.perDay}/day)
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '6px', width: 'fit-content' }}>
                  {plan.savings}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button & Trust Points */}
        <div className="qc-sub-footer">
          <div className="qc-sub-trust-points">
            <div className="qc-sub-trust-item">
              <RefreshCw size={15} color="#059669" />
              <span>Pause, Resume or Cancel Anytime</span>
            </div>
            <div className="qc-sub-trust-item">
              <ShieldCheck size={15} color="#059669" />
              <span>Zero-Pesticide Ozonized Cleaning</span>
            </div>
            <div className="qc-sub-trust-item">
              <Sun size={15} color="#059669" />
              <span>Doorstep Delivery by 6:00 AM</span>
            </div>
          </div>

          <button 
            className="qc-start-sub-btn"
            onClick={handleSubscribeNow}
            aria-label="Start Vegetable Subscription"
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase' }}>
                {activePlanObj.name} ({familySize === 'compact' ? '1.5 kg/day' : '2.5 kg/day'})
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Subscribe for ₹{activePlanObj.totalPrice}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Start Daily Box</span>
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
