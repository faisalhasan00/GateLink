import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const HOUSE_HELP_SERVICES = [
  {
    id: 'house-cleaning',
    title: 'House cleaning',
    shortName: 'House cleaning',
    image: '/house_cleaning_thumb.jpg',
    heading: 'House Cleaning',
    included: [
      'Sweep and mop accessible floors',
      'Dust and wipe furniture and wardrobes',
      'Dust reachable walls, fans, ceilings',
      'Change or rearrange existing bedding',
      'Dispose of wet and dry household waste',
    ],
    excluded: [
      'Cleaning unsafe or inaccessible areas',
      'Any tasks involving ladders or working at height',
      'Moving heavy furniture or appliances',
      'Cleaning outside home areas',
      'Child, elderly, pet or medical care',
    ],
  },
  {
    id: 'dishwashing',
    title: 'Dishwashing',
    shortName: 'Dishwashing',
    image: '/dishwashing_thumb.jpg',
    heading: 'Dishwashing',
    included: [
      'Wash regular household utensils',
      'Scrub and clean the kitchen sink',
      'Clean burners & wipe stove top',
      'Dispose of wet/dry kitchen waste',
      'Leave sink area clean and dry',
    ],
    excluded: [
      'Chimney, degreasing or duct cleaning',
      'Cleaning inside of electrical appliances',
      'Heavy scrubbing of burnt/old deposits',
      'Handling broken glass/ sharp waste',
      'No specialised cookware handling',
    ],
  },
  {
    id: 'meal-prep',
    title: 'Meal Prep',
    shortName: 'Meal Prep',
    image: '/meal_prep_thumb.jpg',
    heading: 'Meal Preparation',
    included: [
      'Wash and chop vegetables',
      'Knead dough and prep batter',
      'Marinate and basic ingredient prep',
      'Clean and organize the prep area',
      'Store prepped items properly',
    ],
    excluded: [
      'Full meal cooking or plating',
      'Non-vegetarian meat preparation',
      'Specialized or gourmet recipes',
      'Grocery shopping or sourcing',
      'Operating unfamiliar appliances',
    ],
  },
  {
    id: 'bathroom-cleaning',
    title: 'Bathroom cleaning',
    shortName: 'Bathroom cleaning',
    image: '/bathroom_cleaning_thumb.jpg',
    heading: 'Bathroom Cleaning',
    included: [
      'Clean mirrors and reachable walls',
      'Clean WC (rim, seat, and lid)',
      'Scrub sinks and wipe fittings',
      'Mop and dry the bathroom floor',
      'Basic surface clean in bathroom',
    ],
    excluded: [
      'Hard stains, grouts or acid wash',
      'Cleaning ceilings and exhausts',
      'No drain unclogging/dismantling',
      'Handling biohazard waste',
      'No electrical or open wiring work',
    ],
  },
  {
    id: 'laundry-ironing',
    title: 'Laundry & Ironing',
    shortName: 'Laundry & Ironing',
    image: '/laundry_ironing_thumb.jpg',
    heading: 'Laundry & Ironing',
    included: [
      'Load and unload washing machine',
      'Hang clothes on drying rack',
      'Fold dry clothes and organize in wardrobe',
      'Steam / dry iron everyday garments',
      'Separate delicate fabrics',
    ],
    excluded: [
      'Heavy dry cleaning or blazer washing',
      'Curtain and heavy blanket hand-wash',
      'Chemical stain removal',
      'Industrial high-heat pressing',
      'Fabric repair or stitching',
    ],
  },
  {
    id: 'dusting-wiping',
    title: 'Dusting & wiping',
    shortName: 'Dusting & wiping',
    image: '/dusting_wiping_thumb.jpg',
    heading: 'Dusting & Wiping',
    included: [
      'Dust TV unit, tables, and cabinets',
      'Wipe window sills and reachable glass',
      'Dust lamps, picture frames, and decor',
      'Wipe doors, handles, and switchboards',
      'Organize tabletop clutter',
    ],
    excluded: [
      'Outside balcony ledge dusting at heights',
      'Antique or crystal chandelier restoration',
      'Paint peeling or wallpaper cleaning',
      'Cleaning inside locked private vaults',
      'High-pressure water jet spraying',
    ],
  },
  {
    id: 'and-more',
    title: 'and more...',
    shortName: 'and more...',
    image: '/and_more_thumb.jpg',
    heading: 'Custom Household Chores',
    included: [
      'Watering indoor balcony plants',
      'Kitchen cabinet surface wipe-down',
      'Shoe rack arrangement & entryway dusting',
      'Fridge shelf sorting and wipe',
      'Assisting with daily household organization',
    ],
    excluded: [
      'Pest control or fumigation tasks',
      'Plumbing, electrical or masonry repairs',
      'Driving or vehicle maintenance',
      'Handling high-value cash/jewelry',
      'Heavy lifting over 15 kg',
    ],
  },
];

export default function MaidsHouseHelpScope() {
  const [selectedId, setSelectedId] = useState('house-cleaning');

  const currentService =
    HOUSE_HELP_SERVICES.find((s) => s.id === selectedId) || HOUSE_HELP_SERVICES[0];

  return (
    <section className="maids-scope-section">
      <div className="maids-scope-container">
        {/* Main Section Headline */}
        <div className="maids-scope-header">
          <h2 className="maids-scope-title">
            One House Help Expert <span className="maids-scope-title-highlight">to do it all</span>
          </h2>
        </div>

        {/* 7 Interactive Thumbnails Row */}
        <div className="maids-scope-nav-row">
          {HOUSE_HELP_SERVICES.map((srv) => {
            const isActive = srv.id === selectedId;
            return (
              <button
                key={srv.id}
                type="button"
                className={`maids-scope-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedId(srv.id)}
              >
                <div className={`maids-scope-thumb-box ${isActive ? 'active' : ''}`}>
                  <img src={srv.image} alt={srv.title} className="maids-scope-thumb-img" />
                </div>
                <span className={`maids-scope-thumb-label ${isActive ? 'active' : ''}`}>
                  {srv.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Section */}
        <div className="maids-scope-detail-block">
          <h3 className="maids-scope-detail-title">
            What is included in <span className="maids-scope-title-highlight">{currentService.heading}?</span>
          </h3>

          {/* 2 Scope Columns (Included vs Excluded) */}
          <div className="maids-scope-cards-grid">
            {/* Left Card: Included (Trained to do) */}
            <div className="maids-scope-card included-card">
              <h4 className="maids-scope-card-header">The GateLink Expert is trained to</h4>
              <ul className="maids-scope-list">
                {currentService.included.map((item, idx) => (
                  <li key={idx} className="maids-scope-list-item">
                    <div className="maids-scope-icon-circle green">
                      <Check size={13} strokeWidth={3.5} color="#ffffff" />
                    </div>
                    <span className="maids-scope-item-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Card: Excluded (Not trained / out of scope) */}
            <div className="maids-scope-card excluded-card">
              <h4 className="maids-scope-card-header">The GateLink Expert is trained to</h4>
              <ul className="maids-scope-list">
                {currentService.excluded.map((item, idx) => (
                  <li key={idx} className="maids-scope-list-item">
                    <div className="maids-scope-icon-circle orange">
                      <X size={13} strokeWidth={3.5} color="#ffffff" />
                    </div>
                    <span className="maids-scope-item-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
