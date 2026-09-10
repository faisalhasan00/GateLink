import React from 'react';

export default function CookOneCookScope() {
  return (
    <section className="cook-bento-section">
      <div className="cook-bento-container">
        {/* Section Title */}
        <div className="cook-bento-header">
          <h2 className="cook-bento-title">
            One Cook <span className="cook-bento-title-highlight">Who Does it All</span>
          </h2>
        </div>

        {/* 3-Part Bento Grid Showcase */}
        <div className="cook-bento-grid">
          {/* Main Left Card: Fresh Gourmet Cooking on Sizzling Wok */}
          <div className="cook-bento-card large-card">
            <img 
              src="/cook_wok_sizzling.jpg" 
              alt="Fresh Home Cooking on Sizzling Wok" 
              className="cook-bento-img"
            />
            <div className="cook-bento-overlay" />
            <div className="cook-bento-card-content">
              <span className="cook-bento-badge">Fresh &amp; Healthy</span>
              <h3 className="cook-bento-card-title">Hot, Wholesome Home Meals</h3>
              <p className="cook-bento-card-sub">Prepared freshly in your cookware with your customized oil, salt, and spices preference.</p>
            </div>
          </div>

          {/* Right Column (2 Stacked Cards) */}
          <div className="cook-bento-right-stack">
            {/* Top Card: Meal Preparation */}
            <div className="cook-bento-card small-card">
              <img 
                src="/meal_prep_thumb.jpg" 
                alt="Meal Preparation and Chopping" 
                className="cook-bento-img"
              />
              <div className="cook-bento-overlay" />
              <div className="cook-bento-card-content">
                <h3 className="cook-bento-card-title">Meal Preparation</h3>
                <p className="cook-bento-card-sub">Hygienic chopping, batter kneading, marination, and prepped ingredients ready to cook.</p>
              </div>
            </div>

            {/* Bottom Card: Post-Cooking Cleanup */}
            <div className="cook-bento-card small-card">
              <img 
                src="/cook_utensils_clean_thumb.jpg" 
                alt="Cooking Cleanup and Utensil Sanitization" 
                className="cook-bento-img"
              />
              <div className="cook-bento-overlay" />
              <div className="cook-bento-card-content">
                <h3 className="cook-bento-card-title">Cooking Cleanup Included</h3>
                <p className="cook-bento-card-sub">Leaves your slab, stove top, and cooking vessels sparkling clean after every single session.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
