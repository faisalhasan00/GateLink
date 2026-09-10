import React from 'react';

const HYGIENE_PILLARS = [
  {
    id: 'handwash',
    title: 'Mandatory handwash',
    image: '/cook_handwash_thumb.jpg',
    desc: 'Compulsory soap lather hand sanitization before touching any utensils or food items.',
  },
  {
    id: 'stove-cleaning',
    title: 'Slab & stove cleaning',
    image: '/cook_stove_cleaning_thumb.jpg',
    desc: 'Microfibre wiping of kitchen counter, oil splatter degreasing, and stove surface polish.',
  },
  {
    id: 'veg-washing',
    title: 'Vegetable washing',
    image: '/cook_veg_wash_thumb.jpg',
    desc: 'Thorough colander rinsing of fresh greens, vegetables, and pulses in clean running water.',
  },
  {
    id: 'utensils-cleaning',
    title: 'Cleaning cooking utensils',
    image: '/cook_utensils_clean_thumb.jpg',
    desc: 'Scrubbing and drying of all pots, pans, lids, and spatulas used during the meal session.',
  },
];

export default function CookKitchenHygiene() {
  return (
    <section className="cook-hygiene-section">
      <div className="cook-hygiene-container">
        {/* Section Heading */}
        <div className="cook-hygiene-header">
          <h2 className="cook-hygiene-title">
            We Treat Your <span className="cook-hygiene-title-highlight">Kitchen Like Ours</span>
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="cook-hygiene-grid">
          {HYGIENE_PILLARS.map((item) => (
            <div key={item.id} className="cook-hygiene-card">
              <div className="cook-hygiene-img-wrapper">
                <img src={item.image} alt={item.title} className="cook-hygiene-img" />
              </div>
              <div className="cook-hygiene-card-body">
                <h3 className="cook-hygiene-card-title">{item.title}</h3>
                <p className="cook-hygiene-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
