import React from 'react';
import { Sparkles, Utensils, Brush, ShowerHead, Scissors, Baby, ArrowRight, Check } from 'lucide-react';

const SERVICES = [
  {
    id: 'cleaning',
    icon: Brush,
    title: 'Daily House Cleaning & Mopping',
    desc: 'Thorough floor brooming, double mopping, surface dusting, and trash disposal.',
    price: 'From ₹99 / visit',
    recurring: '₹2,199 / month',
    features: ['Microfiber dusting', 'Floor disinfectant included', '15-min instant arrival', '30-min backup guarantee'],
  },
  {
    id: 'dishes',
    icon: Utensils,
    title: 'Utensils & Dishwashing',
    desc: 'Sparkling dish scrub, sink sanitization, and organized shelf placement.',
    price: 'From ₹89 / visit',
    recurring: '₹1,499 / month',
    features: ['Hot water grease removal', 'Sink & drain cleaning', 'Delicate glassware care', 'Zero breakage liability'],
  },
  {
    id: 'cooking',
    icon: Sparkles,
    title: 'Home Cook & Meal Prep',
    desc: 'Fresh homestyle cooking (North / South Indian, Jain, diabetic & diet-friendly menus).',
    price: 'From ₹149 / meal',
    recurring: '₹3,499 / month',
    features: ['Customized spice levels', 'Roti making & sabzi', 'Kitchen platform wipedown', 'Hygiene hairnets worn'],
  },
  {
    id: 'deep-clean',
    icon: ShowerHead,
    title: 'Bathroom & Kitchen Deep Clean',
    desc: 'Intensive hard water scale removal, tile grout scrubbing, and 99.9% bacterial sanitization.',
    price: 'From ₹399 / room',
    recurring: 'Monthly add-on available',
    features: ['Acid-free chemical wash', 'Mirror & fitting buffing', 'Exhaust fan de-greasing', '100% odor neutralization'],
  },
  {
    id: 'salon',
    icon: Scissors,
    title: 'At-Home Salon & Beautician',
    desc: 'Premium salon services in the privacy of your home by certified beauticians.',
    price: 'Packages from ₹499',
    recurring: 'Weekend slots available',
    features: ['Single-use disposable kits', 'O3+ & RICA premium wax', 'Pedicure & Manicure', 'Trained female experts'],
  },
  {
    id: 'baby-elder',
    icon: Baby,
    title: 'Babysitter & Senior Care',
    desc: 'Compassionate, background-checked caretakers for children and elderly parents.',
    price: 'From ₹199 / hour',
    recurring: '₹7,999 / month',
    features: ['Police verified credentials', 'Medication time logs', 'Engaging child activities', 'Emergency SOS enabled'],
  },
];

export default function MaidsServiceCatalog({ onOpenBooking }) {
  return (
    <section id="services" className="maids-services-section">
      <div className="maids-section-header">
        <div className="maids-badge">
          <Sparkles size={14} />
          <span>Complete Household Care</span>
        </div>
        <h2 className="maids-section-title">
          Explore On-Demand Society Services
        </h2>
        <p className="maids-section-subtitle">
          Book on-demand in 15 minutes or set up a recurring monthly subscription with zero agency markups.
        </p>
      </div>

      <div className="services-grid">
        {SERVICES.map((srv) => {
          const IconComponent = srv.icon;
          return (
            <div key={srv.id} className="service-card">
              <div className="service-icon-box">
                <IconComponent size={26} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1C1917', margin: '0 0 6px' }}>
                {srv.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#78716C', lineHeight: 1.5, margin: '0 0 12px', flex: 1 }}>
                {srv.desc}
              </p>

              <div className="service-price-tag">
                {srv.price}
                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginTop: '2px' }}>
                  Subscription: {srv.recurring}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                {srv.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#44403C' }}>
                    <Check size={14} color="#059669" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenBooking && onOpenBooking({ service: srv.title })}
                className="maids-btn-secondary"
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.9rem' }}
              >
                <span>Book This Service</span>
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
