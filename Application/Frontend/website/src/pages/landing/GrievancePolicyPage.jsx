import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Mail, Phone, MapPin, Clock, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function GrievancePolicyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Grievance Redressal Mechanism - GateLink" 
        description="Statutory Grievance Redressal Mechanism under IT Rules 2021 and DPDP Act 2023. Contact GateLink Nodal Grievance Officer."
        canonicalUrl="https://gatelink.in/grievance"
      />

      <Navbar />

      {/* Hero Header */}
      <header style={{ paddingTop: '120px', paddingBottom: '50px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0EA5E9', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#F59E0B', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
            <ShieldCheck size={14} /> IT Rules 2021 Statutory Mechanism
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.2, marginBottom: '12px' }}>
            Grievance Redressal Officer
          </h1>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '720px', lineHeight: 1.6 }}>
            Official statutory channel for addressing resident privacy concerns, data erasure requests, content complaints, and security escalations.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '50px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', padding: '36px', boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.05)', fontSize: '15px', lineHeight: 1.7, color: isDark ? '#CBD5E1' : '#334155' }}>
            
            <p style={{ fontSize: '16px', marginBottom: '28px' }}>
              In compliance with Rule 3(2) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong> and the <strong>Digital Personal Data Protection Act, 2023</strong>, GateLink Technologies has designated a Nodal Grievance Redressal Officer to handle resident data, privacy, and security concerns.
            </p>

            {/* Statutory Grievance Card */}
            <div style={{ background: isDark ? '#020617' : '#F1F5F9', borderRadius: '14px', border: '1px solid rgba(14, 165, 233, 0.3)', padding: '28px', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserCheck size={22} color="#0EA5E9" /> Designated Nodal & Grievance Redressal Officer
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>OFFICER NAME</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Nodal Grievance Redressal Officer</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>DESIGNATION</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Data Protection & Legal Counsel</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>OFFICIAL EMAIL</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0EA5E9' }}>
                    <a href="mailto:grievance@gatelink.in" style={{ color: '#0EA5E9', textDecoration: 'none' }}>grievance@gatelink.in</a>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>SUPPORT HELPLINE</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>+91 91218 63117</div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>CORPORATE ADDRESS</div>
                  <div style={{ fontSize: '14px', color: isDark ? '#E2E8F0' : '#334155' }}>
                    GateLink Technologies Private Limited<br />
                    Building 4B, Mindspace IT Park, HITEC City, Hyderabad, Telangana 500081, India.
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Timelines */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#0EA5E9" /> Grievance Resolution Timelines
            </h2>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><strong>Acknowledgment:</strong> Every submitted complaint ticket receives an official email acknowledgment with a unique tracking ID within <strong>24 hours</strong>.</li>
              <li><strong>Final Redressal:</strong> Grievance requests regarding data correction, account deletion, unauthorized access, or policy violations are fully investigated and resolved within <strong>15 working days</strong>.</li>
            </ul>

            {/* How to Submit */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="#0EA5E9" /> How to Submit a Grievance
            </h2>
            <p style={{ marginBottom: '12px' }}>
              Please include the following information in your grievance email to ensure speedy processing:
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Full Name and Registered Phone Number / Email ID.</li>
              <li>Registered Housing Society / RWA Name and Flat Number (if applicable).</li>
              <li>Clear description of the issue or data protection concern.</li>
              <li>Any supporting screenshots or documentation.</li>
            </ol>

          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
