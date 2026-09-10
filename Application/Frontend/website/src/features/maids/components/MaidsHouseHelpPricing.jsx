import React from 'react';
import { Clock, Calendar, Check, Smartphone, ArrowRight } from 'lucide-react';

export default function MaidsHouseHelpPricing({ onOpenBooking }) {
  const pricingFeatures = [
    {
      id: 'flexible-pricing',
      icon: Clock,
      title: 'Flexible Pricing',
      subtitle: 'Pay only for the hours you need, with complete pricing transparency.',
      checklist: [
        'No hidden charges, what you see is what you pay',
        'Simple hourly model, book 1hr, 2hr, or more',
        'Tasks include cleaning, dusting, mopping & more',
        'Scope depends on time booked & customer preference',
        'Cancel or reschedule anytime before the booking',
      ],
    },
    {
      id: 'instant-schedule',
      icon: Calendar,
      title: 'Instant & Schedule',
      subtitle: 'No lock-ins, no hidden fees. Pay only for the hours you book.',
      checklist: [
        'Instant booking with 10-minute doorstep arrival',
        'Same-day service & on-demand slots',
        'Scheduled slots & flexible morning/evening timing',
        'Weekly or monthly recurring options',
        'Manage everything seamlessly through the GateLink app',
      ],
    },
  ];

  return (
    <section className="maids-hourly-pricing-section">
      <div className="maids-hourly-pricing-container">
        {/* Section Heading */}
        <div className="maids-hourly-pricing-header">
          <h2 className="maids-hourly-pricing-title">
            Transparent hourly pricing for <span className="maids-hourly-pricing-highlight">House Help</span>
          </h2>
        </div>

        {/* 2 Main Cards Grid */}
        <div className="maids-hourly-cards-grid">
          {pricingFeatures.map((feat) => {
            const IconComp = feat.icon;
            return (
              <div key={feat.id} className="maids-hourly-card">
                {/* Card Top Info */}
                <div className="maids-hourly-card-top">
                  <div className="maids-hourly-icon-box">
                    <IconComp size={26} color="#7C3AED" strokeWidth={2.2} />
                  </div>
                  <div className="maids-hourly-card-meta">
                    <h3 className="maids-hourly-card-title">{feat.title}</h3>
                    <p className="maids-hourly-card-sub">{feat.subtitle}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="maids-hourly-card-divider" />

                {/* Checklist */}
                <ul className="maids-hourly-checklist">
                  {feat.checklist.map((item, idx) => (
                    <li key={idx} className="maids-hourly-check-item">
                      <div className="maids-hourly-check-circle">
                        <Check size={13} strokeWidth={3.5} color="#ffffff" />
                      </div>
                      <span className="maids-hourly-check-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Book trusted help in minutes */}
        <div className="maids-hourly-bottom-banner">
          <div className="maids-hourly-banner-left">
            <div className="maids-hourly-banner-icon-box">
              <Smartphone size={24} color="#7C3AED" strokeWidth={2.2} />
            </div>
            <div className="maids-hourly-banner-text">
              <h4 className="maids-hourly-banner-title">Book trusted help in minutes</h4>
              <p className="maids-hourly-banner-desc">Download the GateLink app and get started today</p>
            </div>
          </div>

          <button
            type="button"
            className="maids-hourly-banner-btn"
            onClick={() => onOpenBooking && onOpenBooking({ category: 'House Help' })}
          >
            <span>Download Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
