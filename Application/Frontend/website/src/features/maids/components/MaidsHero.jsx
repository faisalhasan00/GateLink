import React from 'react';
import { Link } from 'react-router-dom';

export default function MaidsHero() {
  return (
    <section className="maids-cinematic-hero-section">
      {/* Full-Bleed Background Container */}
      <div className="maids-cinematic-hero-bg">
        {/* Subtle Top Gradient for crystal clear text readability */}
        <div className="maids-cinematic-top-gradient" />

        {/* Hero Top Content Layer (Headline + Button) */}
        <div className="maids-cinematic-hero-content">
          <h1 className="maids-cinematic-title">
            Get House Help in <span className="maids-cinematic-purple-highlight">10 min</span>
          </h1>

          <div className="maids-cinematic-cta-wrapper">
            <Link
              to="/download"
              className="maids-cinematic-btn-purple"
            >
              <span>Download Now</span>
            </Link>
          </div>
        </div>

        {/* Bottom Purple Ribbon Banner (Directly on Bottom Edge) */}
        <div className="maids-cinematic-bottom-ribbon">
          <div className="maids-cinematic-ribbon-container">
            <p className="maids-cinematic-ribbon-text">
              We’ve landed the <span className="maids-cinematic-ribbon-highlight">BIGGEST</span> job ever!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
