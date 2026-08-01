import React from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function CookiePolicyPage() {
  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="Cookie Policy - SocietySphere"
        description="Cookie Policy explaining browser storage, session cookies, and security tokens on SocietySphere."
        canonicalUrl="https://societysphere.com/cookies"
      />
      <Navbar onOpenDemo={() => {}} />

      <section style={{ paddingTop: '160px', paddingBottom: '60px', background: '#020617' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', lineHeight: 1.8, color: '#CBD5E1' }}>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', marginBottom: '24px' }}>Cookie Policy</h1>
          <p>Last updated: July 2026</p>
          <p>SocietySphere uses essential session cookies and local storage tokens to preserve role-isolated authentication sessions for Society Admins and Super Admins.</p>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
