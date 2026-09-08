import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const HYDERABAD_FAQS = [
  {
    id: 1,
    q: 'Who are the top interior designers in Hyderabad?',
    a: 'GateLink Interiors is one of the top-rated home interior design studios in Hyderabad, specializing in premium turnkey home transformations for luxury apartments and gated communities across Hitec City, Gachibowli, Kokapet, Kondapur, and Financial District. We offer 45-day guaranteed handovers, 10-year warranties, and seamless society gate approvals.'
  },
  {
    id: 2,
    q: 'Why should you hire an interior designer in Hyderabad?',
    a: 'Hiring a professional interior designer ensures optimal space utilization, cohesive aesthetics, precision German hardware, and adherence to society by-laws. With GateLink Interiors, you get factory-crafted modular woodwork that eliminates noise and dust in your community, coupled with transparent milestone-based pricing.'
  },
  {
    id: 3,
    q: 'How much do interior designers charge in Hyderabad?',
    a: 'In Hyderabad, basic interior design packages range between ₹3.5 Lakh to ₹6 Lakh for 2BHKs, and ₹6 Lakh to ₹14 Lakh for 3BHKs/4BHKs depending on finishes (Laminate, Acrylic, or PU lacquer), false ceiling complexity, and storage customizations. GateLink provides fixed upfront quotes with zero hidden charges.'
  },
  {
    id: 4,
    q: 'What is the cost of 2BHK interior design in Hyderabad?',
    a: 'A complete 2BHK interior package (modular kitchen, master wardrobe, guest wardrobe, TV unit, foyer unit, and basic lighting) typically ranges from ₹3.8 Lakh to ₹6.5 Lakh with Boiling Waterproof (BWP) plywood and soft-close German fittings.'
  },
  {
    id: 5,
    q: 'What are the latest interior design trends in Hyderabad?',
    a: 'Current trends in Hyderabad include fluted wall panelling with hidden profile lighting, handle-less acrylic modular kitchens with quartz waterfall countertops, walk-in closets with tinted glass wardrobes, biophilic balconies, and smart home automation.'
  },
  {
    id: 6,
    q: 'What is the most popular interior design style in Hyderabad?',
    a: 'Modern Contemporary and Neo-Classical Warm Minimalist styles are the most requested in Hyderabad homes. Homeowners prefer neutral warm palettes (beige, greige, champagne gold accents) paired with rich wood textures and ambient cove lighting.'
  },
  {
    id: 7,
    q: 'Does GateLink Interiors design interiors for villas and independent homes in Hyderabad?',
    a: 'Yes, our bespoke Villa & Duplex division caters to independent homes and gated villa communities across Kokapet, Jubilee Hills, Tellapur, and Mokila, delivering end-to-end customized woodwork, grand double-height foyer panelling, home theatre acoustics, and terrace pergolas.'
  },
  {
    id: 8,
    q: 'Do you have experience designing interiors for newly handed-over apartments in Hyderabad?',
    a: 'Absolutely. We have successfully executed 500+ projects in leading societies including My Home Bhooja, Aparna Serene Park, Rajapushpa Atria, Prestige High Fields, and Jayabheri The Peak, with complete familiarity with RWA delivery guidelines.'
  },
  {
    id: 9,
    q: 'What is included in GateLink Interiors\'s home interior package for Hyderabad homes?',
    a: 'Our comprehensive package includes modular kitchen with quartz counter & chimney, floor-to-ceiling wardrobes with loft storage, TV entertainment wall with fluted panelling, false ceiling with ambient LED lighting, customized vanity units, civil tiling/painting work, and pre-cleared gate passes.'
  },
  {
    id: 10,
    q: 'How is GateLink Interiors different from hiring a local carpenter or contractor in Hyderabad?',
    a: 'Local carpenters construct manually on-site resulting in prolonged noise, dust complaints from neighbors, inconsistent manual finishing, and no warranty. GateLink uses German CNC laser edge-banding machines in a mechanized factory, finishes 90% of assembly off-site, and provides a 10-year warranty.'
  },
  {
    id: 11,
    q: 'What sets GateLink Interiors apart from other interior design companies in Hyderabad?',
    a: 'GateLink integrates directly with gated community management workflows: automatic gate pass clearance for materials, compliance with society silent-hour rules, dedicated on-site project managers, guaranteed 45-day move-in with delay penalty payout, and 146-point quality audits.'
  },
  {
    id: 12,
    q: 'Can I visit a GateLink Interiors experience centre in Hyderabad before deciding?',
    a: 'Yes! You can visit our flagship Experience Centres in Gachibowli and Kondapur to explore full-scale modular kitchens, touch and feel material finishes, inspect wardrobe organizers, and meet our senior architects for live 3D walkthroughs.'
  },
  {
    id: 13,
    q: 'Can I see a 3D design of my Hyderabad home before any work begins?',
    a: 'Yes, 100%! During your free consultation, our architects take exact laser floor measurements of your flat and create a photo-realistic 3D walkthrough with custom materials, lighting, and finishes so you can visualize every millimeter before paying a single rupee.'
  },
  {
    id: 14,
    q: 'What happens after I book a free consultation with GateLink Interiors in Hyderabad?',
    a: 'Within 2 hours of booking, our senior design lead contacts you to schedule an on-site visit or experience centre appointment. You will receive customized moodboards, a 3D space plan, and an itemized transparent quote within 48 hours.'
  }
];

export default function InteriorsFaq() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="interiors-faq-section">
      <div className="interiors-faq-container">
        {/* Section Header */}
        <div className="interiors-faq-header">
          <h2 className="interiors-faq-title">
            FAQs On Home Interiors In Hyderabad
          </h2>
        </div>

        {/* Minimalist Accordion List */}
        <div className="interiors-faq-list">
          {HYDERABAD_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className={`interiors-faq-item ${isOpen ? 'active' : ''}`}>
                <button
                  type="button"
                  className="interiors-faq-question-btn"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="interiors-faq-question-text">{faq.q}</span>
                  <span className={`interiors-faq-chevron-box ${isOpen ? 'rotated' : ''}`}>
                    <ChevronDown size={20} className="interiors-faq-chevron" />
                  </span>
                </button>

                {isOpen && (
                  <div className="interiors-faq-answer-wrapper">
                    <p className="interiors-faq-answer">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
