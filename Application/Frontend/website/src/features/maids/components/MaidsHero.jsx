import React from 'react';
import { Link } from 'react-router-dom';

export default function MaidsHero() {
  return (
    <section className="maids-cinematic-hero-section">
      {/* Top Banner Content Area */}
      <div className="maids-cinematic-hero-container">
        {/* Main Heading */}
        <h1 className="maids-cinematic-title">
          Get House Help in <span className="maids-cinematic-pink-highlight">10 min</span>
        </h1>

        {/* CTA Button */}
        <div className="maids-cinematic-cta-wrapper">
          <Link
            to="/download"
            className="maids-cinematic-btn-pink"
          >
            <span>Download Now</span>
          </Link>
        </div>

        {/* Team Image Visual */}
        <div className="maids-cinematic-image-wrapper">
          <img 
            src="/maids_hero_banner.jpg" 
            alt="GateLink Verified House Help and Salon Professionals" 
            className="maids-cinematic-team-img"
          />
          <div className="maids-cinematic-top-fade" />
          <div className="maids-cinematic-bottom-fade" />
        </div>
      </div>

      {/* Bottom Purple Ribbon Banner (Matching Reference) */}
      <div className="maids-cinematic-bottom-ribbon">
        <div className="maids-cinematic-ribbon-container">
          <p className="maids-cinematic-ribbon-text">
            We’ve landed the <span className="maids-cinematic-ribbon-highlight">BIGGEST</span> job ever!
          </p>
        </div>
      </div>
    </section>
  );
}
