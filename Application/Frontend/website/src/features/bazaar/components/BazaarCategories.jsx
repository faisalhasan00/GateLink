import React from 'react';
import { 
  Armchair, 
  Tv, 
  Bike, 
  UtensilsCrossed, 
  BookOpen, 
  Car, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function BazaarCategories({ onSelectCategory }) {
  const categories = [
    {
      id: 'furniture',
      title: 'Furniture & Decor',
      icon: <Armchair size={28} />,
      desc: 'Sofas, ergonomic work desks, wardrobes, balcony planters & ambient lighting from moving neighbors.',
      activeCount: '128 Items Listed',
      badge: 'High Demand'
    },
    {
      id: 'electronics',
      title: 'Electronics & Gadgets',
      icon: <Tv size={28} />,
      desc: 'Monitors, air fryers, microwave ovens, Kindle e-readers & smart home gadgets in mint condition.',
      activeCount: '94 Items Listed',
      badge: 'Verified Working'
    },
    {
      id: 'kids',
      title: 'Kids, Toys & Cycles',
      icon: <Bike size={28} />,
      desc: 'Bicycles, balance bikes, LEGO sets, strollers, and pre-loved nursery furniture your kids outgrew.',
      activeCount: '86 Items Listed',
      badge: 'Fastest Selling'
    },
    {
      id: 'bakers',
      title: 'Home Food & Bakers',
      icon: <UtensilsCrossed size={28} />,
      desc: 'Handcrafted artisan bread, festival sweets, healthy tiffins, sourdough & baked brownies delivered to your door.',
      activeCount: '45 Kitchens',
      badge: 'Fresh & Hygienic'
    },
    {
      id: 'books',
      title: 'Books, Plants & Hobbies',
      icon: <BookOpen size={28} />,
      desc: 'Rare succulents, CBSE/ICSE textbooks, bestselling fiction, acoustic guitars, and sports racquets.',
      activeCount: '160+ Items Listed',
      badge: 'Community Favorites'
    },
    {
      id: 'parking',
      title: 'Parking & Carpooling',
      icon: <Car size={28} />,
      desc: 'Sublet your unused covered parking slot to fellow residents or share daily commute rides to IT hubs.',
      activeCount: '32 Slots & Rides',
      badge: 'Society Internal'
    }
  ];

  return (
    <section id="categories" className="bazaar-categories-section">
      <div className="bazaar-section-header">
        <div className="bazaar-section-badge">
          <Sparkles size={14} />
          <span>Community Catalog</span>
        </div>
        <h2 className="bazaar-section-title">
          Explore Popular Categories Inside Your Society
        </h2>
        <p className="bazaar-section-subtitle">
          Everything from apartment relocations and seasonal decluttering to delicious home bakeries.
        </p>
      </div>

      <div className="bazaar-categories-grid">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="bazaar-category-card"
            onClick={() => onSelectCategory && onSelectCategory(cat.title)}
          >
            <div className="bazaar-category-icon-box">
              {cat.icon}
            </div>
            <h3 className="bazaar-category-title">{cat.title}</h3>
            <p className="bazaar-category-desc">{cat.desc}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <span className="bazaar-category-count-badge">{cat.activeCount}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>Browse</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
