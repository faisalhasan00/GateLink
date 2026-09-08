import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function InteriorsHyderabadReviews({ onOpenConsultation }) {
  const reviews = [
    {
      id: 1,
      initial: 'P',
      name: 'Priti Baheti',
      society: 'My Home Bhooja, Hyderabad',
      time: '2 months ago',
      rating: 5,
      content: 'Visited GateLink Interiors for an initial consultation, and it was a great experience. The team was welcoming, professional, and took the time to understand my requirements and preferences. They explained the 3D layouts, material warranties, and factory pricing in complete detail...',
      fullContent: 'Visited GateLink Interiors for an initial consultation, and it was a great experience. The team was welcoming, professional, and took the time to understand my requirements and preferences. They explained the 3D layouts, material warranties, and factory pricing in complete detail. The 45-day handover guarantee was delivered on the exact promised date!'
    },
    {
      id: 2,
      initial: 'K',
      name: 'Kiran Varma',
      society: 'Aparna Serene Park, Hyderabad',
      time: '1 month ago',
      rating: 5,
      content: 'Transformed our 3BHK flat in Gachibowli with 20% extra storage and immaculate acrylic kitchen finish. The pre-cleared society gate passes saved us from repetitive security hassles and RWA permissions. Truly turnkey execution with zero hidden costs...',
      fullContent: 'Transformed our 3BHK flat in Gachibowli with 20% extra storage and immaculate acrylic kitchen finish. The pre-cleared society gate passes saved us from repetitive security hassles and RWA permissions. Truly turnkey execution with zero hidden costs. Highly recommend their Hyderabad architect team!'
    },
    {
      id: 3,
      initial: 'N',
      name: 'Nitish Singh',
      society: 'Jayabheri The Summit, Hyderabad',
      time: '2 months ago',
      rating: 5,
      content: 'Very nice experience. We consulted for our gated community flat interior needs, and Ms. Nidhi walked us through all the design solutions and modular finishes in detail. 10-year warranty documentation was provided on day one. It was a wonderful experience...',
      fullContent: 'Very nice experience. We consulted for our gated community flat interior needs, and Ms. Nidhi walked us through all the design solutions and modular finishes in detail. 10-year warranty documentation was provided on day one. It was a wonderful experience from 3D design to final handover.'
    },
    {
      id: 4,
      initial: 'R',
      name: 'Rajeshwari Rao',
      society: 'Rajapushpa Atria, Hyderabad',
      time: '3 weeks ago',
      rating: 5,
      content: 'From the modular kitchen with pantry pullout to our custom pooja unit, every element was crafted to perfection. The senior design team visited our flat and ensured 146 quality checkpoints before key handover...',
      fullContent: 'From the modular kitchen with pantry pullout to our custom pooja unit, every element was crafted to perfection. The senior design team visited our flat and ensured 146 quality checkpoints before key handover. Outstanding service!'
    }
  ];

  const [expandedId, setExpandedId] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Get 3 visible reviews circular
  const visibleReviews = [
    reviews[startIndex],
    reviews[(startIndex + 1) % reviews.length],
    reviews[(startIndex + 2) % reviews.length]
  ];

  return (
    <section className="interiors-reviews-showcase-section">
      <div className="interiors-reviews-showcase-container">
        {/* Section Title */}
        <div className="interiors-reviews-header">
          <h2 className="interiors-reviews-title">
            What <span className="interiors-highlight-city">Hyderabad</span> homeowners are saying about <span className="interiors-highlight-brand">GateLink Interiors</span>
          </h2>
        </div>

        {/* Top Google & Stats Trust Card */}
        <div className="interiors-reviews-stats-card">
          {/* Google Rating Block */}
          <div className="interiors-reviews-google-block">
            <div className="interiors-google-logo-wrapper">
              <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
            <div className="interiors-google-rating-info">
              <div className="interiors-google-score-row">
                <span className="interiors-google-score">4.8</span>
                <div className="interiors-google-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
              </div>
              <div className="interiors-google-review-count">
                <span>(2000+ Google</span>
                <CheckCircle2 size={14} className="interiors-verified-check" />
                <span>Hyderabad reviews)</span>
              </div>
            </div>
          </div>

          <div className="interiors-stats-divider" />

          {/* Metric 2: Homeowners */}
          <div className="interiors-stat-metric-block">
            <div className="interiors-stat-number">
              15,000 <span className="interiors-stat-plus">+</span>
            </div>
            <div className="interiors-stat-label">Homeowners</div>
          </div>

          <div className="interiors-stats-divider" />

          {/* Metric 3: Years Experience */}
          <div className="interiors-stat-metric-block">
            <div className="interiors-stat-number">
              11 <span className="interiors-stat-plus">+</span>
            </div>
            <div className="interiors-stat-label">Years Experience</div>
          </div>
        </div>

        {/* Reviews Cards Carousel */}
        <div className="interiors-reviews-carousel-wrapper">
          <button
            type="button"
            className="interiors-reviews-nav-btn prev"
            onClick={handlePrev}
            aria-label="Previous customer review"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="interiors-reviews-grid">
            {visibleReviews.map((review) => {
              const isExpanded = expandedId === review.id;
              return (
                <div key={review.id} className="interiors-review-card">
                  {/* Card Header */}
                  <div className="interiors-review-card-header">
                    <div className="interiors-review-avatar">
                      {review.initial}
                    </div>
                    <div className="interiors-review-user-info">
                      <h4 className="interiors-review-author-name">{review.name}</h4>
                      <div className="interiors-review-stars-row">
                        <div className="interiors-review-stars">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                          ))}
                        </div>
                      </div>
                      <span className="interiors-review-time-stamp">{review.time}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <p className="interiors-review-text">
                    {isExpanded ? review.fullContent : review.content}
                  </p>

                  {/* Read More / Read Less Toggle */}
                  <button
                    type="button"
                    className="interiors-review-readmore-btn"
                    onClick={() => setExpandedId(isExpanded ? null : review.id)}
                  >
                    <span>{isExpanded ? 'Read Less ‹' : 'Read More ›'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="interiors-reviews-nav-btn next"
            onClick={handleNext}
            aria-label="Next customer review"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
