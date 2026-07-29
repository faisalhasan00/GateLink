import React from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="Terms of Service - SocietySphere"
        description="Terms of Service and Enterprise SaaS License Agreement for SocietySphere."
        canonicalUrl="https://societysphere.com/terms"
      />
      <Navbar onOpenDemo={() => {}} />

      <section style={{ paddingTop: '160px', paddingBottom: '60px', background: '#020617' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', lineHeight: 1.8, color: '#CBD5E1' }}>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', marginBottom: '24px' }}>Terms of Service</h1>
          <p>Last updated: July 2026</p>
          <p>By registering your housing society or downloading SocietySphere mobile applications, you agree to these Terms of Service.</p>

          <h3 style={{ color: '#FFFFFF', marginTop: '28px' }}>1. SaaS License Grant</h3>
          <p>SocietySphere grants housing societies a non-exclusive, subscription-based license to access our platform for administrative, security, and resident management operations.</p>

          <h3 style={{ color: '#FFFFFF', marginTop: '28px' }}>2. 99.9% Platform SLA Guarantee</h3>
          <p>We guarantee 99.9% uptime SLA for critical visitor gatekeeper and emergency SOS alert systems.</p>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
