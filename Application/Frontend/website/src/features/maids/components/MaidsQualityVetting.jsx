import React from 'react';
import { Star, Check, ShieldCheck, Award, Sparkles, UserCheck, FileCheck } from 'lucide-react';

export default function MaidsQualityVetting() {
  return (
    <section id="quality" className="maids-vetted-section">
      <div className="maids-vetted-container">
        {/* Section Headline */}
        <div className="maids-vetted-header">
          <h2 className="maids-vetted-title">
            Experts Vetted for <span className="maids-vetted-title-highlight">Quality</span>
          </h2>
        </div>

        {/* 3 Quality Cards Grid */}
        <div className="maids-vetted-grid">
          {/* Card 1: Top Rated Experts */}
          <div className="maids-vetted-card">
            <h3 className="maids-vetted-card-title">Top Rated Experts</h3>

            <div className="maids-vetted-card-content card-ratings-bg">
              {/* Back Floating Profile Card */}
              <div className="maids-rated-floating-card back-card">
                <div className="maids-rated-avatar-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                    alt="Sweta Patil"
                    className="maids-rated-avatar"
                  />
                </div>
                <div className="maids-rated-info">
                  <span className="maids-rated-name">Sweta Patil</span>
                  <div className="maids-rated-star-badge">
                    <Star size={12} fill="#16A34A" color="#16A34A" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>

              {/* Front Floating Profile Card */}
              <div className="maids-rated-floating-card front-card">
                <div className="maids-rated-card-top-row">
                  <div className="maids-rated-avatar-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
                      alt="Akshaya Singh"
                      className="maids-rated-avatar active"
                    />
                  </div>
                  <div className="maids-rated-info">
                    <span className="maids-rated-name">Akshaya Singh</span>
                    <div className="maids-rated-star-badge">
                      <Star size={12} fill="#16A34A" color="#16A34A" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>

                {/* Skeleton placeholders */}
                <div className="maids-rated-skeleton-bars">
                  <div className="maids-skeleton-line long" />
                  <div className="maids-skeleton-line short" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Professionally Trained */}
          <div className="maids-vetted-card">
            <h3 className="maids-vetted-card-title">Professionally Trained</h3>

            <div className="maids-vetted-card-content card-training-bg">
              {/* Central Rosette Badge */}
              <div className="maids-training-rosette">
                <div className="maids-rosette-icon-box">
                  <Check size={28} strokeWidth={3} color="#ffffff" />
                </div>
              </div>

              <div className="maids-training-label">
                Training Completed<br />Successfully!
              </div>

              {/* 4 Mini Module Thumbnails */}
              <div className="maids-training-modules-row">
                <div className="maids-training-thumb-item" title="Double Mopping Standard">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=120&q=80"
                    alt="Floor Mopping"
                    className="maids-training-thumb-img"
                  />
                  <span className="maids-training-thumb-tag">Mopping</span>
                </div>
                <div className="maids-training-thumb-item" title="Utensil Sanitization">
                  <img
                    src="https://images.unsplash.com/photo-1585837575652-267c041d77d4?auto=format&fit=crop&w=120&q=80"
                    alt="Utensil Wash"
                    className="maids-training-thumb-img"
                  />
                  <span className="maids-training-thumb-tag">Dishes</span>
                </div>
                <div className="maids-training-thumb-item" title="Glassware & Deep Cleaning">
                  <img
                    src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=120&q=80"
                    alt="Surface Dusting"
                    className="maids-training-thumb-img"
                  />
                  <span className="maids-training-thumb-tag">Hygiene</span>
                </div>
                <div className="maids-training-thumb-item" title="Standardized Uniform">
                  <img
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=120&q=80"
                    alt="Linen & Care"
                    className="maids-training-thumb-img"
                  />
                  <span className="maids-training-thumb-tag">Protocol</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Background Verified */}
          <div className="maids-vetted-card">
            <h3 className="maids-vetted-card-title">Background verified</h3>

            <div className="maids-vetted-card-content card-verified-bg">
              <div className="maids-verification-flow">
                {/* Left: Candidate ID checks */}
                <div className="maids-verified-left-col">
                  <div className="maids-id-avatar-slot">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
                      alt="Aadhaar ID"
                      className="maids-id-avatar greyscale"
                    />
                    <span className="maids-id-node-line" />
                  </div>
                  <div className="maids-id-avatar-slot">
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80"
                      alt="Police Check"
                      className="maids-id-avatar greyscale"
                    />
                    <span className="maids-id-node-line center" />
                  </div>
                  <div className="maids-id-avatar-slot">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                      alt="Reference Audit"
                      className="maids-id-avatar greyscale"
                    />
                    <span className="maids-id-node-line" />
                  </div>
                </div>

                {/* Center: Purple Shield Badge */}
                <div className="maids-verified-shield-wrapper">
                  <div className="maids-shield-badge">
                    <div className="maids-shield-check-bubble">
                      <Check size={16} strokeWidth={3.5} color="#7C3AED" />
                    </div>
                    <span className="maids-shield-brand">GateLink</span>
                    <span className="maids-shield-sub">VERIFIED</span>
                  </div>
                  <div className="maids-shield-connect-line" />
                </div>

                {/* Right: Final Cleared Staff Avatar */}
                <div className="maids-verified-right-col">
                  <div className="maids-cleared-avatar-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&q=80"
                      alt="Verified Helper"
                      className="maids-cleared-avatar"
                    />
                    <div className="maids-cleared-badge">
                      <Check size={11} strokeWidth={3.5} color="#ffffff" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
