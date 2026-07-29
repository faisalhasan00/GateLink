import React from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="Privacy Policy - SocietySphere Platform"
        description="SocietySphere Privacy Policy detailing data protection, DPDP compliance, and 256-Bit SSL encryption."
        canonicalUrl="https://societysphere.com/privacy"
      />
      <Navbar onOpenDemo={() => {}} />

      <section style={{ paddingTop: '160px', paddingBottom: '60px', background: '#020617' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', lineHeight: 1.8, color: '#CBD5E1' }}>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', marginBottom: '24px' }}>Privacy Policy</h1>
          <p>Last updated: July 2026</p>
          <p>SocietySphere Inc. ("SocietySphere", "we", "our") is committed to protecting your privacy. This policy outlines how we collect, process, and safeguard personal data when housing societies, flat owners, security guards, and visitors use our platform.</p>

          <h3 style={{ color: '#FFFFFF', marginTop: '28px' }}>1. Information We Collect</h3>
          <p>We collect information provided directly by users, including names, flat numbers, contact details, vehicle numbers, visitor entry records, and digital payment receipts.</p>

          <h3 style={{ color: '#FFFFFF', marginTop: '28px' }}>2. Data Encryption & Security</h3>
          <p>All data transmitted to and from SocietySphere servers is encrypted using 256-Bit SSL TLS v1.3 encryption and stored on secure cloud infrastructure located within India.</p>

          <h3 style={{ color: '#FFFFFF', marginTop: '28px' }}>3. Data Rights & DPDP Compliance</h3>
          <p>Under the Digital Personal Data Protection Act (DPDP), residents have full rights to request access, correction, or erasure of their personal profile records.</p>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
