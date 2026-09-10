import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, CreditCard, Star } from 'lucide-react';

export default function MaidsCategoryHero({ 
  categoryTitle = 'House Help',
  city = 'India',
  subtitle = 'Book House Help online and get a verified Expert at your door in 10 minutes.',
  image = '/maids_house_help_hero.jpg',
  onOpenBooking
}) {
  return (
    <>
      <section className="maids-cat-hero-section">
        <div className="maids-cat-hero-container">
          {/* Left Column: Text & CTA */}
          <div className="maids-cat-hero-left">
            {/* Breadcrumbs */}
            <nav className="maids-cat-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/" className="maids-cat-bc-link">Home</Link>
              <span className="maids-cat-bc-separator">/</span>
              <Link to="/maids" className="maids-cat-bc-link">Maids</Link>
              <span className="maids-cat-bc-separator">/</span>
              <span className="maids-cat-bc-current">{categoryTitle}</span>
            </nav>

            {/* Headline */}
            <h1 className="maids-cat-hero-title">
              <span className="maids-cat-hero-title-highlight">{categoryTitle}</span> in {city}
            </h1>

            {/* Subtitle */}
            <p className="maids-cat-hero-subtitle">
              {subtitle}
            </p>

            {/* CTA Button */}
            <div className="maids-cat-cta-wrapper">
              <button 
                type="button" 
                className="maids-cat-download-btn"
                onClick={() => onOpenBooking && onOpenBooking({ category: categoryTitle })}
              >
                Download Now
              </button>
            </div>

            {/* Social Trust Widget */}
            <div className="maids-cat-trust-pill">
              <div className="maids-cat-avatars-group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80"
                  alt="Customer"
                  className="maids-cat-avatar"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80"
                  alt="Customer"
                  className="maids-cat-avatar overlap"
                />
              </div>

              <div className="maids-cat-trust-text">
                <span className="maids-cat-trust-label">Trusted by</span>
                <strong className="maids-cat-trust-count">15L+ Homes</strong>
              </div>

              <span className="maids-cat-trust-dot">•</span>

              <div className="maids-cat-trust-stars-row">
                <div className="maids-cat-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#7C3AED" color="#7C3AED" />
                  ))}
                </div>
                <strong className="maids-cat-ratings-label">Ratings</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image */}
          <div className="maids-cat-hero-right">
            <div className="maids-cat-image-wrapper">
              <img 
                src={image} 
                alt={`${categoryTitle} in ${city}`} 
                className="maids-cat-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dark Bottom Strip with 3 Key Guarantees */}
      <section className="maids-cat-strip-section">
        <div className="maids-cat-strip-container">
          <div className="maids-cat-strip-item">
            <div className="maids-cat-strip-icon-box">
              <ShieldCheck size={26} color="#7C3AED" />
            </div>
            <span className="maids-cat-strip-text">Verified &amp; Trained Experts</span>
          </div>

          <div className="maids-cat-strip-item">
            <div className="maids-cat-strip-icon-box">
              <Users size={26} color="#7C3AED" />
            </div>
            <span className="maids-cat-strip-text">Trusted By 15L+ Families</span>
          </div>

          <div className="maids-cat-strip-item">
            <div className="maids-cat-strip-icon-box">
              <CreditCard size={26} color="#7C3AED" />
            </div>
            <span className="maids-cat-strip-text">No lock-ins, No hidden fees</span>
          </div>
        </div>
      </section>
    </>
  );
}
