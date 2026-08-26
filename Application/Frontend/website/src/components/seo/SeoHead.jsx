import React, { useEffect } from 'react';

export default function SeoHead({
  title = 'GateLink – Smart Society Management Software for Gated Communities',
  description = 'GateLink is the intelligent operating system for modern gated communities. Automate visitor entry, resident profiles, maintenance billing, gate security, and community communication.',
  canonicalUrl = 'https://gatelink.in',
  ogImage = 'https://gatelink.in/logo.png',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  schemaData = null
}) {
  useEffect(() => {
    // Dynamic document title update
    document.title = title;

    // Helper to update or create meta tags
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
    updateMeta('name', 'robots', robots);

    // Dynamic Canonical Link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // OpenGraph meta tags
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:type', 'website');
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('property', 'og:image', ogImage);
    updateMeta('property', 'og:site_name', 'GateLink India');

    // Twitter Card meta tags
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', ogImage);

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
  }, [title, description, canonicalUrl, ogImage, robots, schemaData]);

  return null;
}
