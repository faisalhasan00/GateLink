import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function BazaarFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Who is eligible to buy and sell on GateLink Bazaar?',
      a: 'Only verified residents and property owners whose flats are registered on GateLink within their society can list items or contact sellers. This eliminates anonymous scammers, bots, and external spam.'
    },
    {
      q: 'Is there any commission or fee for listing items?',
      a: 'No. GateLink Bazaar is 100% free with 0% platform commission forever. All transaction amounts go directly from the buyer to the seller without any intermediary deduction.'
    },
    {
      q: 'How does item inspection, pickup, and payment work?',
      a: 'Unlike public marketplaces where you have to coordinate couriers or travel across the city, Bazaar items are within your apartment complex. You can walk to the neighbor’s lobby, inspect the product in person, and pay directly via UPI (GPay/PhonePe) or cash upon satisfaction.'
    },
    {
      q: 'Can home bakers, chefs, and artists sell on Bazaar?',
      a: 'Yes! Hundreds of residents run weekend home bakeries, fresh sourdough deliveries, pottery, art pieces, and plant nurseries directly through GateLink Bazaar to their neighbors.'
    },
    {
      q: 'What happens if an item is already sold?',
      a: 'You can mark your listing as "Sold" in 1 tap from the resident app or mobile web. This instantly updates the status in the community feed so you won’t receive additional inquiries.'
    },
    {
      q: 'Can I rent out my spare covered parking slot or offer daily carpools?',
      a: 'Yes. GateLink Bazaar has a dedicated Parking & Carpooling category allowing verified residents to sublease vacant parking slots to neighbors or share daily office commute rides.'
    }
  ];

  return (
    <section id="faq" className="bazaar-faq-section">
      <div className="bazaar-section-header">
        <div className="bazaar-section-badge">
          <HelpCircle size={14} />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="bazaar-section-title">
          Everything You Need to Know About Bazaar
        </h2>
        <p className="bazaar-section-subtitle">
          Learn how GateLink ensures safe, frictionless peer-to-peer trading inside your apartment complex.
        </p>
      </div>

      <div className="bazaar-faq-container">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bazaar-faq-item">
            <button
              type="button"
              className="bazaar-faq-question"
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              aria-expanded={openIndex === idx}
            >
              <span>{faq.q}</span>
              <ChevronDown 
                size={20} 
                style={{
                  transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  color: '#059669',
                  flexShrink: 0
                }} 
              />
            </button>
            {openIndex === idx && (
              <div className="bazaar-faq-answer">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
