import React, { useState } from 'react';
import { Sparkles, Eye, ArrowRight, Layers } from 'lucide-react';

const LOOKBOOK_ITEMS = [
  {
    id: 'living-1',
    category: 'living',
    theme: 'Contemporary Minimalist',
    title: 'Warm Walnut & Fluted Panel Living Lounge',
    desc: 'Spacious TV unit with back-lit acoustic fluted panels, floating console, and concealed cable management.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tags: ['Acoustic Fluted Panels', 'Concealed LED Strip', 'Italian Marble Top', 'Floating Console'],
  },
  {
    id: 'kitchen-1',
    category: 'kitchen',
    theme: 'European Modern',
    title: 'Matte Charcoal & Champagne Gold Modular Kitchen',
    desc: 'Parallel island layout equipped with anti-fingerprint acrylic shutters, quartz stone countertop, and tall pantry pull-out.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    tags: ['Anti-fingerprint Acrylic', 'Hettich Soft-Close', 'Quartz Countertop', 'Tandem Baskets'],
  },
  {
    id: 'bedroom-1',
    category: 'bedroom',
    theme: 'Scandinavian Sanctuary',
    title: 'Master Bedroom with Walk-in Wardrobe',
    desc: 'Full-height floor-to-ceiling tinted glass wardrobes with integrated sensor profile lights and plush upholstered headboard.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    tags: ['Tinted Glass Wardrobe', 'Sensor Lighting', 'Storage Hydraulic Bed', 'Oak Wood Accents'],
  },
  {
    id: 'kitchen-2',
    category: 'kitchen',
    theme: 'Boho Luxe',
    title: 'Sage Green & Brass Hardware Kitchen',
    desc: 'L-shaped contemporary modular kitchen with wicker basket pantry, spice carousels, and dual-sink setup.',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    tags: ['PU Lacquer Finish', 'Hafele Magic Corner', 'BWP Marine Ply', 'Wicker Baskets'],
  },
  {
    id: 'living-2',
    category: 'living',
    theme: 'Neo-Classical Elegance',
    title: 'French Wainscoting & Chandelier Living Area',
    desc: 'Sophisticated living lounge with custom wall mouldings, premium beige sofa accents, and false ceiling cove lighting.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    tags: ['Wainscoting Moulding', 'Cove Ambient Light', 'Brass Trim Inserts', 'Custom Console'],
  },
  {
    id: 'balcony-1',
    category: 'balcony',
    theme: 'Urban Oasis',
    title: 'Balcony Deck & Private Coffee Bar',
    desc: 'Weather-resistant WPC wooden deck flooring, vertical green herb wall, and compact fold-down bar unit.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    tags: ['WPC Deck Flooring', 'Vertical Green Wall', 'Weatherproof Polish', 'Foldable Coffee Bar'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Designs' },
  { id: 'living', label: 'Living Rooms' },
  { id: 'kitchen', label: 'Modular Kitchens' },
  { id: 'bedroom', label: 'Master Bedrooms' },
  { id: 'balcony', label: 'Balcony & Bar' },
];

export default function InteriorsLookbook({ onOpenConsultation }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = activeTab === 'all'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="lookbook" className="interiors-lookbook-section">
      <div className="interiors-section-header">
        <div className="interiors-badge">
          <Layers size={14} />
          <span>Curated 3D Lookbook</span>
        </div>
        <h2 className="interiors-section-title">
          Explore Trendsetting Interior Designs
        </h2>
        <p className="interiors-section-subtitle">
          Real homes designed by our senior architects for contemporary apartment living. Customize every finish to your taste.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="lookbook-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`lookbook-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="lookbook-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="lookbook-card">
            <div className="lookbook-img-wrapper">
              <img src={item.image} alt={item.title} className="lookbook-img" loading="lazy" />
              <span className="lookbook-theme-tag">{item.theme}</span>
            </div>

            <div className="lookbook-body">
              <h3 className="lookbook-title">{item.title}</h3>
              <p className="lookbook-desc">{item.desc}</p>

              <div className="lookbook-features-list">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="lookbook-feature-chip">
                    • {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onOpenConsultation && onOpenConsultation({ lookbookTheme: `${item.title} (${item.theme})` })}
                className="interiors-btn-secondary"
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.88rem' }}
              >
                <span>Customize This Look</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
