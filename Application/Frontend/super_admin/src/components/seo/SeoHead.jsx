import React, { useEffect } from 'react';

export default function SeoHead({
  title = 'SocietySphere - Complete Operating System for Gated Communities',
  description = 'Manage Visitors, Residents, Security, Maintenance Billing, Parking, and Amenities from one intelligent platform.',
  canonicalUrl = 'https://societysphere.com',
  schemaData = null
}) {
  useEffect(() => {
    // Dynamic document title update
    document.title = title;

    // Helper to update meta tag
    const updateMeta = (nameAttr, valueAttr, content) => {
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMeta('name', 'description', description);
    updateMeta('name', 'robots', 'index, follow');

    // OpenGraph meta tags
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:type', 'website');
    updateMeta('property', 'og:url', canonicalUrl);

    // Twitter Card meta tags
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);

    // Dynamic Schema.org JSON-LD Script tag
    if (schemaData) {
      let scriptElement = document.getElementById('seo-schema-jsonld');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'seo-schema-jsonld';
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schemaData);
    }
  }, [title, description, canonicalUrl, schemaData]);

  return null;
}
