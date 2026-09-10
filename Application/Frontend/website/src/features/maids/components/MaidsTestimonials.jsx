import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS_ROW_1 = [
  {
    id: 1,
    name: 'Mayank S.',
    location: 'Gachibowli, Hyderabad',
    rating: 5,
    text: 'She is awesome! The dedication in working—if she cleans it means spotless clean. We are too impressed with GateLink verified staff.',
  },
  {
    id: 2,
    name: 'Viraj P.',
    location: 'Hitec City, Hyderabad',
    rating: 5,
    text: 'We had a very good experience, Laxmi was quick and very flexible to adjust the kitchen work schedule even while our kids were playing.',
  },
  {
    id: 3,
    name: 'Saumya K.',
    location: 'Kondapur, Hyderabad',
    rating: 5,
    text: 'She is very good, well-mannered and takes full ownership. Did such an amazing job with deep dusting and utensils. Kudos to the GateLink team!',
  },
  {
    id: 4,
    name: 'Ananya Reddy',
    location: 'Jubilee Hills, Hyderabad',
    rating: 5,
    text: 'Pre-approved digital gate pass makes daily entry completely effortless. Never have to answer gate calls at 7 AM anymore.',
  },
];

const REVIEWS_ROW_2 = [
  {
    id: 5,
    name: 'Deepak V.',
    location: 'Kokapet, Hyderabad',
    rating: 5,
    text: 'Our cook arrived in 20 minutes when our regular helper was on sudden leave. Hot homestyle phulkas and curry for dinner. Lifesaver!',
  },
  {
    id: 6,
    name: 'Pooja Agarwal',
    location: 'Financial District, Hyderabad',
    rating: 5,
    text: 'She is kind, polite, and has performed her duties in a professional manner. Carried out spotless mopping and organized our shelves.',
  },
  {
    id: 7,
    name: 'Karthik Rao',
    location: 'Banjara Hills, Hyderabad',
    rating: 5,
    text: 'She was very quick with everything and did an amazing job. Loved her attitude and thorough background verification badge.',
  },
  {
    id: 8,
    name: 'Reena Menon',
    location: 'Tellapur, Hyderabad',
    rating: 5,
    text: 'Super punctual! Polite, wore clean uniform & hairnet. Cleaned up the kitchen platform thoroughly before leaving. 5 stars for GateLink!',
  },
];

export default function MaidsTestimonials() {
  return (
    <section className="maids-reviews-section">
      <div className="maids-reviews-container">
        {/* Headline matching reference */}
        <div className="maids-reviews-header">
          <h2 className="maids-reviews-title">
            Rated <span className="maids-reviews-highlight">4.8+</span> by{' '}
            <span className="maids-reviews-highlight">240,000+</span> Families
          </h2>
        </div>

        {/* Reviews Marquee Track 1 (Left to Right / Normal) */}
        <div className="maids-reviews-track-wrapper">
          <div className="maids-reviews-track track-1">
            {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((rev, idx) => (
              <div key={`r1-${idx}`} className="maids-review-card">
                {/* 5 Purple Stars */}
                <div className="maids-review-stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#7C3AED" color="#7C3AED" />
                  ))}
                </div>

                {/* Review Body */}
                <p className="maids-review-text">"{rev.text}"</p>

                {/* Author & Location */}
                <div className="maids-review-author-box">
                  <span className="maids-review-author-name">{rev.name}</span>
                  <span className="maids-review-author-loc">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Marquee Track 2 (Reverse / Staggered) */}
        <div className="maids-reviews-track-wrapper">
          <div className="maids-reviews-track track-2">
            {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((rev, idx) => (
              <div key={`r2-${idx}`} className="maids-review-card">
                {/* 5 Purple Stars */}
                <div className="maids-review-stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#7C3AED" color="#7C3AED" />
                  ))}
                </div>

                {/* Review Body */}
                <p className="maids-review-text">"{rev.text}"</p>

                {/* Author & Location */}
                <div className="maids-review-author-box">
                  <span className="maids-review-author-name">{rev.name}</span>
                  <span className="maids-review-author-loc">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
