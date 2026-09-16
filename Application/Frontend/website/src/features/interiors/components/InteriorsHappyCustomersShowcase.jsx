import React from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function InteriorsHappyCustomersShowcase({ onOpenConsultation }) {
  const customerStories = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      quote: 'Sandeep made the closure process incredibly smooth! His quick problem-solving skills truly stand out. Keep up the great work! Thank you for your fantastic support!',
      author: 'Phanidhar Gajawada, Hyderabad',
      alt: 'Phanidhar Gajawada luxury bedroom interior in Hyderabad'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
      quote: "We were impressed by GateLink's quality and designs! Designer Mrudula was exceptional, guiding us throughout. Special thanks to Project Managers Ajay and Sandeep for their support. A great team!",
      author: 'Divya Vinod, Hyderabad',
      alt: 'Divya Vinod modular kitchen interior project in Hyderabad'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
      quote: 'GateLink has a dedicated team with great manners and intent! They listened to our feedback and provided excellent support throughout our home interior project. Highly commendable service!',
      author: 'Akshay Prabhu, Hyderabad',
      alt: 'Akshay Prabhu contemporary living room interior in Hyderabad'
    }
  ];

  return (
    <section className="interiors-happy-customers-section">
      <div className="interiors-happy-customers-container">
        {/* Section Header */}
        <div className="interiors-happy-customers-header">
          <h2 className="interiors-happy-customers-title">
            Hyderabadis Say We Are The Best Interior Design Company: Our Happy Customers
          </h2>
        </div>

        {/* Carousel / Grid Wrapper with Side Chevrons */}
        <div className="interiors-happy-customers-carousel-wrapper">
          <button
            type="button"
            className="interiors-happy-customers-nav-btn prev"
            aria-label="Previous customer story"
          >
            <ChevronLeft size={24} />
          </button>

          {/* 3-Column Testimonial Cards Grid */}
          <div className="interiors-happy-customers-grid">
            {customerStories.map((story) => (
              <div 
                key={story.id} 
                className="interiors-happy-customer-card"
                onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Customer Testimonial', story: story.author })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onOpenConsultation && onOpenConsultation({ space: 'Customer Testimonial', story: story.author });
                  }
                }}
              >
                {/* Card Top Media Image */}
                <div className="interiors-happy-customer-image-box">
                  <img 
                    src={story.image} 
                    alt={story.alt} 
                    className="interiors-happy-customer-image"
                    loading="lazy"
                  />
                </div>

                {/* Card Bottom Quote Box */}
                <div className="interiors-happy-customer-quote-box">
                  <Quote size={22} className="interiors-happy-quote-icon" />
                  <p className="interiors-happy-customer-quote-text">
                    {story.quote}
                  </p>
                  <h4 className="interiors-happy-customer-author">
                    {story.author}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="interiors-happy-customers-nav-btn next"
            aria-label="Next customer story"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Centered Action Link Matching Reference */}
        <div className="interiors-happy-customers-cta-row">
          <button
            type="button"
            className="interiors-happy-customers-link-teal"
            onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Projects Portfolio', topic: 'Completed Projects' })}
          >
            <span>View Our Completed Projects ›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
